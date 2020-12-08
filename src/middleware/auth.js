const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async function (req, res, next) {
    console.log('auth middleware');
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        console.log('user', user);
        if(!user) {
            throw new Error();
        }
        // console.log('token', token);
        req.token = token;
        req.user = user;
        next();
    } catch(e) {
        res.status(401).send('error: Please authenticate');
    }
}

module.exports = auth;