const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/profile
// @desc    Get user data including history (PROTECTED)
router.get('/', auth, async (req, res) => {
    try {
        // req.user.id is added by the 'auth' middleware after validating the token
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Return everything EXCEPT the password hash
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/profile
// @desc    Update user name/details (PROTECTED)
router.put('/', auth, async (req, res) => {
    const { name, email } = req.body;
    
    // Simple field validation/update preparation
    const userFields = {};
    if (name) userFields.name = name;
    // We shouldn't let them easily change email here, but for demonstration:
    if (email) userFields.email = email; 

    try {
        // Find the user by ID and update the fields
        let user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true, select: '-password' } // Return the NEW updated document, without the password
        );

        // OPTIONAL: Update LocalStorage user info immediately after save (Frontend Task)
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;