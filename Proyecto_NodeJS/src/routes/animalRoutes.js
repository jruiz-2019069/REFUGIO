"use strict"
const express = require("express");
const animalController = require("../controllers/animalController");
const mdAuth = require("../services/authenticated");

const api = express.Router();

api.get("/testAnimal", animalController.testAnimal);
api.post("/saveAnimal", [mdAuth.ensureAuth, mdAuth.idAdmin], animalController.saveAnimal);
api.get("/getAnimals", mdAuth.ensureAuth, animalController.getAnimals);
api.get("/getAnimal/:id", mdAuth.ensureAuth, animalController.getAnimal);
api.post("/searchAnimal", mdAuth.ensureAuth, animalController.searchAnimal);
api.put("/updateAnimal/:id", [mdAuth.ensureAuth, mdAuth.idAdmin], animalController.updateAnimal);
api.delete("/deleteAnimal/:id", [mdAuth.ensureAuth, mdAuth.idAdmin], animalController.deleteAnimal);

module.exports = api;