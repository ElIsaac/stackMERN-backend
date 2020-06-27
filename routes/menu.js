const express = require("express");
const md_isAuthenticated = require('../middlewares/authentication');
const controladorMenu=require("../controllers/menu");

router = express.Router();

router.get("/menu", controladorMenu.traerMenu);

router.post("/agregar-menu", [md_isAuthenticated.auth], controladorMenu.agregarMenu);

module.exports = router;