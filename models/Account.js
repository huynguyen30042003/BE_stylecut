const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Customer', 'Staff', 'Admin'],
        default: 'Customer'
    },
    avatar: {
        type: String
    },
    phone: {
        type: String,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

accountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

accountSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
