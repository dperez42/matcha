// Take the header 'authorization' and check if is valid. Use as middleware

const jwt = require('./jwt')

function authenticateToken(req, res, next) {
  console.log("authenticate.js")
  console.log('token:',req.headers['authorization'])
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401); // no tiene credenciales
  }
  // Decodifica el token
  const result = jwt.verifyAccessToken(token);
  if (!result.success) {
    return res.status(403).json({ error: result.error }); // no autorizado
  }
  req.user = result.data;
  next();
}

module.exports = {
    authenticateToken
}