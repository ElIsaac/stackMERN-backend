const express=require('express')
const controladorUsuario=require('../controllers/usuario');
const isAuthenticated = require('../middlewares/authentication')

router=express.Router();

router.post("/registrate", controladorUsuario.registrate);
router.post("/inicia-sesion", controladorUsuario.iniciaSesion);
router.get("/usuarios",[isAuthenticated.auth], controladorUsuario.traerUsuarios);

module.exports = router;

