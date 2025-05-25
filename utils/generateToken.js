const jwt = require('jsonwebtoken');

const generateToken = user => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
  return token;
}

module.exports = generateToken;