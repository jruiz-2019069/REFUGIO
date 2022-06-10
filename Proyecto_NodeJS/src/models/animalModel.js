"use strict"
//Importacion de librería mongoose.
const mongoose = require("mongoose");

//Creación Esquema Animal.
const animalSchema = mongoose.Schema({
    name: String,
    description: String,
    age: Number,
    type: String,
    user: {type: mongoose.Schema.ObjectId, ref: "User"}//En el primer parámetro se le indica que el tipo será "ObjectId" y en el segundo parámetro se le indica la referencia al modelo.
});

//Creacion del modelo.
module.exports = mongoose.model("Animal", animalSchema);
