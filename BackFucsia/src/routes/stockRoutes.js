const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/isAuth');
const { 
  getStockMovements, 
  createStockMovement, 
  getProductStockHistory,
  getLowStockProducts,
  generateStockReport
} = require('../controllers/Stock/stockController');

// Middleware para verificar token en todas las rutas
router.use(verifyToken);

// Rutas para stock
router.get('/movements', getStockMovements);
router.post('/movements', createStockMovement);
router.get('/product/:productId/history', getProductStockHistory);
router.get('/low-stock', getLowStockProducts);
router.get('/report', generateStockReport);

module.exports = router;
