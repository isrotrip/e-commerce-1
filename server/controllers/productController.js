const Product = require('../models/product');
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

class ProductController {

  static read (req, res) {
    Product
      .find()
      .then(products => {
        let changeDateProducts = []
        products.forEach(product => {
          let changeDateProduct = {
            _id: product._id,
            name: product.name,
            amount: product.amount,
            price: product.price,
            created_at: new Date(product.created_at).toLocaleDateString('en-US', options),
            expired_date: new Date(product.expired_date).toLocaleDateString('en-US', options),
            pictureUrl: product.pictureUrl
          }
          changeDateProducts.push(changeDateProduct)
        })
        res.status(200).json({
          message: 'Read Product success',
          products: changeDateProducts
        })
      })
      .catch(error => {
        res.status(500).json({
          message: 'Internal Server Error'
        })
      })
  }

  static readOne (req, res) {
    Product
      .findById(req.params.id)
      .then(product => {
        if(product) {
          res.status(200).json({
            message: 'Product found',
            product: {
              _id: product._id,
              name: product.name,
              amount: product.amount,
              price: product.price,
              created_at: new Date(product.created_at).toLocaleDateString('en-US', options),
              expired_date: new Date(product.expired_date).toLocaleDateString('en-US', options),
              pictureUrl: product.pictureUrl
            }
          })
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

  static create (req, res) {
    if(!req.file) {
      req.file = {}
    }
    Product
      .create({
        name: req.body.name,
        amount: Number(req.body.amount),
        price: Number(req.body.price),
        created_at: new Date(req.body.created_at),
        expired_date: new Date(req.body.expired_date),
        pictureUrl: req.file.cloudStoragePublicUrl
      })
      .then(product => {
        res.status(201).json({
          message: `Product ${product.name} is added to the shop`,
          details: {
            _id: product._id,
            name: product.name,
            amount: product.amount,
            price: product.price,
            created_at: new Date(product.created_at).toLocaleDateString('en-US', options),
            expired_date: new Date(product.expired_date).toLocaleDateString('en-US', options),
            pictureUrl: product.pictureUrl
          }
        })
      })
      .catch(error => {
        if(error.errors.name) {
          res.status(400).json({
            message: error.errors.name.message
          })
        } else if(error.errors.amount) {
          res.status(400).json({
            message: error.errors.amount.message
          })
        } else if(error.errors.price) {
          res.status(400).json({
            message: error.errors.price.message
          })
        } else if(error.errors.created_at) {
          res.status(400).json({
            message: `${error.errors.created_at.reason.stringValue.slice(1, -1)} format`
          })
        } else if(error.errors.expired_date) {
          if(error.errors.expired_date.reason) {
            res.status(400).json({
              message: `${error.errors.expired_date.reason.stringValue.slice(1, -1)} format`
            })
          } else {
            res.status(400).json({
              message: error.errors.expired_date.message
            })
          }
        } else if(error.errors.pictureUrl) {
          res.status(400).json({
            message: error.errors.pictureUrl.message
          })
        } else {
          res.status(500).json({
            message: 'Internal Server Error'
          })
        }
      })
  }

  static update (req, res) {
    Product
      .findById(req.params.id)
      .then(product => {
        if(product) {
          product.name = req.body.name
          product.amount = Number(req.body.amount)
          product.price = Number(req.body.price)
          product.created_at = new Date(req.body.created_at)
          product.expired_date = new Date(req.body.expired_date)
          if(req.file) {
            product.pictureUrl = req.file.cloudStoragePublicUrl
          }
          return product.save()
        } else {
          res.status(404).json({
            message: 'Product not found'
          })
        }
      })
      .then(product => {
        let success = {
          message: `Product ${product.name} is updated`,
          product: {
            _id: product._id,
            name: product.name,
            amount: product.amount,
            price: product.price,
            created_at: new Date(product.created_at).toLocaleDateString('en-US', options),
            expired_date: new Date(product.expired_date).toLocaleDateString('en-US', options),
            pictureUrl: product.pictureUrl
          }
        }
        res.status(200).json(success)
      })
      .catch(error => {
        if(error.path === '_id') {
          res.status(404).json({
            message: 'Product Not Found'
          })
        } else if(error.errors.name) {
          res.status(400).json({
            message: error.errors.name.message
          })
        } else if(error.errors.amount) {
          res.status(400).json({
            message: error.errors.amount.message
          })
        } else if(error.errors.price) {
          res.status(400).json({
            message: error.errors.price.message
          })
        } else if(error.errors.created_at) {
          res.status(400).json({
            message: `${error.errors.created_at.reason.stringValue.slice(1, -1)} format`
          })
        } else if(error.errors.expired_date) {
          if(error.errors.expired_date.reason) {
            res.status(400).json({
              message: `${error.errors.expired_date.reason.stringValue.slice(1, -1)} format`
            })
          } else {
            res.status(400).json({
              message: error.errors.expired_date.message
            })
          }
        } else if(error.errors.pictureUrl) {
          res.status(400).json({
            message: error.errors.pictureUrl.message
          })
        } else {
          res.status(500).json({
            message: 'Internal Server Error'
          })
        }
      })
  }

  static remove (req, res) {
    Product
      .findByIdAndDelete(req.params.id)
      .then(product => {
        res.status(200).json({
          message: `Successfully delete ${product.name}`,
          product: {
            _id: product._id,
            name: product.name,
            amount: product.amount,
            price: product.price,
            created_at: new Date(product.created_at).toLocaleDateString('en-US', options),
            expired_date: new Date(product.expired_date).toLocaleDateString('en-US', options),
            pictureUrl: product.pictureUrl
          }
        })
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

}

module.exports = ProductController
