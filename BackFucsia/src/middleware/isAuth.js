const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config/envs');

const generateToken = (user) => {
  const payload = {
    id: user.n_document,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '24h' });
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: true, message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ error: true, message: 'Token inválido' });
  }
};

const checkPermissions = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: true, message: 'Usuario no autenticado' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          error: true, 
          message: 'No tienes permisos para acceder a este recurso' 
        });
      }

      next();
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      return res.status(500).json({ error: true, message: 'Error interno del servidor' });
    }
  };
};

console.log('verifyToken importado:', typeof verifyToken);
console.log('checkPermissions importado:', typeof checkPermissions);

module.exports = {
  generateToken,
  verifyToken,
  checkPermissions
};


