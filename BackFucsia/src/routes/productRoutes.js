const { Router } = require('express');
const multer = require('multer');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  filterProducts,
  calculateProductPrice
} = require('../controllers/Product/productController');

const router = Router();

// Configuración de multer para subida de archivos
const upload = multer({ dest: 'uploads/' });

// Rutas existentes
router.post(
    '/', 
    upload.array('images', 5), 
    createProduct
);
router.get('/', getProducts);
router.get('/filter', filterProducts);
router.get('/:id', getProductById);
router.put(
    '/:id', 
    upload.array('images', 5), 
    updateProduct
);
router.delete('/:id', deleteProduct);

// Nueva ruta para calcular precios
router.post('/calculate-price', calculateProductPrice);

module.exports = router;
