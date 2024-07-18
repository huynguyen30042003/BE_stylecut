const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
