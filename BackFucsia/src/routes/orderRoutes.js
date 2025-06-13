const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/isAuth');
const { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder 
} = require('../controllers/Order/orderController');

// Middleware para verificar token en todas las rutas
router.use(verifyToken);

// Rutas para órdenes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
