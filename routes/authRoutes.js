const express = require('express');
const {
    registerUser,
    authUser,
    forgotPassword,
    resetPassword,
    refreshToken,
    logoutUser
} = require('../controllers/authController');

const router = express.Router();


router.post('/register', registerUser);

router.post('/login', authUser);

router.post('/forgot-password', forgotPassword);

router.put('/reset-password/:token', resetPassword);

router.post('/refresh-token', refreshToken);

router.post('/logout', logoutUser);

module.exports = router;
