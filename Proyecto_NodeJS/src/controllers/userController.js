"use strict"
//Importar el modelo de usuario
const User = require("../models/userModel");
const {validateData, alreadyExist, encrypt, checkPassword, checkPermission, checkUpdate} = require("../utils/validate");
const jwt = require("../services/jwt");

exports.test = (req, res) => {
    return res.send({message: "Metodo prueba corriendo"});
}


//Método registrar.
exports.register = async (req, res) =>{
    try {
    //Almacenamos el formulario completo.
    let formulario = req.body;

    //Establecemos cuales seran los campos obligatorios para guardar un usuario.
    const data = {
        name: formulario.name,
        username: formulario.username,
        email: formulario.email,
        password: await encrypt(formulario.password),
        role: "CLIENTE"
    }
    //Almacena el resultado de la funcion.
    let msg = validateData(data);

    if(!msg){
        let exist = await alreadyExist(formulario.username);
        if(!exist){
            data.surname = formulario.surname;
            data.phone = formulario.phone;
            let usuario = new User(data);
            await usuario.save();
            res.send({message: "Usuario agregado!!"});
        }else{
            res.send({message: "Nombre de usuario existente, escriba otro por favor."});
        }
    }else{
        return res.send(msg);
    }
    } catch (error) {
        return error;
    }
}

exports.login = async (req, res) =>{
    try {
        //Capturamos el formulario con todos sus valores.
        const formulario = req.body;  
        //Data obligatoria para logearse.
        let data = {
            username: formulario.username,
            password: formulario.password
        }
        //Almaceno el valor de la funcion.
        let msg = validateData(data);
        if(!msg){
            let userExist = await alreadyExist(formulario.username);
            if(userExist && await checkPassword(formulario.password, userExist.password)){
                //Creamos el token
                const token = await jwt.createToken(userExist);
                return res.send({userExist, message: "Usuario logeado", token});
            }else{
                return res.status(404).send({message: "Credenciales incorrectas."});
            }
        }else{
            return res.status(400).send(msg);
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.update = async (req, res) =>{
    try {
        //Obtenemos el Id de la URL.
        const userId = req.params.id;
        //Datos del formulario a actualizar.
        const formulario = req.body;

        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false){
            return res.status(401).send({message: "No tiene permiso para actualizar."});
        }else{
            const notUpdate = await checkUpdate(formulario);
            if(notUpdate === false){
                return res.send({message: "Estos parámetros solo el administrador puede actualizarlos."});
            }else{
                const already = await alreadyExist(formulario.username);
                if(!already){
                    const userUpdated = await User.findOneAndUpdate({_id: userId}, formulario, {new: true}).lean();
                    return res.send({userUpdated, message: "Usuario actualizado"});
                }else{
                    return res.send({message: "El nombre ya esta en uso."})
                }
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.delete = async (req, res) => {
    try {
        const userId = req.params.id;
        if(await checkPermission(userId, req.user.sub)){
            const userDeleted = await User.findOneAndDelete({_id: userId});
            return res.send({userDeleted, message: "Cuenta eliminada."});
        }else{
            return res.status(403).send({message: "¡No tiene permiso para eliminar!"});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}