require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/usermodel');

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error("MONGODB_URI not found in .env");
    process.exit(1);
}

async function run() {
    try {
        await mongoose.connect(dbURI, {
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4
        });
        console.log("Connected to database successfully using .env URI.");

        const email = process.env.ADMIN_EMAIL || 'dheerajcse21@gmail.com';
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin exists
        let admin = await User.findOne({ email });
        if (admin) {
            admin.role = 'admin';
            admin.password = hashedPassword;
            await admin.save();
            console.log(`Updated existing user ${email} to Admin and reset password.`);
        } else {
            admin = new User({
                businessName: 'LK Printers Admin',
                username: 'admin',
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
            await admin.save();
            console.log(`Created new Admin account for ${email}.`);
        }
        
        console.log(`\nAdmin Credentials:\nEmail: ${email}\nPassword: ${password}\n`);
    } catch (e) {
        console.error("Error setting admin:", e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
