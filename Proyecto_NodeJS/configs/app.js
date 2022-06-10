"use strict"
//IMPORTACIONES DE LIBRERÍAS
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("../src/routes/userRoutes");
const AnimalRoutes = require("../src/routes/animalRoutes");
const AppointmentRoutes = require("../src/routes/appointmentRoutes");

//INSTANCIA DE EXPRESS
const app = express();

//CONFIGURACIONES INTERNAS DE EXPRESS
app.use(helmet());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

//CONFIGURACIONES DE SOLICITUS A NUESTRO SERVIDOR EXPRESS.
app.use("/usuarios", userRoutes);
app.use("/animales", AnimalRoutes);
app.use("/citas", AppointmentRoutes);

//EXPORTACION DE NUESTRA INSTANCIA EXPRESS CON LA CONFIGURACIONES YA REALIZADAS
module.exports = app;