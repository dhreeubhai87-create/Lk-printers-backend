const user = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sanitizeUser = (doc) => {
    if (!doc) {
        return null;
    }

    const userData = doc.toObject ? doc.toObject() : { ...doc };
    delete userData.password;
    return userData;
};

const createToken = (doc) => jwt.sign(
    { id: doc._id, role: doc.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

const signup = async (req, res) => {
    try {
        const { businessName, username, email, phoneNumber, password, refCode, Country, state, district, city, pinCode, gstTax, panNumber, pan, fullAddress } = req.body;
        if (!businessName || !email || !username || !phoneNumber || !password || !Country || !state || !district || !city || !pinCode || !fullAddress) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }
        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedPhone = String(phoneNumber).trim();

        const existingUser = await user.findOne({ phoneNumber: normalizedPhone });
        const checkEmail = await user.findOne({ email: normalizedEmail });
        if (existingUser || checkEmail) {
            return res.status(400).json({
                message: 'User already exists with this phone number or email'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = new user({
            businessName: businessName.trim(),
            username,
            email: normalizedEmail,
            phoneNumber: normalizedPhone,
            password: hashedPassword,
            refCode,
            Country: Country.trim(),
            state: state.trim(),
            district: district.trim(),
            city: city.trim(),
            pinCode: String(pinCode).trim(),
            gstTax,
            panNumber: panNumber || pan || "",
            fullAddress: fullAddress.trim()
        });
        await newuser.save();
        const token = createToken(newuser);
        return res.status(201).json({
            message: 'User registered successfully',
            response: sanitizeUser(newuser),
            token: token
        })
    }
    catch (ex) {
        console.log(ex);
        return res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            })
        }
        const existinguser = await user.findOne({ email: String(email).trim().toLowerCase() });
        if (!existinguser) {
            return res.status(400).json({
                message: 'Invalid email or password'
            })
        }
        const isMatch = await bcrypt.compare(password, existinguser.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Password is incorrect'
            })
        }
        const token = createToken(existinguser);
        return res.status(200).json({
            message: 'Login successful',
            response: sanitizeUser(existinguser),
            role: existinguser.role,
            token: token
        });
    }
    catch (ex) {
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}

const adminLogin = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: 'Security Password is required'
            });
        }

        // Verify against master password (defaults to admin123)
        const masterPassword = process.env.ADMIN_PASSWORD || 'admin123';
        if (password !== masterPassword) {
            return res.status(400).json({
                message: 'Invalid security password'
            });
        }

        // Find or create a default admin user in the database
        let adminUser = await user.findOne({ role: 'admin' });
        if (!adminUser) {
            const hashedPassword = await bcrypt.hash(masterPassword, 10);
            adminUser = new user({
                businessName: 'LK Printers Admin',
                username: 'admin',
                email: 'admin@lkprinters.com',
                phoneNumber: '9999999999',
                password: hashedPassword,
                role: 'admin',
                Country: 'India',
                state: 'Delhi',
                district: 'New Delhi',
                city: 'New Delhi',
                pinCode: '110001',
                fullAddress: 'LK Printers HQ'
            });
            await adminUser.save();
        }

        const token = createToken(adminUser);
        return res.status(200).json({
            message: 'Login successful',
            response: sanitizeUser(adminUser),
            role: adminUser.role,
            token
        });
    } catch (ex) {
        console.error('adminLogin error:', ex);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const currentUser = await user.findById(req.userId).select('-password');
        if (!currentUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        return res.status(200).json({
            message: 'Profile retrieved successfully',
            response: currentUser
        });
    } catch (ex) {
        console.error('getProfile error:', ex);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { businessName, username, email, phoneNumber, Country, state, district, city, pinCode, gstTax, fullAddress } = req.body;

        const updatedUser = await user.findByIdAndUpdate(
            req.userId,
            {
                $set: {
                    businessName,
                    username,
                    email,
                    phoneNumber,
                    Country,
                    state,
                    district,
                    city,
                    pinCode,
                    gstTax,
                    fullAddress
                }
            },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'Profile updated successfully',
            response: updatedUser
        });
    } catch (ex) {
        console.error('updateProfile error:', ex);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await user
            .find({}, "-password") 
            .sort({ createdAt: -1 }); 

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Old password and new password are required"
            });
        }

        const currentUser = await user.findById(req.userId);

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            currentUser.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        currentUser.password = hashedPassword;

        await currentUser.save();

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (ex) {
        console.error("changePassword error:", ex);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    signup,
    login,
    adminLogin,
    getProfile,
    updateProfile,
    getAllUsers,changePassword
};