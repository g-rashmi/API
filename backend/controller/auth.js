const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendmail');
const crypto = require('crypto');

exports.register = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ email, username, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(20).toString('hex');
        user.verificationToken = verificationToken;

        await user.save();

        const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;
        await sendEmail(user.email, 'Verify your account', `Click here to verify your account: ${verificationLink}`);

        res.status(201).send('User registered successfully. Please check your email to verify your account.');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).send('Invalid token');
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        res.send('Email verified successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
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
