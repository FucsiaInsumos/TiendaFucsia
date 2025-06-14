const { verifyToken } = require('./isAuth');

const requireRole = (roles = []) => {
  return [
    verifyToken,
    (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          error: true,
          message: 'Acceso denegado'
        });
      }
      next();
    }
  ];
};

// Usar así en las rutas:
// router.get('/', requireRole(['Owner']), getAllUsers);
// router.get('/', requireRole(['Owner', 'Cashier']), getOrders);

module.exports = { requireRole };
