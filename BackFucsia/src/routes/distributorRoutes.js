const { Router } = require('express');
const {
  createDistributor,
  getDistributors,
  getDistributorByUserId,
  updateDistributor
} = require('../controllers/Distributor/distributorController');

const router = Router();

router.post('/', createDistributor);
router.get('/', getDistributors);
router.get('/user/:userId', getDistributorByUserId);
router.put('/:id', updateDistributor);

module.exports = router;
