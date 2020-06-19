
const Usuario = require('../models/Usuario');
const passport=require('passport');
const jwt =require('../services/jwt')

async function registrate(req, res){
    const {nombre, apellidos, email, contrasenia, confirmaContrasenia, rol, activo}=req.body;
    try{
        if(nombre===""|| apellidos===""|| email===""|| contrasenia ===""|| confirmaContrasenia ===""){
            res.json({"mensaje":"tiene que llenar todos los campos"})
        }
        if(contrasenia!==confirmaContrasenia){
            res.json({"mensaje":"sus contrasenias son diferentes"})
        }
        if(contrasenia.length <= 4){
            res.json({"mensaje":"la contraseña debe de ser mayor a 4 caracteres"})
        }
        const nuevoUsuario=new Usuario({
            nombre:nombre,
             apellidos:apellidos,
             email:email.toLowerCase(),
             rol:"admin",
             activo:false
        })
        nuevoUsuario.contrasenia = await nuevoUsuario.encriptar(contrasenia)
        await nuevoUsuario.save()
        res.status(200).json({"mensaje": "usuario guardado"})
    }catch(err){
        res.status(400).json({"mensaje": "Ese email actualmente ya esta en uso"})
    }
}

async function iniciaSesion(req, res){
    const usuario = await Usuario.findOne({ email: req.body.email });
    try {

        if (!usuario) {
            res.status(404).json({ mensaje: "ese usuario no existe" })
        }

        const contraseniaValida = await usuario.matchPassword(req.body.contrasenia, usuario.contrasenia);
        if (!contraseniaValida) {
            res.status(400).json({ mensaje: "contraseña incorrecta" })
        }
        if(!usuario.activo){
            res.status(200).json({mensaje:"Su usuario esta inactivo, comuniquese con un administrador"})
        }else{
            res.json({
                AccessToken: jwt.accessToken(usuario),
                RefreshToken: jwt.refreshToken(usuario)
            })
        }

        //res.status(200).json({ auth: true, token });
    } catch (e) {
        console.log(e)
        res.status(500).json({ mensaje: "no se pudo iniciar     "+e });
    }
}

async function traerUsuarios(req, res){
    try {
        const usuarios = await Usuario.find();
        if(!usuarios){
            res.status(404).json({"mensaje":"Aun no hay usuarios"})
        }
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(400).json({"mensaje":"Error del servidor. "+error})
    }
}

module.exports ={
    registrate,
    iniciaSesion,
    traerUsuarios
};