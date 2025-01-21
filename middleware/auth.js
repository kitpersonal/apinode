const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send('Acceso denegado');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Token no proporcionado');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).send('Token inválido');
  }

  req.user = decoded;
  next();
}

module.exports = authMiddleware;
