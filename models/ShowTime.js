const mongoose = require('mongoose');

const showTimeSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    timeStart: {
        type: String,
        required: true
    },
    timeEnd: {
        type: String,
        required: true
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', required: true
    },
    status: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

const ShowTime = mongoose.model('ShowTime', showTimeSchema);

module.exports = ShowTime;
