const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
    totalPrice: {
        type: Number,
        required: true
    },
    actualPayment: {
        type: Number,
    },
    salon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }
    ],
    combos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Combo'
        }
    ],
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'VNPay', 'MoMo'],
        required: true
    },
    paymentInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
}, {
    timestamps: true
});

// Method to calculate actual payment
appointmentSchema.methods.calculateActualPayment = async function () {
    let discount = 0;

    // Check if the booking is made 2 days in advance
    const today = new Date().getDay();
    const bookingDate = new Date(this.date).getDay();
    const daysDiff = bookingDate - today;
    if (daysDiff >= 2) {
        discount = Math.max(discount, 20);
    }
    // Check if the customer has multiple bookings
    const appointments = await mongoose.model('Appointment').countDocuments({ customer: this.customer });
    if (appointments > 1) {
        discount = Math.max(discount, 25);
    }
    // Apply the highest discount
    this.actualPayment = this.totalPrice * (1 - discount / 100);
};

appointmentSchema.pre('save', async function (next) {
    await this.calculateActualPayment();
    next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
