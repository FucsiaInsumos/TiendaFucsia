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


const allowOwnerOrCashier = (req, res, next) => {
  if (!['Owner', 'Cashier'].includes(req.user.role)) {
    return res.status(403).json({
      error: true,
      message: 'Solo Owner o Cashier pueden crear usuarios'
    });
  }
  next();
};

// Middleware para verificar token en todas las rutas
router.use(verifyToken);


router.get('/',  getAllUsers);
router.get('/:id', getUserById);
router.post('/', allowOwnerOrCashier, createUserFromDashboard);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
