const router = require('express').Router();
const CartController = require('../controllers/cartController');
const { authorizeUser } = require('../middlewares/verify')

router.post('/', CartController.create);
router.get('/', CartController.read);
router.get('/:id', CartController.readOne);
router.use('/:id', authorizeUser);
router.put('/:id', CartController.update);
router.delete('/:id', CartController.remove);

module.exports = router;