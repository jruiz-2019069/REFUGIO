"use strict"
const express = require("express");
const userController = require("../controllers/userController");
const mdAuth = require("../services/authenticated");

//Creacion de enrutador para usar los métodos http.
const api = express.Router();

//Uso de métodos HTTP y asignación de cada URI a su respectiva función.
api.get("/test", [mdAuth.ensureAuth, mdAuth.idAdmin], userController.test);
api.post("/register", userController.register);
api.post("/login", userController.login);
api.put("/update/:id", mdAuth.ensureAuth, userController.update);
api.delete("/delete/:id", mdAuth.ensureAuth, userController.delete);

//Exportación de las URI del router.
module.exports = api;