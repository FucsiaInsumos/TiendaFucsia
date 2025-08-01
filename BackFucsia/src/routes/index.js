const { Router } = require('express');
const router = Router();

// Rutas de autenticación
router.use("/auth", require("./authRoutes"));

// Rutas RESTful (todas en plural)
router.use("/users", require("./userRoutes"));
router.use("/category", require("./categoryRoutes"));      // Cambiar
router.use("/product", require("./productRoutes"));        // Cambiar
router.use("/distributor", require("./distributorRoutes")); // Cambiar
router.use("/discount-rules", require("./discountRuleRoutes"));

// Rutas de negocio
router.use("/orders", require("./orderRoutes"));
router.use("/payments", require("./paymentRoutes"));
router.use("/stock", require("./stockRoutes"));
router.use("/wompi", require("./wompiRoutes"));
router.use("/purchase", require("./purchaseRoutes")); // ✅ AGREGAR RUTAS DE COMPRAS
router.use("/expenses", require("./expenseRoutes")); // ✅ AGREGAR RUTAS DE GASTOS
router.use("/dashboard", require("./dashboardRoutes")); // ✅ AGREGAR RUTAS DEL DASHBOARD

module.exports = router;