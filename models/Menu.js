const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const menuSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    
    orden: {
        type: Number,
        unique: true,
        required: true
    },
    activo: {
        type: Boolean,
        required: true
    }
})


module.exports =mongoose.model("Menu", menuSchema);