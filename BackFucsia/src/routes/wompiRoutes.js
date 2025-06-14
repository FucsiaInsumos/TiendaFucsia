const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/isAuth');
const {
  generateAcceptanceToken,
  createPaymentTransaction,
  handleWebhook,
  checkTransactionStatus
} = require('../controllers/Payment/wompiController');

// Middleware para capturar el body raw para webhooks
const captureRawBody = (req, res, next) => {
  if (req.path === '/webhook') {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  } else {
    next();
  }
};

router.use(captureRawBody);

// Rutas públicas
router.post('/webhook', handleWebhook); // Sin autenticación para webhooks

// Rutas protegidas
router.get('/acceptance-token', verifyToken, generateAcceptanceToken);
router.post('/create-transaction', verifyToken, createPaymentTransaction);
router.get('/transaction/:transactionId', verifyToken, checkTransactionStatus);

module.exports = router;
