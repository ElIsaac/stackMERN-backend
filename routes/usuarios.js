const express=require('express')
const multipart = require('connect-multiparty')
const controladorUsuario=require('../controllers/usuario');
const md_isAuthenticated = require('../middlewares/authentication')
const md_upload_avatar= multipart({uploadDir: "./uploads/avatar"})

router=express.Router();

router.post("/registrate", controladorUsuario.registrate);
router.post("/inicia-sesion", controladorUsuario.iniciaSesion);

router.get("/usuarios",[md_isAuthenticated.auth], controladorUsuario.traerUsuarios);
router.get("/usuarios-activos",[md_isAuthenticated.auth], controladorUsuario.traerUsuariosActivos);
router.get("/traer-avatar/:avatarName", controladorUsuario.getAvatar)

router.delete("/usuarios/:id", [md_isAuthenticated.auth], controladorUsuario.borrarUsuarios);

router.put("/actualizar-usuario/:id", [md_isAuthenticated.auth], controladorUsuario.updateUser);
router.put("/subir-avatar/:id", [md_isAuthenticated.auth, md_upload_avatar], controladorUsuario.uploadAvatar)


module.exports = router;

