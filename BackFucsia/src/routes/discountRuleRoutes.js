const { Router } = require('express');
const {
  createDiscountRule,
  getDiscountRules,
  getDiscountRuleById,
  updateDiscountRule,
  deleteDiscountRule
} = require('../controllers/DiscountRule/discountRuleController');

const router = Router();

router.post('/', createDiscountRule);
router.get('/', getDiscountRules);
router.get('/:id', getDiscountRuleById);
router.put('/:id', updateDiscountRule);
router.delete('/:id', deleteDiscountRule);

module.exports = router;
