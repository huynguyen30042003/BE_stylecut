const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', required: true
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    status: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
