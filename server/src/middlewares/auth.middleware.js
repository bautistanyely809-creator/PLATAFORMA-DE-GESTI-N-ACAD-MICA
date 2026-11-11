const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado: Token no proporcionado' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'edunova_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        message: `Acceso restringido: Se requiere rol [${allowedRoles.join(', ')}]`
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
};

