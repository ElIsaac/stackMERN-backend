
const Usuario = require('../models/Usuario');

async function iniciaSesion(req, res){
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
             email:email,
             rol:"admin",
             activo:false
        })
        nuevoUsuario.contrasenia = await nuevoUsuario.encriptar(contrasenia)
        await nuevoUsuario.save()
        res.status(200).json({"mensaje": "usuario guardado"})
    }catch(err){
        res.status(400).json({"mensaje": ""+err})
    }
}

module.exports ={
    iniciaSesion
};