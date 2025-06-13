const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/isAuth');
const { 
  processPayment, 
  getPaymentsByOrder, 
  getAllPayments, 
  updatePaymentStatus, 
  refundPayment 
} = require('../controllers/Payment/paymentController');

// Middleware para verificar token en todas las rutas
router.use(verifyToken);

// Rutas para pagos
router.post('/', processPayment);
router.get('/', getAllPayments);
router.get('/order/:orderId', getPaymentsByOrder);
router.put('/:id/status', updatePaymentStatus);
router.post('/:id/refund', refundPayment);

module.exports = router;
