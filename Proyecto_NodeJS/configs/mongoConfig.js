"use strict"
const mongoose = require("mongoose");

//CREACIÓN DE FUNCIÓN PARA CONECTARSE A LA BASE DE DATOS
function init(){
    //Línea de conexión
    const uriMongoDB = "mongodb://127.0.0.1:27017/ejemplo2DB";

    //Creación de promesa para que mongoose este siempre a la escucha del servicio de MongoDB.
    mongoose.Promise = global.Promise;

    //Por si da error la conexión.
    mongoose.connection.on("error", () => {
        console.log("Error en la conexión a la base de datos.");
        mongoose.disconnect();
    });

    //Por si se esta conectando a la base de datos.
    mongoose.connection.on("connecting", () => {
        console.log("Conectando a MongoDB.");
    });

    //Por si ya se conecto a MongoDB pero no a la base de datos.
    mongoose.connection.on("connected", () => {
        console.log("Conectado a MongoDB");
    });

    //Por si ya se conectó a MongoDB y a la base de datos.
    mongoose.connection.once("open", () => {
        console.log("Conexión exitosa a la base de datos.");
    });

    //Por si de desconecto por alguna razón pero se volvió a reconectar.
    mongoose.connection.on("reconnected", () => {
        console.log("Reconectado exitosamente a MongoDB.");
    });

    //Por si se desconectó y por alguna razón no se pude reconectar otra vez.
    mongoose.connection.on("disconnected", () => {
        console.log("Error en la reconexión a MongoDB");
    });

    mongoose.connect(uriMongoDB,{
        maxPoolSize: 10,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }).catch(err => console.log(err));
}

module.exports = {init};