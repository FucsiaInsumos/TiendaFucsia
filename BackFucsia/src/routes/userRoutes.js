const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/isAuth');

const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  createUserFromDashboard 
} = require('../controllers/User/userController');

// Middleware simple para verificar que sea Owner
const requireOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'Owner') {
    return res.status(403).json({
      error: true,
      message: 'Solo el propietario puede gestionar usuarios'
    });
  }
  next();
};

// Middleware para verificar token en todas las rutas
router.use(verifyToken);

// Rutas para gestión de usuarios (solo Owner)
router.get('/', requireOwner, getAllUsers);
router.get('/:id', requireOwner, getUserById);
router.post('/', requireOwner, createUserFromDashboard);
router.put('/:id', requireOwner, updateUser);
router.delete('/:id', requireOwner, deleteUser);

module.exports = router;
