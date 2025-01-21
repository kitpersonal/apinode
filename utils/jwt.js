const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // Deberías usar una clave secreta más segura y almacenarla en variables de entorno

function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
