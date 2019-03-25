const router = require('express').Router();
const TransactionController = require('../controllers/transactionController');
const { authorizeUserTransaction , authorizeUpdateTransaction } = require('../middlewares/verify');

router.get('/rajaOngkir', TransactionController.readRajaOngkir);
router.get('/', TransactionController.read);
router.post('/rajaOngkir', authorizeUserTransaction, TransactionController.priceOngkir);
router.post('/', authorizeUserTransaction, TransactionController.create);
router.put('/:id', authorizeUpdateTransaction, TransactionController.update);

module.exports = router;