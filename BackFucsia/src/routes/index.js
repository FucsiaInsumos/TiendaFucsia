const { Router } = require('express');
const router = Router();

// Rutas de autenticación
router.use("/auth", require("./authRoutes"));

// Rutas RESTful (todas en plural)
router.use("/users", require("./userRoutes"));
router.use("/categories", require("./categoryRoutes"));      // Cambiar
router.use("/products", require("./productRoutes"));        // Cambiar
router.use("/distributors", require("./distributorRoutes")); // Cambiar
router.use("/discount-rules", require("./discountRuleRoutes"));

// Rutas de negocio
router.use("/orders", require("./orderRoutes"));
router.use("/payments", require("./paymentRoutes"));
router.use("/stock", require("./stockRoutes"));

module.exports = router;