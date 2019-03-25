const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate } = require('../middlewares/verify');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/verify', authenticate, UserController.verify);

module.exports = router;
