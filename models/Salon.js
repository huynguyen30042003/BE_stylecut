const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
    description: {
        type: String
    },
    staffs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }],
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    combos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combo'
    }],
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    images: {
        type: [String]
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

const Salon = mongoose.model('Salon', salonSchema);

module.exports = Salon;
