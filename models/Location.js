const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    ward: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    map: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
