const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    businessName: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    username: {
        type: String,
        required: false,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: false,
        sparse: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    refCode: {
        type: String,
        default: ""
    },
    Country: {
        type: String,
        required: false,
        default: "India",
        trim: true
    },
    state: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    district: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    city: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    pinCode: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    gstTax: {
        type: String,
        default: ""
    },
    panNumber: {
        type: String,
        default: ""
    },
    fullAddress: {
        type: String,
        required: false,
        default: "",
        trim: true
    }
}, { timestamps: true });

const user = mongoose.models.users || mongoose.model('users', userSchema);
module.exports = user;
