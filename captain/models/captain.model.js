const mongoose = require('mongoose');


const captainSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,

    },
    password:{
        type: String,
        required: true,
    },
    isAvilabe:{
        type: Boolean,
        default: false,
       
    }
})

module.exports = mongoose.model('captain', captainSchema)