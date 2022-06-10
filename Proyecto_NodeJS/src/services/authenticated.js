"use strict"
/*Verificar que el token sea valido y 
  Verificar que no haya expirado el token.*/

const jwt = require("jwt-simple");
const secretKey = "SecretKeyToExample";

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).send({message: "La petición no contiene la cabecera de autenticación."});
    }else{
        try {
            //Obtenemos el token de la solicitud
            let token = req.headers.authorization.replace(/['"]+/g, "");
            //Validamos que el token sea válido desencriptandolo.
            let payload = jwt.decode(token, secretKey);
            req.user = payload;
            next();
        } catch (error) {
            console.log(error);
            return res.status(400).send({message: "El token no es válido."});
        }
    }
}

exports.idAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        if(user.role === "ADMIN"){
            next();
        }else{
            return res.status(403).send({message: "Usuario no autorizado."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}
