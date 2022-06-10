"use strict"
const Animal = require("../models/animalModel");
const {validateData, checkUpdate} = require("../utils/validate");

//Funcion de testeo
exports.testAnimal = (req, res) => {
    return res.send({message: "testeo corriendo animal."});
}

exports.saveAnimal = async (req, res) => {
    try {
        const formulario = req.body;
        const data = {
            name: formulario.name,
            age: formulario.age,
            type: formulario.type,
            user: req.user.sub
        }
        const msg = validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            data.description = formulario.description;
            const animal = new Animal(data);
            await animal.save();
            return res.send({message: "¡Animal guardado exitósamente!"});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Búsqueda de todos los animales
exports.getAnimals = async (req, res) => {
    try {
        const animals = await Animal.find();
        return res.send({animals});
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Búsqueda de un animal
exports.getAnimal = async (req, res) => {
    try {
        const animalId = req.params.id;
        const animal = await Animal.findOne({_id: animalId});
        if(animal){
            return res.send({animal});
        }else{
            return res.send({message: "Animal no encontrado"});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Buscar animal (capturar los parametros, validar data obligatoria, buscar en DB)
exports.searchAnimal = async (req, res) => {
    try {
        const formulario = req.body;
        const data = {
            name: formulario.name
        };
        const msg = validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            const animal = await Animal.find({name: {$regex: formulario.name, $options: "i"}});
            return res.send({animal});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Actualizar Animal (IdAnimal, verificar que el usuario este enviando datos a actualizar, actualizar)
exports.updateAnimal = async (req, res) => {
    try {
        const formulario = req.body;
        const animalId = req.params.id;
        const check = await checkUpdate(formulario);
        if(check){
            if(formulario.user){
                const admin = await Animal.findOne({user: formulario.user}).populate("user");
                if(!admin || admin.user.role !== "ADMIN"){
                    return res.send({message: "El usuario a actualizar es un cliente. Ingrese un administrador por favor."});
                }else{
                    const updateAnimal = await Animal.findOneAndUpdate({_id: animalId}, formulario, {new: true}).populate("user");
                    updateAnimal.user.password = undefined;
                    updateAnimal.user.role = undefined;
                    return res.send({message: "Animal actualizado", updateAnimal});
                }
            }
        }else{
            return res.send({message: "Data no recibida."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Funcion para eliminar
exports.deleteAnimal = async (req, res) => {
    try {
        const animalId = req.params.id;
        const animalDeleted = await Animal.findOneAndDelete({_id: animalId});
        if(animalDeleted){
            return res.send({message: "¡Animal deleted!"});
        }else{
            return res.send({message: "Animal does not found."});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}


