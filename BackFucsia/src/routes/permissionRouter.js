const express = require('express');

// Importar y verificar cada middleware
const { verifyToken } = require('../middleware/isAuth');
console.log('verifyToken importado:', typeof verifyToken);

// Comentar temporalmente esta importación hasta arreglar byRol
// const { byRol } = require('../middleware/byRol');
// console.log('byRol importado:', typeof byRol);

const { checkPermissions } = require('../controllers/checkPermissions');
console.log('checkPermissions importado:', typeof checkPermissions);

const router = express.Router();

// Controlador para el dashboard (versión simplificada sin byRol por ahora)
const getDashboardData = (req, res) => {
  res.status(200).json({ 
    error: false, 
    message: 'Acceso al dashboard concedido.', 
    data: {
      userId: req.user ? req.user.id : null,
      role: req.user ? req.user.role : null,
      dashboardContent: "Aquí van las estadísticas y datos del dashboard..."
    }
  });
};

// Ruta temporal sin byRol para probar
router.get('/dashboard', 
  verifyToken,
  // byRol, // Comentado temporalmente
  // checkPermissions(['verEstadisticas']), // Comentado temporalmente
  getDashboardData
);

module.exports = router;