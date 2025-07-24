const { Router } = require('express');
const multer = require('multer');
const {
  createProduct,
  getProducts, // Esta función maneja GET /products y GET /products?name=...
  getProductById,
  updateProduct,
  deleteProduct,
  getFacturableProducts,
  getProductsForExport,
  bulkCreateProducts,
  bulkUpdateStock,
  filterProducts, // ✅ AGREGADO: Importar filterProducts
  // calculatePrice,
} = require('../controllers/Product/productController');
const { verifyToken } = require('../middleware/isAuth'); // Asumiendo que tienes autenticación

const router = Router();

// Configuración de multer para subida de archivos
const upload = multer({ dest: 'uploads/' });

// Rutas existentes
router.post(
    '/', 
    upload.array('images', 5), 
    createProduct
);

// Carga masiva de productos (desde Excel/JSON)
router.post('/bulk', bulkCreateProducts);

// Actualización masiva de stock
router.put('/bulk/stock', bulkUpdateStock);

router.get('/', getProducts); // Correcto: esta ruta manejará /products y /products?name=...

// ✅ NUEVA RUTA: Filtros específicos (debe ir ANTES de las rutas específicas)
router.get('/filter', filterProducts);

// Obtener productos para exportación/Excel (debe ir antes de /:id)
router.get('/export', getProductsForExport);

// ✅ AGREGAR ESTA RUTA
router.get('/facturable', getFacturableProducts);

router.get('/:id', getProductById);
router.put(
    '/:id', 
    upload.array('images', 5), 
    updateProduct
);
router.delete('/:id', deleteProduct);
// router.post('/calculate-price', calculatePrice);

// Aplicar verifyToken a todas las rutas de productos si es necesario
// router.use(verifyToken);

module.exports = router;
