const express=require('express')
const controladorUsuario=require('../controllers/usuario');

api=express.Router();

api.post("/inicia-sesion", controladorUsuario.iniciaSesion);
module.exports = api;

