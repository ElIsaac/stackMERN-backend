const fs = require('fs')
const path = require('path')
const Usuario = require('../models/Usuario');
const passport=require('passport');
const jwt =require('../services/jwt');
const { exists } = require('../models/Usuario');

async function registrarGeneral(req, res, activoVar){
    const {nombre, apellidos, email, contrasenia, confirmaContrasenia, rol, activo}=req.body;
    try{
        if(nombre===""|| apellidos===""|| email===""|| contrasenia ===""|| confirmaContrasenia ==="" || !confirmaContrasenia ){
            res.json({"mensaje":"tiene que llenar todos los campos"})
        }
        if(contrasenia!==confirmaContrasenia){
            res.json({"mensaje":"sus contrasenias son diferentes"}).status(400)
        }
        if(contrasenia.length < 4){
            res.json({"mensaje":"la contraseña debe de ser mayor a 4 caracteres"}).status(400)
        }
        const nuevoUsuario=new Usuario({
            nombre:nombre,
             apellidos:apellidos,
             email:email.toLowerCase(),
             rol:"admin",
             activo:activoVar
        })
        nuevoUsuario.contrasenia = await nuevoUsuario.encriptar(contrasenia)
        await nuevoUsuario.save()
        res.status(200).json({"mensaje": "usuario guardado"})
    }catch(err){
        res.status(400).json({"mensaje": "Error: Algo ha ocurrido en el servidor"+err})
    }
}

async function registrate(req, res){
    registrarGeneral(req, res, false)
}

async function registrarAdmin(req, res){
    registrarGeneral(req, res, true)
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

async function traerUsuariosActivos(req, res){
    const query = req.query;
    try {
        const usuarios = await Usuario.find({ activo: query.activo });
        if(!usuarios){
            res.status(404).json({"mensaje":"Aun no hay usuarios"})
        }
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(400).json({"mensaje":"Error del servidor. "+error})
    }
}
async function borrarUsuarios(req,res){
    const id = req.params.id
    try {
        const eliminar = await Usuario.findByIdAndDelete(id)
        if(!eliminar){
            res.status(400).json({"mensaje":"El usuario no existe"})
        }
        
        res.status(200).json({"mensaje":"Usuario Eliminado"})
        console.log(eliminar)
    } catch (error) {
        res.status(400).json({"mensaje":"Error del servidor. "+error})
    }
}

async function uploadAvatar(req, res){
    const {id} = req.params
    try{
        const usuario=await Usuario.findById(id)
         if(!usuario){
            res.status(404).json({"mensaje": "Usuario no encontrado"})
        } 
        let datosUsuario=usuario;
        if(req.files){
            let filePath = req.files.avatar.path;
            let fileSplit = filePath.split('\\');
            let fileName = fileSplit[2];

            let extSplit = fileName.split("."); 
            let extName = extSplit[1].toLowerCase() 

            if( extName=== "png" || extName=== "jpg" ){
                usuario.avatar = fileName
                try{
                    const usuarioActualizado = await Usuario.findByIdAndUpdate({_id: id}, usuario)
                    if(!usuarioActualizado){
                        res.status(404).json({mensaje: "Usuario no encontrado"})
                    }else{
                        res.status(200).json({avatarName: fileName})
                    }
                }catch(err){
                    res.status(500).json({mensaje: "error del servidor"})
                }
                
                res.send('ok')
            }else{
                res.status(400).json({mensaje: "Solo puede subir imagenes jpg y png"})
            }
        }
    }catch(err){
        res.json({mensaje: "Error del servidor"+err}).status(500);
    }
}

function getAvatar(req, res){
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/"+avatarName;

    fs.exists(filePath, exists =>{
        if(!exists){
            res.status(404).json({mensaje: "el avatar no existe"})
        }else{
            res.sendFile(path.resolve(filePath))
        }
    })
}

async function updateUser(req, res){
    let userData=req.body;
    userData.email=req.body.email.toLowerCase();
    const id = req.params.id;
    try{
        if(req.body.contrasenia && req.body.confirmaContrasenia){
            if(req.body.contrasenia !== req.body.confirmaContrasenia){
                return res.status(400).json({mensaje: "Error: Las contraseñas no coinciden"})
            }
            if(req.body.contrasenia.length<4){
                return res.status(400).json({mensaje: "Error: La contraseña debe de ser mayor a 4 caracteres"})
            }
            const usuarioMethods = new Usuario();
            userData.contrasenia = await usuarioMethods.encriptar(req.body.contrasenia)
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate({_id: id}, userData)
        if(!usuarioActualizado){
            res.status(404).json({mensaje: "Error: No se ha encontrado el usuario "})

        }
        res.status(200).json({mensaje: "Usuario Actualizado"})
    }catch(err){
        res.status(500).json({mensaje: "Error: Algo ha ocurrido en el servidor. "+err})
    }

}

async function activateUser(req, res){
    const id = req.params.id;
    try{
        const usuarioActualizado = await Usuario.findByIdAndUpdate({_id: id}, {activo:req.body.activo})
        if(!usuarioActualizado){
            res.status(404).json({mensaje: "Error: No se ha encontrado el usuario. "})
        }
        let estado
        if(req.body.activo==false){
            estado = "desactivado"
        }else{
            estado="activado"
        }
        res.status(200).json({mensaje: "Usuario "+estado+" correctamente"})
        console.log(usuarioActualizado)
    }catch(err){
        res.status(500).json({mensaje: "Error: Algo ha ocurrido en el servidor. "+err})
        console.log(err)
    }
}



module.exports ={
    registrate,
    iniciaSesion,
    traerUsuarios,
    traerUsuariosActivos,
    borrarUsuarios,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    registrarAdmin
};