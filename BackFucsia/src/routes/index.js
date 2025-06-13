const { Router } = require('express');

const router = Router();

// Rutas de autenticación (registro, login, logout)
router.use("/auth", require("./authRoutes"));

// Rutas de gestión de usuarios (CRUD desde dashboard)
router.use("/users", require("./userRoutes"));

// Rutas de gestión de ventas y compras
router.use("/orders", require("./orderRoutes"));
router.use("/payments", require("./paymentRoutes"));
router.use("/stock", require("./stockRoutes"));

// Otras rutas
router.use("/permission", require("./permissionRouter"));
router.use("/category", require("./categoryRoutes"));
router.use("/product", require("./productRoutes"));
router.use('/discount-rules', require('./discountRuleRoutes'));
router.use("/distributor", require("./distributorRoutes"));

module.exports = router;