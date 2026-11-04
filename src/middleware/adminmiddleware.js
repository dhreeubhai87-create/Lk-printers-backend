const User = require('../models/usermodel');

const adminMiddleware = async (req, res, next) => {
    try {
        if (req.userRole && req.userRole !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin role required.'
            });
        }

        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin role required.'
            });
        }
        next();
    } catch (err) {
        console.error('Admin verification error:', err);
        return res.status(500).json({
            message: 'Internal Server Error during admin check'
        });
    }
};

module.exports = adminMiddleware;
