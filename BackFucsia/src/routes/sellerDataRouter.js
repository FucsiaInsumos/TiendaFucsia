const express = require('express');
const router = express.Router();


const {
  createOrUpdateSellerData,
  getSellerDataByNIT,
  validateTaxxaConfig
} = require('../controllers/Taxxa/sellerDataControllers');



// 🆕 RUTAS PARA GESTIÓN DE DATOS DEL HOTEL/SELLER
router.post('/', createOrUpdateSellerData);      
router.put('/', createOrUpdateSellerData);         
router.get('/:sdocno', getSellerDataByNIT);       
router.get('/:sdocno/validate', validateTaxxaConfig); 

module.exports = router;


