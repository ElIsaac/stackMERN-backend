const jwt = require('jwt-simple');
const moment = require('moment');
const usuario = require('../controllers/usuario');

const {SECRET_KEY} =require('./secret-key')

exports.accessToken = (usuario)=>{
    const payload={
        id: usuario._id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        fechaInicio: moment().unix(),
        fechaExpiracion: moment().add(5, "hours").unix()
    }
    return jwt.encode(payload, SECRET_KEY)
}

exports.refreshToken = (usuario)=>{
    const payload={
        id: usuario._id,
        fechaExpiracion: moment().add(30, "days").unix()
    }
    return jwt.encode(payload, SECRET_KEY)
}

exports.decodeToken = (token)=>{
    
    return jwt.decode(token, SECRET_KEY, true)
}

