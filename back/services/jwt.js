const jwt = require('jsonwebtoken');

function generateAccessToken(data) {
    const secret = process.env.JWT_TOKEN_SECRET;
    const options = { expiresIn: process.env.JWT_TOKEN_EXPIRES};
    //const options = { expiresIn: '1h'};
    return jwt.sign(data, secret, options);
}
function verifyAccessToken(key) {
    const secret = process.env.JWT_TOKEN_SECRET;
    try {
        const decoded = jwt.verify(key, secret);
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    generateAccessToken,
    verifyAccessToken
}