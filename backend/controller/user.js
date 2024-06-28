const User = require('../models/user');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateUser = async (req, res) => {
    const updates = req.body;
    delete updates.username;
    delete updates.email;
    delete updates.password;

    try {
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
