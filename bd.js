const mongoose=require('mongoose')

const portMDB = 27017;
const {API_VERSION, IP_SERVER, PUERTO_MDB}=require('./config');

mongoose.connect(`mongodb://${IP_SERVER}:${PUERTO_MDB}/api-mern`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(db=>{
    console.log('base de datos conectada')
    
}).catch(err=>console.log(err))


