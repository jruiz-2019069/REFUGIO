"use strict"
const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const mdAuth = require("../services/authenticated");

const api = express.Router();

api.get("/testCita", appointmentController.citaPrueba);
api.post("/createAppointment", mdAuth.ensureAuth, appointmentController.createAppointment);
api.get("/getAppointments", mdAuth.ensureAuth, appointmentController.getAppointments);
api.put("/updateAppointment/:id", mdAuth.ensureAuth, appointmentController.updateAppointment);
api.put("/updateStatus/:id", [mdAuth.ensureAuth, mdAuth.idAdmin], appointmentController.updateStatus);


module.exports = api;