"use strict"
//IMPORTACIÓN DE LIBRERÍA MONGOOSE
const moongoose = require("mongoose");

//CREACIÓN DE ESQUEMA USUARIO
const userSchema = moongoose.Schema({
    name: String,
    surname: String,
    username: String,
    email: String,
    password: String,
    phone: String,
    role: String
});

//PARA LA CREACIÓN DEL MODELO ES NECESARIO USAR EL MÉTODO MODEL Y LLEVA DOS PARÁMETRO ("NOMBRE MODELO", ESQUEMA A EXPORTAR).
module.exports = moongoose.model("User", userSchema);