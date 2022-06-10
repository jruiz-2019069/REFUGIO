"use strict"

const Appointment = require("../models/appointmentModel");
const {validateData, deleteSensitiveData, checkPermission, checkUpdate, checkForm} = require("../utils/validate");
const Animal = require("../models/animalModel");

exports.citaPrueba = (req, res) => {
    return res.send({message: "Prueba corriendo"});
}

exports.createAppointment = async (req, res) => {
    try {
        const formulario = req.body;
        const data = {
            date: formulario.date,
            animal: formulario.animal,
            user: req.user.sub,
            status: "CREATED"
        }
        const msg = validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            const animal = await Animal.findOne({_id: formulario.animal});
            if(animal){
                const alradyAppointment = await Appointment.findOne({$and: [{animal: data.animal}, {user: data.user}]});
                if(alradyAppointment){
                    return res.send({message: "¡Esta cita ya fue creada!"});
                }else{
                    const dateAlready = await Appointment.findOne({$and: [{date: data.date}, {user: data.user}]});
                    if(dateAlready){
                        return res.send({message: "Ya tiene una cita agendada a esa hora."});
                    }else{
                        const appo = new Appointment(data);
                        await appo.save();
                        return res.send({message: "¡Cita creada exitósamente!"});
                    }
                }
            }else{
                return res.send({message: "¡El animal no existe!"});
            }
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}


exports.getAppointments = async (req, res) => {
    try {
        const userId = req.user.sub;
        const appointments = await Appointment.find({user: userId})
            .populate("user")
            .populate("animal")
            .lean();
          
        if(appointments){
            const clearAppointments = [];
            for(let appo of appointments){
                clearAppointments.push(await deleteSensitiveData(appo));
            }
            return res.send({clearAppointments});
        }else{
            return res.send({message: "Citas no encontradas"});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//FUNCIÓN PARA ACTUALIZAR UNA CITA
exports.updateAppointment = async (req, res) => {
    try {
        const formulario = req.body;
        const userId = req.user.sub;
        const appoId = req.params.id;
        const checkData = await checkUpdate(formulario);
        if(checkData){
            const searchAppo = await Appointment.findOne({_id: appoId});
            if(searchAppo){
                const verifyAuth =  await checkPermission(searchAppo.user, userId);
                if(verifyAuth){
                    if(formulario.user || formulario.status){
                        return res.send({message: "You can not update user nor status."});
                    }else{
                        if(formulario.animal){
                            const animalExist = await Animal.findOne({_id: formulario.animal});
                            if(animalExist){
                                const checkUserAnimal = await Appointment.findOne({$and: [{user: userId}, {animal: formulario.animal}]});
                                const checkUserDate = await Appointment.findOne({$and: [{user: userId}, {date: formulario.date}]});
                                if(checkUserAnimal || checkUserDate){
                                    return res.send({message: "This appointment already created."});
                                }else{
                                    const appoUpdated = await Appointment.findOneAndUpdate({_id: appoId}, formulario, {new: true})
                                        .populate("user")
                                        .populate("animal").lean();
                                    const deleteData = await deleteSensitiveData(appoUpdated);
                                    return res.send({message: "¡Appointment updated!", deleteData});
                                }
                            }else{
                                return res.send({message: "Animal does not exist."});
                            }
                        }else{
                            //Caso cuando no viene el animal en el body.
                            const checkUserAnimal = await Appointment.findOne({$and: [{user: userId}, {animal: formulario.animal}]});
                            const checkUserDate = await Appointment.findOne({$and: [{user: userId}, {date: formulario.date}]});
                            if(checkUserAnimal || checkUserDate){
                                return res.send({message: "This appointment already created."});
                            }else{
                                const appoUpdated = await Appointment.findOneAndUpdate({_id: appoId}, formulario, {new: true})
                                    .populate("user")
                                    .populate("animal").lean();
                                const deleteData = await deleteSensitiveData(appoUpdated);
                                return res.send({message: "¡Appointment updated!", deleteData});
                            }
                        }
                    }
                }else{
                    return res.send({message: "You can not update this appointment."});
                }
            }else{
                return res.send({message: "Appointments does not found."});
            }
        }else{
            return res.send({message: "¡Form empty!"});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

//FUNCIÓN PARA CAMBIAR STATUS DE CITA
exports.updateStatus = async (req, res) => {
    try {
        const formulario = req.body;
        const appoId = req.params.id;
        const data = {
            status: formulario.status
        }
        const checkFormulario = await checkForm(formulario);
        if(checkFormulario){
            const msg = validateData(data);
            if(msg){
                return res.send(msg);
            }else{
                const appoUpdated = await Appointment.findOneAndUpdate({_id: appoId}, formulario, {new: true})
                    .populate("user")
                    .populate("animal").lean();
                const deleteData = await deleteSensitiveData(appoUpdated);
                return res.send({message: "¡Status updated!", deleteData});
            }  
        }else{
            return res.send({message: "¡This function only update the status!"});
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}