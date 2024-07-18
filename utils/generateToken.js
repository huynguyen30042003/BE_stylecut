const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    const accessToken = jwt.sign({ id, type: 'access' }, process.env.JWT_SECRET, {
        // expiresIn: '15m' // Access Token sẽ hết hạn sau 15 phút
        expiresIn: '30d'
    });

    const refreshToken = jwt.sign({ id, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d' // Refresh Token sẽ hết hạn sau 7 ngày
    });

    const forgetPassToken = jwt.sign({ id, type: 'forget-password' }, process.env.JWT_SECRET, {
        expiresIn: '24h' // Forget Password Token sẽ hết hạn sau 24 giờ
    });

    return { accessToken, refreshToken, forgetPassToken };
};

module.exports = generateToken;
