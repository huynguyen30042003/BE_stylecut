const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: {
        type: String, required: true
    },
    description: {
        type: String
    },
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }
    ],
    status: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
