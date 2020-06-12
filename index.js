const express = require('express');
const bodyParser = require('body-parser');


const {API_VERSION, IP_SERVER}=require('./config')

//inicializaciones
const app=express();
require('./bd')

//carga de rutas
const rutasUsuarios = require('./routes/usuarios')


//configuracion
app.set('port', process.env.PORT || 4000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//uso de rutas


app.use(`/api/${API_VERSION}/`,rutasUsuarios);


//cabeceras HTTP

//router basic
app.listen(app.get('port'), ()=>{
    console.log('servidor en puerto',app.get('port'))
    console.log(`http://${IP_SERVER}:${app.get('port')}/`)
})


