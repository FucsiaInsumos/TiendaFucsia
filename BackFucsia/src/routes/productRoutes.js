const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Añadir fs para crear carpetas

const { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    filterProducts // Asegúrate de que este controlador exista si lo usas como ruta separada
} = require('../controllers/Product/productController'); 
const { verifyToken } = require('../middleware/isAuth');
const { byRol } = require('../middleware/byRol');
const { checkPermissions } = require('../controllers/checkPermissions');

const router = express.Router();

// Crear la carpeta uploads si no existe
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer para la subida de archivos
// Guardar archivos temporalmente en el servidor antes de subirlos a Cloudinary
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Aceptar solo ciertos tipos de imágenes
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no soportado. Solo JPEG, PNG o WEBP.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limite de 5MB por archivo
  },
  fileFilter: fileFilter
});

// Rutas de Productos

// Crear un nuevo producto
// 'images' es el nombre del campo en el form-data, 10 es el máximo de archivos permitidos.
router.post(
    '/', 
    verifyToken, 
    byRol, 
    checkPermissions(['crearProducto']), 
    upload.array('images', 10), 
    createProduct
);

// Obtener todos los productos (puede ser público o requerir solo login)
// Si filterProducts es un endpoint separado, defínelo antes de /:id
// router.get('/filter', filterProducts); // Descomenta si tienes un controlador específico para filtros complejos
router.get('/', getProducts); // getProducts puede manejar filtros simples con req.query

// Obtener un producto por su ID
router.get('/:id', getProductById);

// Actualizar un producto existente
router.put(
    '/:id', 
    verifyToken, 
    byRol, 
    checkPermissions(['editarProducto']), 
    upload.array('images', 10),
    updateProduct
);

// Eliminar un producto (eliminación lógica o física según tu controlador)
router.delete(
    '/:id', 
    verifyToken, 
    byRol, 
    checkPermissions(['eliminarProducto']), 
    deleteProduct
);

// Endpoint para filtrar productos (si getProducts no maneja todos los casos)
// Si ya manejas filtros en GET /, esta ruta podría no ser necesaria o ser más específica.
// Por ejemplo, si filterProducts en productController.js está diseñado para query params:
 router.get('/search/filter', filterProducts); // Ejemplo de ruta más específica para filtros

module.exports = router;
