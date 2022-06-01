const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, renewToken } = require('../controller/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
	check('name', 'Name is required').not().isEmpty(),
	check('password', 'Password is required').not().isEmpty().isLength({min: 6}),
	check('email', 'Enter valid email').not().isEmpty().isEmail(),
	validarCampos,
],createUser);

router.post('/', [
	check('password', 'Password is required').not().isEmpty().isLength({min: 6}),
	check('email', 'Enter valid email').not().isEmpty().isEmail(),
], login);

router.get('/renew', validarJWT, renewToken)


module.exports = router;