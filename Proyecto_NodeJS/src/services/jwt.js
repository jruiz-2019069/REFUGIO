"use strict"
//Importamos JWT-SIMPLE para la creacion de Tokens.
const jwt = require("jwt-simple");
const moment = require("moment");
//Nos servira para poder crear nuestros tokens.
const secretKey = "SecretKeyToExample";

exports.createToken = async (user) =>{
    try {
        //Parametros que se usaran para crear nuestro token.
        const payload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            role: user.role,
            //Tiempo de creación y usamos el formato unix para que sea en formato hexadecimal
            iat: moment().unix(),
            //Tiempo de finalizacion del token y usamos add para el tiempo que estara el token activo
            exp: moment().add(2, "hours").unix()
        }
        return jwt.encode(payload, secretKey);
    } catch (error) {
        return error;
    }
}

