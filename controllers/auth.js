const moment = require('moment');
const jwt = require('../services/jwt')
const Usuario = require('../models/Usuario')


function expireToken(token) {
    try{
        const { exp } = jwt.decodeToken(token);
    const currentDate = moment().unix();

    if (currentDate > exp) {
        return true
    }
    else {
        return false;
    }
    }catch(err){
        return "bad token";
    }
}

async function refreshAccessToken(req, res) {

    //trae el refreshToken
    const { refreshToken } = req.body;
    //verifica si el token ya ha expirado
    const isExpire = expireToken(refreshToken)
    if (isExpire==="bad token") {
        res.status(400).json({ mensaje: "Token corrupto" })
    }
    const { id } = jwt.decodeToken(refreshToken)

    console.log(isExpire)
    if (isExpire==="bad token") {
        res.status(400).json({ mensaje: "Token corrupto" })
    }
    if (isExpire) {
        res.status(403).json({ mensaje: "El refresh token ya expiro" })
    } else {
        try {
            const usuario = await Usuario.findById(id)
            if (!usuario) {
                res.status(404).json({ mensaje: "El usuario no existe" })
            } else {
                res.status(200).json({
                    accessToken: jwt.accessToken(usuario),
                    refreshToken: refreshToken
                })
            }

        } catch (err) {
            res.status(400).json({ mensaje: "Error del servidor" })
        }
    }

}
module.exports = {
    refreshAccessToken
}