const mongoose = require('mongoose');
const {Schema} = mongoose;

const ticketSchema = new Schema({
    price:{
        type: Number,
        required: true
    },
    categoryExpectant:{
        type: String,
        required: true
    },
    purchaseDate:{
        type: String,
        required: true
    },
    expectant:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Expectant',
        required: true
    }
}, { collection: 'tickets' });

module.exports = mongoose.models.Ticket || mongoose.model('Ticket',ticketSchema);