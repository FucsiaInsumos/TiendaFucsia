const { Router } = require('express');
const multer = require('multer');
const {
  createProduct,
  getProducts, // Esta función maneja GET /products y GET /products?name=...
  getProductById,
  updateProduct,
  deleteProduct,
  getFacturableProducts,
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
router.get('/', getProducts); // Correcto: esta ruta manejará /products y /products?name=...
router.get('/:id', getProductById);
// ✅ AGREGAR ESTA RUTA
router.get('/facturable', getFacturableProducts);
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
// Aplicar verifyToken a todas las rutas de productos si es necesario
// router.use(verifyToken);

module.exports = router;
