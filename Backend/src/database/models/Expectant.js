const mongoose = require('mongoose');
const {Schema} = mongoose;

const expectantSchema = new Schema({
    surname:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    dni:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    }
}, { collection: 'expectants' });

module.exports = mongoose.models.Expectant || mongoose.model('Expectant',expectantSchema);