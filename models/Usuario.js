const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bcrypt = require('bcryptjs')

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    contrasenia: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    activo: Boolean
})

usuarioSchema.methods.encriptar = async contrasenia =>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(contrasenia, salt);
}

usuarioSchema.methods.matchPassword = async contrasenia =>{
    return await bcrypt.compare(contrasenia, this.contrasenia);
}

module.exports =mongoose.model("Usuario", usuarioSchema);