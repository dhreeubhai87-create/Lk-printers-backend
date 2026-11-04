const express = require('express');
const router = express.Router();
const { signup, login, adminLogin, getProfile, updateProfile,getAllUsers,changePassword } = require('../controllers/usercontroller');
const auth = require('../middleware/authmiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get("/users", getAllUsers);
router.put("/change-password", auth, changePassword);
module.exports = router;