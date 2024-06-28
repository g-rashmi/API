const Admin = require('../models/admin');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerAdmin = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ msg: 'Admin already exists' });
        }

        admin = new Admin({ email, username, password });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        await admin.save();

        res.status(201).send('Admin registered successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        let admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            admin: {
                id: admin.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('username');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserDetails = async (req, res) => {
    const { username } = req.params;

    try {
        
        const user = await User.findOne({ username }).select('-password');
           
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteUser = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOneAndDelete({ username });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
