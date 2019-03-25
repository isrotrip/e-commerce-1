const router = require('express').Router();
const ProductController = require('../controllers/productController');
const images = require('../middlewares/images');
const { authenticate, authorizeAdmin } = require('../middlewares/verify')

router.get('/', ProductController.read)
router.get('/:id', ProductController.readOne)

router.use(authenticate, authorizeAdmin)

router.post('/',
  images.multer.single('image'),
  images.sendUploadToGCS,
  ProductController.create);

router.put('/:id',
  images.multer.single('image'),
  images.sendUploadToGCS,
  ProductController.update);

router.delete('/:id', ProductController.remove)

module.exports = router;