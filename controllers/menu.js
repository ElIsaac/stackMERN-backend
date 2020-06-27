const Menu = require("../models/Menu")

async function actualizarMenu(req,res){
    let id=req.params.id;
    try{
        
        const resultado=await Menu.findByIdAndUpdate(id, req.body)
        if(!resultado){
            res.status(400).json({mensaje: "Error: no se encontrado el menu con ese id"})
        }else{
            res.status(200).json({mensaje: "Menu actualizado corrrectamente"})
        }
    }catch(err){
        res.status(500).json({mensaje:"Error del servidor. "+err.message})
    }
}


async function agregarMenu(req,res){
    try{
        const menu = new Menu(req.body)
        const resultado=await menu.save()
        if(!resultado){
            res.status(400).json({mensaje: "Error: no se ha podido crear el menu"})
        }else{
            res.status(200).json({mensaje: "Menu creado corrrectamente"})
        }
    }catch(err){
        res.status(500).json({mensaje:"Error del servidor. "+err.message})
    }
}

async function traerMenu(req,res){
    try{
        const menu = await Menu.find().sort({orden: "asc"})
        if(!menu){
            res.status(400).json({mensaje: "Error: aun no hay menus registrados"})
        }else{
            res.status(200).json({menu})
        }
    }catch(err){
        res.status(500).json({mensaje:"Error del servidor. "+err.message})
    }
}


module.exports ={
    traerMenu,
    agregarMenu,
    actualizarMenu
}