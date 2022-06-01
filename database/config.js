const mongoose = require('mongoose');

const dbConnection = async() => {
	try{
		await mongoose.connect(process.env.DB_CNN);
		console.log('DB Online');

	} catch (error) {
		console.log(error);
		throw new error('Error en la bas de datos - Hable con el admin');
	}
}

module.exports = {
	dbConnection,
}