const { Router } = require('express');

const router = Router();


router.use("/user", require("./authRoutes"));
router.use("/permission", require("./permissionRouter"));
router.use("/category", require("./categoryRoutes"));
router.use("/product", require("./productRoutes"));
                                                                                                                                                           
module.exports = router;