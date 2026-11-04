const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'No token provided, authorization denied'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;
        req.userRole = decoded.role || 'user';
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({
            message: 'Token is invalid or expired'
        });
    }
};

module.exports = authMiddleware;
