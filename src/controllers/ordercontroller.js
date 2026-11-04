const mongoose = require('mongoose');
const Order = require('../models/ordermodel');

const VALID_STATUSES = ['Confirmed', 'Under Process', 'Shipped', 'Delivered', 'Cancelled'];

const parseNumber = (value) => {
    if (typeof value === 'number') {
        return value;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
};

// Create a new order
const createOrder = async (req, res) => {
    try {
        const {
            orderNumber,
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            customerPAN,
            customerGSTIN,
            items,
            totalAmount,
            status,
            date,
            artworkUrl,
            artworkFileName
        } = req.body;

        if (!orderNumber) {
            return res.status(400).json({
                message: "Order number is required"
            });
        }

        if (!customerName) {
            return res.status(400).json({
                message: "Customer name is required"
            });
        }

        const parsedTotalAmount = Number(totalAmount);

        if (Number.isNaN(parsedTotalAmount)) {
            return res.status(400).json({
                message: "Invalid total amount"
            });
        }

        const newOrder = new Order({
            orderNumber,

            // IMPORTANT
            userId: req.userId,

            customerName,
            customerEmail: customerEmail || "",
            customerPhone: customerPhone || "",
            customerAddress: customerAddress || "",
            customerPAN: customerPAN || "",
            customerGSTIN: customerGSTIN || "",

            items: Array.isArray(items) ? items : [],

            totalAmount: parsedTotalAmount,

            status: status || "Confirmed",

            date: date || new Date().toISOString(),

            artworkUrl: artworkUrl || "",
            artworkFileName: artworkFileName || ""
        });

        const savedOrder = await newOrder.save();

        return res.status(201).json({
            message: "Order created successfully",
            response: savedOrder
        });

    } catch (error) {
        console.error("createOrder error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Get all orders (Admin view)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json({
            message: 'Orders retrieved successfully',
            response: orders
        });
    } catch (ex) {
        console.error('getAllOrders error:', ex);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: ex.message
        });
    }
};

// Update order status/details
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, customerName, customerEmail, customerPhone, customerAddress, customerPAN, customerGSTIN, totalAmount, items } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid order id'
            });
        }

        const updateData = {};

        // Validate status if provided
        if (status) {
            if (!VALID_STATUSES.includes(status)) {
                return res.status(400).json({
                    message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
                });
            }
            updateData.status = status;
        }

        // Validate email if provided
        if (customerEmail !== undefined) {
            if (customerEmail !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(customerEmail)) {
                    return res.status(400).json({ message: 'Invalid customer email format' });
                }
            }
            updateData.customerEmail = customerEmail;
        }

        // Validate totalAmount if provided
        if (totalAmount !== undefined) {
            const parsedTotalAmount = parseNumber(totalAmount);
            if (!Number.isFinite(parsedTotalAmount) || parsedTotalAmount < 0) {
                return res.status(400).json({ message: 'Total amount must be a positive number' });
            }
            updateData.totalAmount = parsedTotalAmount;
        }

        if (customerName) updateData.customerName = customerName;
        if (customerPhone !== undefined) updateData.customerPhone = customerPhone;
        if (customerAddress !== undefined) updateData.customerAddress = customerAddress;
        if (customerPAN !== undefined) updateData.customerPAN = customerPAN;
        if (customerGSTIN !== undefined) updateData.customerGSTIN = customerGSTIN;
        if (items) {
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    message: 'Items must be a non-empty array'
                });
            }

            const cleanedItems = items.map((item) => ({
                id: item.id,
                name: item.name,
                price: parseNumber(item.price),
                quantity: parseNumber(item.quantity),
                image: item.image,
                options: item.options
            }));

            const hasInvalidItem = cleanedItems.some((item) => !item.name || !Number.isFinite(item.price) || !Number.isFinite(item.quantity) || item.quantity <= 0 || item.price < 0);
            if (hasInvalidItem) {
                return res.status(400).json({
                    message: 'Each order item must include a valid name, price, and quantity'
                });
            }

            updateData.items = cleanedItems;
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            message: 'Order updated successfully',
            response: updatedOrder
        });
    } catch (ex) {
        console.error('updateOrder error:', ex);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: ex.message
        });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid order id'
            });
        }

        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            message: 'Order deleted successfully',
            response: deletedOrder
        });
    } catch (ex) {
        console.error('deleteOrder error:', ex);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: ex.message
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Orders retrieved successfully',
            response: orders
        });

    } catch (ex) {
        console.error('getMyOrders error:', ex);

        return res.status(500).json({
            message: 'Internal Server Error',
            error: ex.message
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    updateOrder,
    deleteOrder, getMyOrders
};
