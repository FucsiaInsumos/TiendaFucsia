const express = require('express');
const router = express.Router();
const multer = require('multer');

// Middleware
const { verifyToken } = require('../middleware/isAuth');
const { byRol } = require('../middleware/byRol');

// Controladores
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  approveExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/Expense/expenseController');

// Middleware simple para verificar que sea Owner o Cashier
const requireOwnerOrCashier = (req, res, next) => {
  if (!req.user || (req.user.role !== 'Owner' && req.user.role !== 'Cashier')) {
    return res.status(403).json({
      error: true,
      message: 'Acceso denegado. Solo Owner o Cashier pueden gestionar gastos'
    });
  }
  next();
};

// Middleware para verificar que sea solo Owner
const requireOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'Owner') {
    return res.status(403).json({
      error: true,
      message: 'Solo el propietario puede realizar esta acción'
    });
  }
  next();
};

// Configurar multer para manejar archivos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Aceptar solo imágenes y PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, etc.) y PDF'), false);
    }
  }
});

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

// Rutas públicas (con autenticación pero sin restricción de rol específica)

// Obtener todos los gastos con filtros
router.get('/', requireOwnerOrCashier, getExpenses);

// Obtener estadísticas de gastos
router.get('/stats', requireOwnerOrCashier, getExpenseStats);

// Obtener un gasto específico
router.get('/:id', requireOwnerOrCashier, getExpenseById);

// Rutas protegidas (requieren roles específicos)

// Crear nuevo gasto (Owner y Cashier pueden crear)
router.post('/', requireOwnerOrCashier, upload.single('receipt'), createExpense);

// Actualizar gasto (solo Owner)
router.put('/:id', requireOwner, upload.single('receipt'), updateExpense);

// Aprobar gasto (solo Owner)
router.patch('/:id/approve', requireOwner, approveExpense);

// Eliminar gasto (solo Owner)
router.delete('/:id', requireOwner, deleteExpense);

module.exports = router;
