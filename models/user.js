const mongoose = require("mongoose"); //para mostrar como se van a ver nuestros datos en mongodb
const bcrypt = require('bcrypt-nodejs');
const { Schema } = mongoose; //para usar su esquema



const userSchema = new Schema({
    nickname: String,
    email: String,
    password: String,
    
});

userSchema.methods.encryptPassword = (password) => { //para encriptar la clave
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); //genera algoritmo de encriptaciion 10 veces // tiene que retornarlo

};

userSchema.methods.validarPassword = function(password) { //comparar la clave
    return bcrypt.compareSync(password, this.password);
}
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema); //para exportar los datos a otras partes donde se van a usar