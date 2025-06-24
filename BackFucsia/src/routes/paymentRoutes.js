const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/isAuth');
const { 
  processPayment, 
  getPaymentsByOrder, 
  getAllPayments, 
  updatePaymentStatus, 
  refundPayment,
  getCreditPayments,
  recordCreditPayment,
  getCreditPaymentHistory
} = require('../controllers/Payment/paymentController');

// Middleware para verificar token en todas las rutas
router.use(verifyToken);

// Rutas para pagos
router.post('/', processPayment);
router.get('/', getAllPayments);
router.get('/order/:orderId', getPaymentsByOrder);
router.put('/:id/status', updatePaymentStatus);
router.post('/:id/refund', refundPayment);

// Rutas para gestión de créditos
router.get('/credits', getCreditPayments);
router.post('/:id/record-payment', recordCreditPayment);
router.get('/:id/payment-history', getCreditPaymentHistory);

module.exports = router;
