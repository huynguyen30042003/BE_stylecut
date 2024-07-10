const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
}, {
    timestamps: true
});

reviewSchema.methods.populateCustomer = async function () {
    await this.populate('customer', '_id name email phone avatar');
    return this;
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
