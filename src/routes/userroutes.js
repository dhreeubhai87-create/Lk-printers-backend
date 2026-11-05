const express = require('express');
const router = express.Router();
const { signup, login, adminLogin, getProfile, updateProfile, getAllUsers, changePassword } = require('../controllers/usercontroller');
const auth = require('../middleware/authmiddleware');

// User Registration routes (both /signup and /register supported)
router.post('/signup', signup);
router.post('/register', signup);

// Login routes
router.post('/login', login);
router.post('/admin/login', adminLogin);

// Profile and Password routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/users', getAllUsers);
router.put('/change-password', auth, changePassword);

// Catch-all for /signup on other HTTP methods to prevent reverse-proxy 405 error
router.all('/signup', (req, res) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    return res.status(405).json({
        message: `Method ${req.method} not allowed on /api/user/signup. Please use POST.`
    });
});

module.exports = router;
