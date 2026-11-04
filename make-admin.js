require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/usermodel');

const dbURI = process.env.MONGODB_URI;

async function run() {
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to database successfully.");

        const email = 'dheerajcse21@gmail.com';
        let user = await User.findOne({ email });
        const hashedPassword = await bcrypt.hash('admin123', 10);

        if (user) {
            user.role = 'admin';
            user.password = hashedPassword;
            await user.save();
            console.log(`✅ Successfully updated ${email} to admin role and set password to "admin123"!`);
        } else {
            // Let's create it if it doesn't exist so they can login immediately!
            user = new User({
                businessName: 'LK Printers Admin',
                username: 'dheeraj',
                email: email,
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
            await user.save();
            console.log(`✅ User ${email} did not exist, so created a new Admin account with password "admin123"!`);
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
