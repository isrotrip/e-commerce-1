const { app } = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { userLogin, adminLogin } = require('../common');
const supertest = require('supertest');

let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let userToken = null;
let adminToken = null;
let googlePictureUrl = null;
let productId = null;
let cartId = null;
let cartId2 = null;
let priceOngkir = 0;
let transactionId = null;


let created_at = new Date;
let expired_date = new Date
expired_date.setDate(expired_date.getDate() + 10);


let update_created_at = new Date;
let update_expired_date = new Date;
update_created_at.setDate(update_created_at.getDate() + 10);
update_expired_date.setDate(update_expired_date.getDate() + 20);

let defaultChocolate = {
  name: 'Melt Chocolate',
  amount: 10,
  price: 30000,
  created_at: created_at.toString(),
  expired_date: expired_date.toString()
}

let editableChocolate = {
  name: 'Vanilla Chocolate',
  amount: 3,
  price: 40000,
  created_at: update_created_at.toString(),
  expired_date: update_expired_date.toString()
}

let addToCart = {
  amount: 3,
  productId: ''
}

require('dotenv').config();

chai.use(chaiHttp);

describe('ROUTE /transactions', function () {

  ////////////////////////////////////////
  ////    GET DATA FROM RAJA ONGKIR   ////
  ////////////////////////////////////////
  
  describe('/GET /transactions/rajaOngkir', function () {
    
    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {

      ////////////////////////////////////////
      //// SET UP USER & PRODUCTS & CARTS ////
      ////////////////////////////////////////

      it.only('should prepare user first', function (done) {
        chai
          .request(app)
          .post('/users/login')
          .send(userLogin)
          .end(function (err, res) {
            userToken = res.body.token;
          })
        
        chai
          .request(app)
          .post('/users/login')
          .send(adminLogin)
          .end(function (err, res) {
            adminToken = res.body.token;
            done();
          })
      })

      it.only('should return status code 201 response should be an objects', function (done) {
        this.timeout(10000);
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', './test/images/test.png')
          .field(defaultChocolate)
          .end(function(err, res) {
            googlePictureUrl = res.body.details.pictureUrl
            productId = res.body.details._id
            addToCart.productId = res.body.details._id
            done()
          })
      })

      it.only('should return status code 201 response should be an objects', function (done) {
        chai
          .request(app)
          .post('/carts')
          .set('token', userToken)
          .send(addToCart)
          .end(function(err, res) {
            cartId = res.body.cart._id
            done();
          })
      })

      it.only('should return status code 201 response should be an objects', function (done) {
        chai
          .request(app)
          .post('/carts')
          .set('token', userToken)
          .send(addToCart)
          .end(function(err, res) {
            cartId2 = res.body.cart._id
            done();
          })
      })

      it.only('should return status code 200 response should be an objects', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .get('/transactions/rajaOngkir')
          .set('token', userToken)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('dataOngkir');
            expect(res.body.message).to.be.a('string');
            expect(res.body.dataOngkir).to.be.an('object');
            expect(res.body.message).to.be.equal('Received Data From Raja Ongkir');
            expect(res.body.dataOngkir).to.haveOwnProperty('city');
            expect(res.body.dataOngkir).to.haveOwnProperty('province');
            expect(res.body.dataOngkir.city).to.be.an('array');
            expect(res.body.dataOngkir.province).to.be.an('array');
            expect(res.body.dataOngkir.city[0]).to.be.an('object');
            expect(res.body.dataOngkir.province[0]).to.be.an('object');
            expect(res.body.dataOngkir.city[0]).to.haveOwnProperty('id');
            expect(res.body.dataOngkir.city[0]).to.haveOwnProperty('name');
            expect(res.body.dataOngkir.province[0]).to.haveOwnProperty('id');
            expect(res.body.dataOngkir.province[0]).to.haveOwnProperty('name');
            expect(res.body.dataOngkir.city[0].id).to.be.a('string');
            expect(res.body.dataOngkir.city[0].name).to.be.a('string');
            expect(res.body.dataOngkir.province[0].id).to.be.a('string');
            expect(res.body.dataOngkir.province[0].name).to.be.a('string');
            done();
          })
      })
    })

    ////////////////////////////////////////
    ////             Fail               ////
    ////////////////////////////////////////

    describe('Fail', function () {
      it.only('should return status code 400 if non-login person trying to access get rajaongkir route', function (done) {
        chai
          .request(app)
          .get('/transactions/rajaOngkir')
          .set('token', '')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Invalid token');
            done();
          })
        })
    })

  })

  ////////////////////////////////////////
  ////            CREATE              ////
  ////////////////////////////////////////
  
  describe('/POST /transactions', function () {
    
    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {

      it.only('should return status code 201 response should be an objects', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .post('/transactions')
          .set('token', userToken)
          .send({
            cartId: cartId2,
            origin: '1',
            destination: '2',
            courier: 'tiki',
            courier_fullname: 'Citra Van Titipan Kilat (TIKI)',
            service: 'REG',
            price: 40000,
            etd: '3'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('transaction');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Your product Melt Chocolate is on transaction in status as pending');
            expect(res.body.transaction).to.be.an('object')
            expect(res.body.transaction).to.haveOwnProperty('_id');
            expect(res.body.transaction).to.haveOwnProperty('product');
            expect(res.body.transaction).to.haveOwnProperty('itemPrice');
            expect(res.body.transaction).to.haveOwnProperty('deliverPrice');
            expect(res.body.transaction).to.haveOwnProperty('totalPrice');
            expect(res.body.transaction).to.haveOwnProperty('amount');
            expect(res.body.transaction).to.haveOwnProperty('status');
            expect(res.body.transaction).to.haveOwnProperty('userId');
            expect(res.body.transaction._id).to.be.a('string');
            expect(res.body.transaction.product).to.be.an('object');
            expect(res.body.transaction.itemPrice).to.be.a('number');
            expect(res.body.transaction.deliverPrice).to.be.a('number');
            expect(res.body.transaction.totalPrice).to.be.a('number');
            expect(res.body.transaction.status).to.be.a('string');
            expect(res.body.transaction.userId).to.be.a('string');
            expect(res.body.transaction.product.name).to.be.equal('Melt Chocolate');
            expect(res.body.transaction.product.price).to.be.equal(30000);
            expect(res.body.transaction.amount).to.be.equal(3);
            expect(res.body.transaction.status).to.be.equal('pending');
            expect(res.body.transaction.product).to.haveOwnProperty('_id');
            expect(res.body.transaction.product).to.haveOwnProperty('name');
            expect(res.body.transaction.product).to.haveOwnProperty('price');
            expect(res.body.transaction.product._id).to.be.a('string');
            expect(res.body.transaction.product.name).to.be.a('string');
            expect(res.body.transaction.product.price).to.be.a('number');
            expect(res.body.transaction.product.name).to.be.equal('Melt Chocolate');
            expect(res.body.transaction.product.price).to.be.equal(30000);
            transactionId = res.body.transaction._id
            done();
          })
      })

      it.only('should return status code 200 with reduced product amount', function(done) {
        chai
          .request(app)
          .get(`/products/${productId}`)
          .end(function(err, res) {
            expect(res.body.product.amount).to.be.equal(7)
            done();
          })
      })
      
      it.only('should return status code 200 with empty cart', function(done) {
        chai
          .request(app)
          .get(`/carts`)
          .set('token', userToken)
          .end(function(err, res) {
            expect(res.body.carts.filter(cart => cart._id.toString() === cartId2.toString()).length).to.be.equal(0)
          })
          done();
      })
    })

    ////////////////////////////////////////
    ////            Fail                ////
    ////////////////////////////////////////

    describe('Fail', function () {

      it.only('should return status code 400 response if non login person try to access', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .post('/transactions')
          .set('token', '')
          .send({
            cartId: cartId,
            origin: '1',
            destination: '2',
            courier: 'tiki',
            courier_fullname: 'Citra Van Titipan Kilat (TIKI)',
            service: 'REG',
            price: 40000,
            etd: '3'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Invalid token');
            done();
          })
      })

      it.only('should return status code 400 response if origin field is empty', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .post('/transactions')
          .set('token', userToken)
          .send({
            cartId: cartId,
            origin: '',
            destination: '2',
            courier: 'tiki',
            courier_fullname: 'Citra Van Titipan Kilat (TIKI)',
            service: 'REG',
            price: 40000,
            etd: '3'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Origin field should be fill');
            done();
          })
      })

      it.only('should return status code 400 response if destination field is empty', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .post('/transactions')
          .set('token', userToken)
          .send({
            cartId: cartId,
            origin: '1',
            destination: '',
            courier: 'tiki',
            courier_fullname: 'Citra Van Titipan Kilat (TIKI)',
            service: 'REG',
            price: 40000,
            etd: '3'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Destination field should be fill');
            done();
          })
      })

      it.only('should return status code 400 response if courier field is empty', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .post('/transactions')
          .set('token', userToken)
          .send({
            cartId: cartId,
            origin: '1',
            destination: '2',
            courier: '',
            courier_fullname: 'Citra Van Titipan Kilat (TIKI)',
            service: 'REG',
            price: 40000,
            etd: '3'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Courier field should be fill');
            done();
          })
      })

      it.only('should return status code 400 response if courier is not tiki, jne, or pos', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .post('/transactions')
          .set('token', userToken)
          .send({
            cartId: cartId,
            origin: '1',
            destination: '2',
            courier: 'toko',
            courier_fullname: 'Citra Van Titipan Kilat (TIKI)',
            service: 'REG',
            price: 40000,
            etd: '3'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Courier field should be fill with between tiki, jne, or pos');
            done();
          })
      })

      it.only('should return status code 400 response if service field is empty', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .post('/transactions')
          .set('token', userToken)
          .send({
            cartId: cartId,
            origin: '1',
            destination: '2',
            courier: 'tiki',
            courier_fullname: 'Citra Van Titipan Kilat (TIKI)',
            service: '',
            price: 40000,
            etd: '3'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Service field should be fill');
            done();
          })
      })

      it.only('should return status code 400 response if price field is empty', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .post('/transactions')
          .set('token', userToken)
          .send({
            cartId: cartId,
            origin: '1',
            destination: '2',
            courier: 'tiki',
            courier_fullname: 'Citra Van Titipan Kilat (TIKI)',
            service: 'REG',
            price: 0,
            etd: '3'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Price field should be fill');
            done();
          })
      })

      it.only('should return status code 400 response if etd field is empty', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .post('/transactions')
          .set('token', userToken)
          .send({
            cartId: cartId,
            origin: '1',
            destination: '2',
            courier: 'tiki',
            courier_fullname: 'Citra Van Titipan Kilat (TIKI)',
            service: 'REG',
            price: 40000,
            etd: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Etd field should be fill');
            done();
          })
      })

      it.only('should return status code 404 response if cartId field is empty', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .post('/transactions')
          .set('token', userToken)
          .send({
            cartId: '',
            origin: '1',
            destination: '2',
            courier: 'tiki',
            courier_fullname: 'Citra Van Titipan Kilat (TIKI)',
            service: 'REG',
            price: 40000,
            etd: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Cart Not Found');
            done();
          })
      })

    })

  })


  ////////////////////////////////////////
  ////            READ                ////
  ////////////////////////////////////////
  
  describe('/GET /transactions', function () {
    
    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {

      it.only('should return status code 200 response should be an objects', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .get('/transactions')
          .set('token', userToken)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('transactions');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Find transaction success');
            expect(res.body.transactions).to.be.an('array')
            expect(res.body.transactions[0]).to.haveOwnProperty('_id');
            expect(res.body.transactions[0]).to.haveOwnProperty('product');
            expect(res.body.transactions[0]).to.haveOwnProperty('itemPrice');
            expect(res.body.transactions[0]).to.haveOwnProperty('deliverPrice');
            expect(res.body.transactions[0]).to.haveOwnProperty('totalPrice');
            expect(res.body.transactions[0]).to.haveOwnProperty('amount');
            expect(res.body.transactions[0]).to.haveOwnProperty('status');
            expect(res.body.transactions[0]).to.haveOwnProperty('userId');
            expect(res.body.transactions[0]._id).to.be.a('string');
            expect(res.body.transactions[0].product).to.be.an('object');
            expect(res.body.transactions[0].itemPrice).to.be.a('number');
            expect(res.body.transactions[0].deliverPrice).to.be.a('number');
            expect(res.body.transactions[0].totalPrice).to.be.a('number');
            expect(res.body.transactions[0].status).to.be.a('string');
            expect(res.body.transactions[0].userId).to.be.a('string');
            expect(res.body.transactions[0].product.name).to.be.equal('Melt Chocolate');
            expect(res.body.transactions[0].product.price).to.be.equal(30000);
            expect(res.body.transactions[0].amount).to.be.equal(3);
            expect(res.body.transactions[0].status).to.be.equal('pending');
            expect(res.body.transactions[0].product).to.haveOwnProperty('_id');
            expect(res.body.transactions[0].product).to.haveOwnProperty('name');
            expect(res.body.transactions[0].product).to.haveOwnProperty('price');
            expect(res.body.transactions[0].product._id).to.be.a('string');
            expect(res.body.transactions[0].product.name).to.be.a('string');
            expect(res.body.transactions[0].product.price).to.be.a('number');
            expect(res.body.transactions[0].product.name).to.be.equal('Melt Chocolate');
            expect(res.body.transactions[0].product.price).to.be.equal(30000);
            done();
          })
      })
    })

    ////////////////////////////////////////
    ////              Fail              ////
    ////////////////////////////////////////

    describe('Fail', function () {

      it.only('should return status code 404 if non login user try to access transactions', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .get('/transactions')
          .set('token', '')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.equal('Invalid token');
            done();
          })
        })
      })

  })

  ////////////////////////////////////////
  ////            Product             ////
  ////////////////////////////////////////

  describe('/PUT /transactions', function () {
    
    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {

      it.only('should return status code 200 response should be an objects', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .put(`/transactions/${transactionId}`)
          .set('token', adminToken)
          .send({
            status: 'send'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('transaction');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Product sent');
            expect(res.body.transaction).to.be.an('object')
            expect(res.body.transaction).to.haveOwnProperty('_id');
            expect(res.body.transaction).to.haveOwnProperty('product');
            expect(res.body.transaction).to.haveOwnProperty('itemPrice');
            expect(res.body.transaction).to.haveOwnProperty('deliverPrice');
            expect(res.body.transaction).to.haveOwnProperty('totalPrice');
            expect(res.body.transaction).to.haveOwnProperty('amount');
            expect(res.body.transaction).to.haveOwnProperty('status');
            expect(res.body.transaction).to.haveOwnProperty('userId');
            expect(res.body.transaction._id).to.be.a('string');
            expect(res.body.transaction.product).to.be.an('object');
            expect(res.body.transaction.itemPrice).to.be.a('number');
            expect(res.body.transaction.deliverPrice).to.be.a('number');
            expect(res.body.transaction.totalPrice).to.be.a('number');
            expect(res.body.transaction.status).to.be.a('string');
            expect(res.body.transaction.userId).to.be.a('string');
            expect(res.body.transaction.product.name).to.be.equal('Melt Chocolate');
            expect(res.body.transaction.product.price).to.be.equal(30000);
            expect(res.body.transaction.amount).to.be.equal(3);
            expect(res.body.transaction.status).to.be.equal('send');
            expect(res.body.transaction.product).to.haveOwnProperty('_id');
            expect(res.body.transaction.product).to.haveOwnProperty('name');
            expect(res.body.transaction.product).to.haveOwnProperty('price');
            expect(res.body.transaction.product._id).to.be.a('string');
            expect(res.body.transaction.product.name).to.be.a('string');
            expect(res.body.transaction.product.price).to.be.a('number');
            expect(res.body.transaction.product.name).to.be.equal('Melt Chocolate');
            expect(res.body.transaction.product.price).to.be.equal(30000);
            done();
          })
      })

      it.only('should return status code 200 response should be an objects', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .put(`/transactions/${transactionId}`)
          .set('token', userToken)
          .send({
            status: 'accept'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('transaction');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Product accepted');
            expect(res.body.transaction).to.be.an('object')
            expect(res.body.transaction).to.haveOwnProperty('_id');
            expect(res.body.transaction).to.haveOwnProperty('product');
            expect(res.body.transaction).to.haveOwnProperty('itemPrice');
            expect(res.body.transaction).to.haveOwnProperty('deliverPrice');
            expect(res.body.transaction).to.haveOwnProperty('totalPrice');
            expect(res.body.transaction).to.haveOwnProperty('amount');
            expect(res.body.transaction).to.haveOwnProperty('status');
            expect(res.body.transaction).to.haveOwnProperty('userId');
            expect(res.body.transaction._id).to.be.a('string');
            expect(res.body.transaction.product).to.be.an('object');
            expect(res.body.transaction.itemPrice).to.be.a('number');
            expect(res.body.transaction.deliverPrice).to.be.a('number');
            expect(res.body.transaction.totalPrice).to.be.a('number');
            expect(res.body.transaction.status).to.be.a('string');
            expect(res.body.transaction.userId).to.be.a('string');
            expect(res.body.transaction.product.name).to.be.equal('Melt Chocolate');
            expect(res.body.transaction.product.price).to.be.equal(30000);
            expect(res.body.transaction.amount).to.be.equal(3);
            expect(res.body.transaction.status).to.be.equal('accept');
            expect(res.body.transaction.product).to.haveOwnProperty('_id');
            expect(res.body.transaction.product).to.haveOwnProperty('name');
            expect(res.body.transaction.product).to.haveOwnProperty('price');
            expect(res.body.transaction.product._id).to.be.a('string');
            expect(res.body.transaction.product.name).to.be.a('string');
            expect(res.body.transaction.product.price).to.be.a('number');
            expect(res.body.transaction.product.name).to.be.equal('Melt Chocolate');
            expect(res.body.transaction.product.price).to.be.equal(30000);
            done();
          })
      })      
    })

    ////////////////////////////////////////
    ////             Fail               ////
    ////////////////////////////////////////

    describe('Fail', function () {

      it.only('should return status code 401 if the transaction is not in the status pending', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .put(`/transactions/${transactionId}`)
          .set('token', adminToken)
          .send({
            status: 'send'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.equal('Not Authorized');
            done();
          })
      })

      it.only('should return status code 200 response if another user try to accept the product', function (done) {
        this.timeout(10000)
        chai
          .request(app)
          .put(`/transactions/${transactionId}`)
          .set('token', adminToken)
          .send({
            status: 'accept'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.equal('Not Authorized');
            done();
          })
      })      
    })


  })

})