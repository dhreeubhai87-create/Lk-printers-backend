const express = require('express');
const router = express.Router();

const {
    createOrder,
    getAllOrders,
    getMyOrders,
    updateOrder,
    deleteOrder
} = require('../controllers/ordercontroller');

const auth = require('../middleware/authmiddleware');
const admin = require('../middleware/adminmiddleware');

// Customer
router.post('/',auth,createOrder);
router.get('/my-orders', auth, getMyOrders);

// Admin
router.get('/', auth, admin, getAllOrders);
router.put('/:id', auth, admin, updateOrder);
router.delete('/:id', auth, admin, deleteOrder);

module.exports = router;