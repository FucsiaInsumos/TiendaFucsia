const express = require('express');

const { register, login, logout } = require('../controllers/User/authController');
const { verifyToken } = require('../middleware/isAuth');

const router = express.Router();

// Ruta para registro
router.post('/register', register);

// Ruta para login
router.post('/login', login);

// Ruta para logout
router.post('/logout', verifyToken, logout);

// Ruta para verificación de rol
//router.get('/verify-role', checkPermissions(['admin', 'user']), verifyRole);

module.exports = router;
