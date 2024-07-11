const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.type !== 'access') {
                return res.status(400).json({ message: 'Invalid token type' });
            }
            req.user = await Account.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an Admin' });
    }
};

const staff = (req, res, next) => {
    if (req.user && (req.user.role === 'Staff')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a Staff' });
    }
};

const includeOf = roles => (req, res, next) => {
    const { user } = req;

    if (!user || !roles.includes(user.role)) {
        return res.status(401).json({ message: 'Not authorized as a Staff or an Admin' });
    }

    next();
};

module.exports = { protect, admin, staff, includeOf };
