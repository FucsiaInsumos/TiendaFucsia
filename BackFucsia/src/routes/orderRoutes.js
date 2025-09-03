const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/isAuth');
const { 
  createOrder, 
  getOrders, 
  getMyOrders,
  getOrderById, 
  updateOrderStatus, 
  cancelOrder,
  calculatePrice,
  getOrdersRequiringBilling,
  markOrderAsBilled,
  getOrderStatistics
} = require('../controllers/Order/orderController');

// Middleware para verificar token en todas las rutas
router.use(verifyToken);

// Rutas para órdenes
router.post('/calculate-price', calculatePrice);
router.get('/requiring-billing', getOrdersRequiringBilling);
router.get('/statistics', getOrderStatistics); // ✅ Ruta para estadísticas

router.get('/my-orders', getMyOrders); // Nueva ruta para órdenes del usuario actual
router.post('/', createOrder);
router.get('/', getOrders); // Solo para admin/owner
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

router.patch('/:id/mark-billed',markOrderAsBilled);

module.exports = router;
