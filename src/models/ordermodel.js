// const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//     id: { type: String },
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     quantity: { type: Number, required: true },
//     image: { type: String },
//     options: { type: mongoose.Schema.Types.Mixed }
// });

// const orderSchema = new mongoose.Schema({
//     orderNumber: { type: String, required: true, unique: true },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
//     customerName: { type: String, required: true },
//     customerEmail: { type: String },
//     customerPhone: { type: String },
//     items: [orderItemSchema],
//     totalAmount: { type: Number, required: true },
//     status: { type: String, default: 'Confirmed' }, // "Under Process" | "Confirmed" | "Shipped" | "Delivered"
//     date: { type: String, required: true }
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('orders', orderSchema);


const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        customerName: {
            type: String,
            required: true
        },

        customerEmail: {
            type: String,
            default: ""
        },

        customerPhone: {
            type: String,
            default: ""
        },

        customerAddress: {
            type: String,
            default: ""
        },

        customerPAN: {
            type: String,
            default: ""
        },

        customerGSTIN: {
            type: String,
            default: ""
        },

        items: {
            type: Array,
            default: []
        },

        totalAmount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            default: "Confirmed"
        },

        date: {
            type: String,
            default: ""
        },

        artworkUrl: {
            type: String,
            default: ""
        },

        artworkFileName: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);