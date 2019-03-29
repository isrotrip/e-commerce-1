const Transaction = require('../models/transaction');
const Product = require('../models/product')
const rajaOngkirApi = require('../helpers/rajaOngkirApi');
const Cart = require('../models/cart')

class TransactionController {

  static readRajaOngkir (req, res) {
    rajaOngkirApi
      .get('/city')
      .then(({ data }) => {
        let city = [];
        let province = [];
        data.rajaongkir.results.forEach(result => {
          city.push({
            id: result.city_id,
            name: `${result.type} ${result.city_name}`
          })
          province.push({
            id: result.province_id,
            name: result.province
          })
        })
        res.status(200).json({
          message: 'Received Data From Raja Ongkir',
          dataOngkir: {
            city: city,
            province: province
          }
        })
      })
      .catch(error => {
        res.status(500).json({
          message: 'Internal Server Error'
        })
      })
  }

  static priceOngkir (req, res) {
    rajaOngkirApi
      .post('/cost', {
        origin: (Number(req.body.origin) + 1).toString(),
        destination: (Number(req.body.destination) + 1).toString(),
        courier: req.body.courier,
        weight: Number(req.cart.amount)*100
      })
      .then(({ data }) => {
        res.status(200).json({
          message: 'Get info delivery',
          info: data.rajaongkir.results
        })
      })
      .catch(({ response }) => {
        console.log(response.data)
        res.status(500).json({
          message: 'Internal Server Error'
        })
      })
  }

  static createSimple (req, res) {
    if(req.cart.productId.amount >= req.cart.amount) {

      Transaction
        .create({
          product: {
            _id: req.cart.productId._id,
            name: req.cart.productId.name,
            price: req.cart.productId.price
          },
          itemPrice: req.body.productPrice,
          deliverPrice: req.body.price,
          totalPrice: req.body.totalPrice,
          amount: req.cart.amount,
          status: 'pending',
          userId: req.userLogin._id
        })
        .then(transaction => {
          let productId = req.cart.productId._id
          Product
            .findByIdAndUpdate(productId, {
              amount: req.cart.productId.amount - req.cart.amount
            })
            .then(() => {
              Cart
                .findByIdAndDelete(req.cart._id)
                .then(() => {
                  res.status(201).json({
                    message: `Your product ${req.cart.productId.name} is on transaction in status as pending`,
                    transaction: transaction
                  })
                })
            })
        })
        .catch(error => {
          console.log(error)
          res.status(500).json({
            message: 'Internal Server Error'
          })
        })
    } else {
      res.status(400).json({
        message: 'Sorry the current stock is not enough'
      })
    }
  }

  static create (req, res) {
    if(!req.body.origin) {
      res.status(400).json({
        message: 'Origin field should be fill'
      })
    } else if(!req.body.destination) {
      res.status(400).json({
        message: 'Destination field should be fill'
      })
    } else if(!req.body.courier) {
      res.status(400).json({
        message: 'Courier field should be fill'
      })
    } else if(req.body.courier !== 'tiki' && req.body.courier !== 'jne' && req.body.courier !== 'pos') {
      res.status(400).json({
        message: 'Courier field should be fill with between tiki, jne, or pos'
      })
    } else if(!req.body.service) {
      res.status(400).json({
        message: 'Service field should be fill'
      })
    } else if(!req.body.price) {
      res.status(400).json({
        message: 'Price field should be fill'
      })
    } else if(!req.body.etd) {
      res.status(400).json({
        message: 'Etd field should be fill'
      })
    } else {
      if(req.cart.productId.amount >= req.cart.amount) {
        rajaOngkirApi
        .post('/cost', {
          origin: req.body.origin,
          destination: req.body.destination,
          courier: req.body.courier,
          weight: Number(req.cart.amount)*100 //semua barang dalam 100 gr
        })
        .then(({ data }) => {
          let filterFullName = data.rajaongkir.results.filter(result => result.name === req.body.courier_fullname)
          if(!filterFullName.length) {
            res.status(400).json({
              message: 'Your courier options is not available'
            })
          } else {
            let filterService = filterFullName.filter(result => result.costs.filter( cost => cost.service === req.body.service))
            if(!filterService) {
              res.status(400).json({
                message: 'Your courier options is not available'
              })
            } else {
              let filterPriceAndETD = filterFullName.filter(result => result.costs.filter( cost => cost.cost.filter( eachCost => {
                return eachCost.value === req.body.price && eachCost.etd === req.body.etd
              })))
              if(!filterPriceAndETD) {
                res.status(400).json({
                  message: 'Your courier options is not available'
                })
              } else {
                Transaction
                  .create({
                    product: {
                      _id: req.cart.productId._id,
                      name: req.cart.productId.name,
                      price: req.cart.productId.price
                    },
                    itemPrice: req.cart.productId.price * req.cart.amount,
                    deliverPrice: req.body.price,
                    totalPrice: req.cart.productId.price * req.cart.amount + req.body.price,
                    amount: req.cart.amount,
                    status: 'pending',
                    userId: req.userLogin._id
                  })
                  .then(transaction => {
                    let productId = req.cart.productId._id
                    Product
                      .findByIdAndUpdate(productId, {
                        amount: req.cart.productId.amount - req.cart.amount
                      })
                      .then(() => {
                        Cart
                          .findByIdAndDelete(req.cart._id)
                          .then(() => {
                            res.status(201).json({
                              message: `Your product ${req.cart.productId.name} is on transaction in status as pending`,
                              transaction: transaction
                            })
                          })
                      })
                  })
                  .catch(error => {
                    res.status(500).json({
                      message: 'Internal Server Error'
                    })
                  })
              }
            }
          }
        })
        .catch(error => {
          res.status(500).json({
            message: 'Internal Server Error'
          })
        })
      } else {
        res.status(400).json({
          message: 'Sorry the current stock is not enough'
        })
      }
    }
  }

  static read (req, res) {
    let findBy = {}
    if(req.userLogin.role !== 'admin') {
      findBy = { userId: req.userLogin._id}
    }
    Transaction
      .find(findBy)
      .then(transactions => {
        res.status(200).json({
          message: 'Find transaction success',
          transactions: transactions
        })
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: 'Internal Server Error'
        })
      })
  }

  static update (req, res) {
    let update = {
      status: req.body.status
    }
    if(req.body.status === 'send') {
      update.adminId = req.userLogin._id
    }
    Transaction
      .findByIdAndUpdate(req.params.id, update, { new: true })
      .then(transaction => {
        if(req.body.status === 'send') {
          res.status(200).json({
            message: 'Product sent',
            transaction: transaction
          })
        } else {
          res.status(200).json({
            message: 'Product accepted',
            transaction: transaction
          })
        }
      })
      .catch(error => {
        res.status(500).json({
          message: 'Internal Server Error'
        })
      })
  }

}

module.exports = TransactionController
