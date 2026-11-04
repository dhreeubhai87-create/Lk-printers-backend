const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    email:{
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
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refCode: {
        type: String,

    },
    Country: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    pinCode: {
        type: String,
        required: true,
        trim: true
    },
    gstTax: {
        type: String
    },
    panNumber: {
        type: String
    },
    fullAddress: {
        type: String,
        required: true,
        trim: true
    }
});

const user = mongoose.model('users', userSchema);
module.exports = user;