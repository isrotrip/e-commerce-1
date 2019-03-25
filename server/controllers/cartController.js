const Cart = require('../models/cart');
const Product = require('../models/product');
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

class CartController {

  static create (req, res) {
    Product
      .findById(req.body.productId)
      .then(product => {
        if(product) {
          if(product.amount >= req.body.amount) {
            Cart
              .create({
                amount: Number(req.body.amount),
                productId: product._id,
                userId: req.userLogin._id
              })
              .then(cart => {
                res.status(201).json({
                  message: `Add product ${product.name} to your cart`,
                  cart: {
                    _id: cart._id,
                    amount: cart.amount,
                    product: {
                      _id: product._id,
                      name: product.name,
                      amount: product.amount,
                      price: product.price,
                      created_at: new Date(product.created_at).toLocaleDateString('en-US', options),
                      expired_date: new Date(product.expired_date).toLocaleDateString('en-US', options),
                      pictureUrl: product.pictureUrl
                    },
                    userId: cart.userId
                  }
                })
              })
              .catch(error => {
                if(error.path === '_id') {
                  res.status(404).json({
                    message: 'Product Not Found'
                  })
                } else if(error.errors.amount) {
                  res.status(400).json({
                    message: error.errors.amount.message
                  })
                } else {
                  res.status(500).json({
                    message: 'Internal Server Error'
                  })
                }
              })
          } else {
            res.status(400).json({
              message: 'Product amount is not sufficient'
            })  
          }
        } else {
          res.status(404).json({
            message: 'Product Not Found'
          })
        }
      })
      .catch(error => {
        if(error.path === '_id') {
          res.status(404).json({
            message: 'Product Not Found'
          })
        } else {
          res.status(500).json({
            message: 'Internal Server Error'
          })
        }
      })
  }

  static read (req, res) {
    Cart
      .find({
        userId: req.userLogin._id
      })
      .populate('productId')
      .then(carts => {
        let sendCarts = []
        carts.forEach(cart => {
          let editCarts = {}
          editCarts._id = cart._id
          editCarts.amount = cart.amount
          editCarts.product = {
            _id: cart.productId._id,
            name: cart.productId.name,
            amount: cart.productId.amount,
            price: cart.productId.price,
            created_at: new Date(cart.productId.created_at).toLocaleDateString('en-US', options),
            expired_date: new Date(cart.productId.expired_date).toLocaleDateString('en-US', options),
            pictureUrl: cart.productId.pictureUrl
          }
          editCarts.userId = cart.userId
          sendCarts.push(editCarts)
        })
        res.status(200).json({
          message: 'Read your cart success',
          carts: sendCarts
        })
      })
      .catch(error => {
        res.status(500).json({
          message: 'Internal Server Error'
        })
      })
  }

  static update(req, res) {
    Product
      .findById(req.body.productId)
      .then(product => {
        if(product) {
          if(product.amount >= req.body.amount) {
            Cart
              .findById(req.params.id)
              .then(cart => {
                cart.amount = req.body.amount
                return cart.save()
              })
              .then(cart => {
                res.status(200).json({
                  message: `Update product ${product.name} from your cart`,
                  cart: {
                    _id: cart._id,
                    amount: cart.amount,
                    product: {
                      _id: product._id,
                      name: product.name,
                      amount: product.amount,
                      price: product.price,
                      created_at: new Date(product.created_at).toLocaleDateString('en-US', options),
                      expired_date: new Date(product.expired_date).toLocaleDateString('en-US', options),
                      pictureUrl: product.pictureUrl
                    },
                    userId: cart.userId
                  }
                })
              })
              .catch(error => {
                if(error.path === '_id') {
                  res.status(404).json({
                    message: 'Product Not Found'
                  })
                } else if(error.errors.amount) {
                  res.status(400).json({
                    message: error.errors.amount.message
                  })
                } else {
                  res.status(500).json({
                    message: 'Internal Server Error'
                  })
                }
              })
            } else {
              res.status(400).json({
                message: 'Product amount doesn\'t sufficient'
              })
            }
          } else {
            res.status(404).json({
              message: 'Product Not Found'
            })
          }
      })
      .catch(error => {
        if(error.path === '_id') {
          res.status(404).json({
            message: 'Product Not Found'
          })
        } else if(error.errors.amount) {
          res.status(400).json({
            message: error.errors.amount.message
          })
        } else {
          res.status(500).json({
            message: 'Internal Server Error'
          })
        }
      })
  }

  static remove(req, res) {
    Cart
      .findByIdAndDelete(req.params.id)
      .populate('productId')
      .then(cart => {
        res.status(200).json({
          message: `Delete product ${cart.productId.name} from your cart`,
          cart: {
            _id: cart._id,
            amount: cart.amount,
            product: {
              _id: cart.productId._id,
              name: cart.productId.name,
              amount: cart.productId.amount,
              price: cart.productId.price,
              created_at: new Date(cart.productId.created_at).toLocaleDateString('en-US', options),
              expired_date: new Date(cart.productId.expired_date).toLocaleDateString('en-US', options),
              pictureUrl: cart.productId.pictureUrl
            },
            userId: cart.userId
          }
        })
      })
      .catch(error => {
        if(error.path === '_id') {
          res.status(404).json({
            message: 'Product Not Found'
          })
        } else if(error.errors.amount) {
          res.status(400).json({
            message: error.errors.amount.message
          })
        } else {
          res.status(500).json({
            message: 'Internal Server Error'
          })
        }
      })
  }

}

module.exports = CartController;