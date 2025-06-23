const express = require('express');
const multer = require('multer');
const router = express.Router();
const { verifyToken } = require('../middleware/isAuth');

// ✅ IMPORTAR CONTROLADORES
const {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  receiveOrder
} = require('../controllers/Purchase/purchaseController');

const {
  createProveedor,
  getProveedores,
  getProveedorById,
  updateProveedor,
  deleteProveedor
} = require('../controllers/Purchase/proveedorController');

// Configuración de multer para comprobantes
const upload = multer({ dest: 'uploads/purchase-receipts/' });

// Middleware para verificar token en todas las rutas
router.use(verifyToken);

// RUTAS TEMPORALES DE PRUEBA
router.get('/test', (req, res) => {
  res.json({
    message: 'Rutas de compra funcionando',
    timestamp: new Date(),
    user: req.user
  });
});

// ✅ RUTAS PARA PROVEEDORES
router.post('/proveedores', createProveedor);
router.get('/proveedores', getProveedores);
router.get('/proveedores/:id', getProveedorById);
router.put('/proveedores/:id', updateProveedor);
router.delete('/proveedores/:id', deleteProveedor);

// ✅ RUTAS PARA ÓRDENES DE COMPRA
router.post('/orders', upload.single('comprobante'), createPurchaseOrder);
router.get('/orders', getPurchaseOrders);
router.get('/orders/:id', getPurchaseOrderById);
router.post('/orders/:id/receive', receiveOrder);

module.exports = router;
// router.put('/orders/:id/cancel', cancelPurchaseOrder);

module.exports = router;
