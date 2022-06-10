"use strict"
const User = require("../models/userModel");
const bcrypt = require("bcrypt-nodejs");

//Método para validar data.
exports.validateData = (data) =>{
    //Casteo de json a un arreglo.
    let keys = Object.keys(data);
    let msg = "";

    //Recorrer el arreglo para saber si se cumplen las condiciones.
    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== "") continue;
        msg += `El parámetro ${key} es obligatorio.\n`;
    }
    return msg.trim();
}

//Método para que no se repitan usuarios.
exports.alreadyExist =  (username) => {
    try{
    //Buscaremos coincidencias con el metodo findone y lean castea este objeto a un objeto javascript utilizable.
    let exist = User.findOne({username: username}).lean();
    return exist;
    }catch(err){
        return err;
    }
}

//Método para encriptar las constraseñas
exports.encrypt = async (password) =>{
    try {
        return bcrypt.hashSync(password);
    } catch (error) {
        return error;
    }
}

//Comparacion para verficar contraseña.
exports.checkPassword = async (password, hash) =>{
    try {
        //Comparamos el dato con el dato encriptado.
        return bcrypt.compareSync(password, hash);
    } catch (error) {
        return error;
    }
}

//Funcion para verificar el permiso
exports.checkPermission = async (userId, sub) =>{
    try {
        if(userId != sub){
            return false;
        }else{
            return true;
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Verificar la actulizacion
exports.checkUpdate = async (user) =>{
    try {
        if(user.password || Object.entries(user).length === 0 || user.role){
            return false;
        }else{
            return true;
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.deleteSensitiveData = async (data) => {
    try {
        delete data.animal.user;
        delete data.user.password;
        delete data.user.role;
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.checkForm = async (formulario) => {
    try {
        if(formulario.animal || formulario.user || formulario.date){
            return false;
        }else{
            return true;
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}