const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String]
    },
    description: {
        type: String
    },
    duration: {
        type: Number,
        required: true // Duration in minutes
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    status: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
