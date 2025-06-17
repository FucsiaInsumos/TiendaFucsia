const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/isAuth');
const {
  generateAcceptanceToken,
  createPaymentLink,
  getTransactionStatus,
  handleWebhook,
  generateWidgetSignature
} = require('../controllers/Payment/wompiController');

// ✅ RUTAS ACTUALIZADAS
router.get('/acceptance-token', verifyToken, generateAcceptanceToken);
router.post('/create-payment-link', verifyToken, createPaymentLink);
router.get('/transaction/:transactionId', verifyToken, getTransactionStatus);
router.post('/webhook', handleWebhook); // Sin verifyToken para webhooks
router.post('/generate-signature', verifyToken, generateWidgetSignature);

// ✅ RUTA DE PRUEBA
router.get('/test', (req, res) => {
  res.json({
    message: 'Wompi routes funcionando',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

module.exports = router;