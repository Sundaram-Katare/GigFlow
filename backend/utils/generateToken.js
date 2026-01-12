const jwt = require('jsonwebtoken');

const generateToken = async (id) => {
    try {
        const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        return token;
    } catch (error) {
        console.error('Error generating token: ', error);
    }
};

module.exports = generateToken;