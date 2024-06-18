const mongoose = require('mongoose');
const {Schema} = mongoose;

const transactionSchema = new Schema({
    originCoin: {
        type: String,
        required: true
    },
    originAmount: {
        type: Number,
        required: true
    },
    destinationCoin: {
        type: String,
        required: true
    },
    destinationAmount: {
        type: Number,
        required: true
    },
    emailClient: {
        type: String,
        required: true
    },
    conversionRate: {
        type: Number,
        required: true
    },
},{collection: "transactions"});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);