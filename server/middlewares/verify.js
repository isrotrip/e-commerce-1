const jwtConvert = require('../helpers/jwtConvert');
const User = require('../models/user');
const Cart = require('../models/cart');
const Transaction = require('../models/transaction');

module.exports = {
  authenticate(req, res, next) {
    try {
      let user = jwtConvert.verify(req.headers.token)
      return User
        .findOne({
          _id: user._id,
          name: user.name,
          email: user.email,
          loginVia: user.loginVia,
          role: user.role
        })
        .then(user => {
          if(user) {
            req.userLogin = user;
            next();
          } else {
            res.status(400).json({
              message: 'Invalid token'
            })
          }
        })
        .catch(error => {
          res.status(500).json(error)
        })
    }
    catch(error) {
      res.status(400).json({
        message: 'Invalid token'
      })
    }
  },

  authorizeUser(req, res, next) {
    Cart
      .findById(req.params.id)
      .then(cart => {
        if(cart.userId.toString() === req.userLogin._id.toString()) {
          next()
        } else {
          res.status(401).json({
           message: 'Not Authorized'
          })
        }
      })
      .catch(error => {
        if(error.path === '_id') {
          res.status(404).json({
            message: 'Cart Not Found'
          })
        } else {
          res.status(500).json({
            message: 'Internal Server Error'
          })
        }
      })
  },

  authorizeAdmin(req, res, next) {
    if(req.userLogin.role === 'admin') {
      next();
    } else {
      res.status(401).json({
        message: 'Not authorized'
      })
    }
  },

  authorizeUserTransaction(req, res, next) {
    Cart
      .findById(req.body.cartId)
      .populate('productId')
      .then(cart => {
        if(cart) {
          if(cart.userId._id.toString() === req.userLogin._id.toString()) {
            req.cart = cart;
            next();
          } else {
            res.status(401).json({
              message: 'Not Authorized'
            })
          }
        } else {
          res.status(404).json({
            message: 'Cart Not Found'
          })
        }
      })
      .catch(error => {
        if(error.path === '_id') {
          res.status(404).json({
            message: 'Cart Not Found'
          })
        } else {
          res.status(500).json({
            message: 'Internal Server Error'
          })
        }
      })
  },

  authorizeUpdateTransaction (req, res, next) {
    Transaction
      .findById(req.params.id)
      .then(transaction => {
        if(transaction) {
          if(transaction.status === 'pending' && req.userLogin.role === 'admin' && req.body.status === 'send') {
            req.transaction = transaction;
            next();
          } else if(transaction.status === 'send' && req.userLogin._id.toString() === transaction.userId.toString() && req.body.status === 'accept') {
            req.transaction = transaction;
            next();
          } else {
            res.status(401).json({
              message: 'Not Authorized'
            })
          }
        } else {
          res.status(404).json({
            message: 'Cart Not Found'
          })
        }
      })
      .catch(error => {
        if(error.path === '_id') {
          res.status(404).json({
            message: 'Cart Not Found'
          })
        } else {
          res.status(500).json({
            message: 'Internal Server Error'
          })
        }
      })
  }
}