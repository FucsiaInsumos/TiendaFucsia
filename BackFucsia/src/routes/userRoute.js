const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authJWT');
const { byRol } = require('../middleware/byRol');
const { checkPermissions } = require('../controllers/permissionController');

// Ruta solo para administradores
router.get('/dashboard', 
  verifyToken,
  byRol,
  checkPermissions(['verEstadisticas']),
  dashboardController.getStats
);

module.exports = router;