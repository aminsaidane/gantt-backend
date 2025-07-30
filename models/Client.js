const mongoose = require('mongoose');

const {Schema} = mongoose;


const clientSchema = new Schema({
    name:String,
    type:{
       type:String,
       enum :[
        'Particulier','Pro'
       ]
    },
    comptuer:Number,
    localisation:String
})

module.exports = mongoose.model('Client',clientSchema);
