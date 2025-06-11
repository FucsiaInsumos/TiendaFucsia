const express = require('express');
const { 
    createCategory, 
    getCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/Category/categoryController');
const { verifyToken } = require('../middleware/isAuth'); // Asumiendo middleware de autenticación
const { byRol } = require('../middleware/byRol'); // Asumiendo middleware de roles/permisos
const { checkPermissions } = require('../controllers/checkPermissions'); // Asumiendo controlador de permisos

const router = express.Router();

// Rutas de Categorías
// Crear una categoría (ej: solo admin)
router.post('/', verifyToken, byRol, checkPermissions(['crearCategoria']), createCategory);

// Obtener todas las categorías (público o usuarios logueados)
router.get('/', getCategories);

// Obtener una categoría por ID (público o usuarios logueados)
router.get('/:id', getCategoryById);

// Actualizar una categoría (ej: solo admin)
router.put('/:id', verifyToken, byRol, checkPermissions(['editarCategoria']), updateCategory);

// Eliminar una categoría (ej: solo admin)
router.delete('/:id', verifyToken, byRol, checkPermissions(['eliminarCategoria']), deleteCategory);

module.exports = router;
