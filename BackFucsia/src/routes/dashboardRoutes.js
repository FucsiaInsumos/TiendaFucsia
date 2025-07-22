const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/isAuth'); // Asumiendo middleware de autenticación
const { byRol } = require('../middleware/byRol'); // Asumiendo middleware de roles/permisos
const {
  getDashboardStats,
  getSalesChart,
  getTopCustomers,
  getRevenueStats,
  getProductStats,
  getWeeklySales,
  getMonthlySales
} = require('../controllers/Dashboard/dashboardController');

// Todas las rutas requieren autenticación

router.use(verifyToken);


router.use(byRol);

// Estadísticas generales
router.get('/stats', getDashboardStats);

// Gráficos de ventas
router.get('/sales-chart', getSalesChart);
router.get('/weekly-sales', getWeeklySales);
router.get('/monthly-sales', getMonthlySales);

// Estadísticas de ingresos/ganancias
router.get('/revenue-stats', getRevenueStats);

// Estadísticas de productos
router.get('/product-stats', getProductStats);

// Top clientes
router.get('/top-customers', getTopCustomers);

module.exports = router;
