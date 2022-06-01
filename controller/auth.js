const { response } = require('express');
const User = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
	const {email, password} = req.body;
	try {
		const existeEmail = await User.findOne({email});
		if(existeEmail) {
			return res.status(400).json({
				ok: false,
				msg: 'El correo ya esta registrado'
			})
		}
		const user = new User(req.body);

		// ENCRIPTAR CONTRASE;A
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt)
		await user.save();

		// Generar JSON WEB TOKEN
		const token = await generateJWT(user.id);
		res.json({
			ok: true,
			user,
			token
		})
				
  } catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Hable con el Administrador'
		})
	}
}

const login = async (req, res = response) => {
	const {email, password} = req.body;
	try {
		const usuarioDB = await User.findOne({email});
		if(!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: 'Email no encontrado'
			});
		}
		const validPassword = bcrypt.compareSync(password, usuarioDB.password);
		if(!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Password no valido'
			})
		}
		const token = await generateJWT(usuarioDB.id);
		res.json({
			ok: true,
			user: usuarioDB,
			token

		})

	} catch (error){
		console.log(error);
		return res.json({
			ok: false,
			msg: 'Hable con el Admin'
		})
	}
}

const renewToken = async (req, res = response) => {
	const uid = req.uid;
	const token = await generateJWT(uid);
	const user = await User.findById(uid)

	res.json({
		ok: true,
		user,
		token
	})

}

module.exports = { 
	createUser,
	login,
	renewToken
}