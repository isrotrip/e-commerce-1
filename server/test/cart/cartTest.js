const { app } = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { userLogin, adminLogin, editableChocolate, defaultChocolate } = require('../common');
const supertest = require('supertest');

let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let userToken = null;
let adminToken = null;
let googlePictureUrl = null;
let productId = null;
let cartId = null;

let created_at = new Date;
let expired_date = new Date
expired_date.setDate(expired_date.getDate() + 10);

let update_created_at = new Date;
let update_expired_date = new Date;
update_created_at.setDate(update_created_at.getDate() + 10);
update_expired_date.setDate(update_expired_date.getDate() + 20);

let addToCart = {
  amount: 1,
  productId: ''
}

require('dotenv').config();

chai.use(chaiHttp);

describe('ROUTE /carts', function () {

  ////////////////////////////////////////
  ////            CREATE              ////
  ////////////////////////////////////////
  
  describe('/POST /carts', function () {
    
    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {

      ////////////////////////////////////////
      ////     SET UP USER & PRODUCTS     ////
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
          .field(editableChocolate)
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
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('cart');
            expect(res.body.message).to.be.a('string');
            expect(res.body.cart).to.be.a('object');
            expect(res.body.message).to.equal(`Add product Milk Chocolate to your cart`);
            expect(res.body.cart).to.haveOwnProperty('amount');
            expect(res.body.cart).to.haveOwnProperty('product');
            expect(res.body.cart.amount).to.be.a('number');
            expect(res.body.cart.product).to.be.a('object');
            expect(res.body.cart.amount).to.be.equal(1);
            expect(res.body.cart.product).to.haveOwnProperty('name');
            expect(res.body.cart.product).to.haveOwnProperty('amount');
            expect(res.body.cart.product).to.haveOwnProperty('price');
            expect(res.body.cart.product).to.haveOwnProperty('created_at');
            expect(res.body.cart.product).to.haveOwnProperty('expired_date');
            expect(res.body.cart.product).to.haveOwnProperty('pictureUrl');
            expect(res.body.cart.product.name).to.be.a('string');
            expect(res.body.cart.product.amount).to.be.a('number');
            expect(res.body.cart.product.price).to.be.a('number');
            expect(res.body.cart.product.created_at).to.be.a('string');
            expect(res.body.cart.product.expired_date).to.be.a('string');
            expect(res.body.cart.product.pictureUrl).to.be.a('string');
            expect(res.body.cart.product.name).to.be.equal('Milk Chocolate');
            expect(res.body.cart.product.amount).to.be.equal(3);
            expect(res.body.cart.product.price).to.be.equal(40000);
            expect(res.body.cart.product.created_at).to.be.equal(new Date(update_created_at).toLocaleDateString('en-US', options));
            expect(res.body.cart.product.expired_date).to.be.equal(new Date(update_expired_date).toLocaleDateString('en-US', options));
            expect(res.body.cart.product.pictureUrl).to.be.a('string');
            expect(res.body.cart.product.pictureUrl).to.be.equal(googlePictureUrl);
            cartId = res.body.cart._id
            done();
          })
      })
    })

    ////////////////////////////////////////
    ////             Fail               ////
    ////////////////////////////////////////

    describe('Fail', function() {
      it.only('should return status code 400 if the non-login user try to create product', function (done) {
        chai
          .request(app)
          .post('/carts')
          .set('token', '')
          .send('')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Invalid token')
            done();
          })
      })
  
      it.only('should return status code 404 if the field productId is wrong or not found', function (done) {
        chai
          .request(app)
          .post('/carts')
          .set('token', userToken)
          .send({
            amount: '',
            productId: '111'
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Product Not Found')
            done();
          })
      })
  
      it.only('should return status code 400 if the amount field is less than 1', function (done) {
        chai
          .request(app)
          .post('/carts')
          .set('token', userToken)
          .send({
            amount: '',
            productId: productId
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Minimum product in cart amount is 1')
            done();
          })
      })
  
      it.only('should return status code 400 if amount is higher than product amount', function (done) {
        chai
          .request(app)
          .post('/carts')
          .set('token', userToken)
          .send({
            amount: 4,
            productId: productId
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Product amount is not sufficient')
            done();
          })
      })

    })
  })

  ////////////////////////////////////////
  ////            READ                ////
  ////////////////////////////////////////
  
  describe('/GET /carts', function () {
    
    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {

      it.only('should return status code 200 response should be an arrays', function (done) {
        chai
          .request(app)
          .get('/carts')
          .set('token', userToken)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('carts');
            expect(res.body.message).to.be.a('string');
            expect(res.body.carts).to.be.a('array');
            expect(res.body.message).to.equal(`Read your cart success`);
            expect(res.body.carts[0]).to.be.a('object');
            expect(res.body.carts[0]).to.haveOwnProperty('amount');
            expect(res.body.carts[0]).to.haveOwnProperty('product');
            expect(res.body.carts[0].amount).to.be.a('number');
            expect(res.body.carts[0].product).to.be.a('object');
            expect(res.body.carts[0].amount).to.be.equal(1);
            expect(res.body.carts[0].product).to.haveOwnProperty('name');
            expect(res.body.carts[0].product).to.haveOwnProperty('amount');
            expect(res.body.carts[0].product).to.haveOwnProperty('price');
            expect(res.body.carts[0].product).to.haveOwnProperty('created_at');
            expect(res.body.carts[0].product).to.haveOwnProperty('expired_date');
            expect(res.body.carts[0].product).to.haveOwnProperty('pictureUrl');
            expect(res.body.carts[0].product.name).to.be.a('string');
            expect(res.body.carts[0].product.amount).to.be.a('number');
            expect(res.body.carts[0].product.price).to.be.a('number');
            expect(res.body.carts[0].product.created_at).to.be.a('string');
            expect(res.body.carts[0].product.expired_date).to.be.a('string');
            expect(res.body.carts[0].product.pictureUrl).to.be.a('string');
            expect(res.body.carts[0].product.name).to.be.equal('Milk Chocolate');
            expect(res.body.carts[0].product.amount).to.be.equal(3);
            expect(res.body.carts[0].product.price).to.be.equal(40000);
            expect(res.body.carts[0].product.created_at).to.be.equal(new Date(update_created_at).toLocaleDateString('en-US', options));
            expect(res.body.carts[0].product.expired_date).to.be.equal(new Date(update_expired_date).toLocaleDateString('en-US', options));
            expect(res.body.carts[0].product.pictureUrl).to.be.a('string');
            expect(res.body.carts[0].product.pictureUrl).to.be.equal(googlePictureUrl);
            done();
          })
      })

    })

    ////////////////////////////////////////
    ////             Fail               ////
    ////////////////////////////////////////

    describe('Fail', function () {

      it.only('should return status code 400 response if token is invalid', function (done) {
        chai
          .request(app)
          .get('/carts')
          .set('token', '')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Invalid token')
            done();
          })
      })

    })
  })

  ////////////////////////////////////////
  ////            UPDATE              ////
  ////////////////////////////////////////
  
  describe('/PUT /carts', function () {
    
    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {

      it.only('should return status code 200 response should be an arrays', function (done) {
        chai
          .request(app)
          .put(`/carts/${cartId}`)
          .set('token', userToken)
          .send({
            amount: 2,
            productId: productId
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('cart');
            expect(res.body.message).to.be.a('string');
            expect(res.body.cart).to.be.a('object');
            expect(res.body.message).to.equal(`Update product Milk Chocolate from your cart`);
            expect(res.body.cart).to.haveOwnProperty('amount');
            expect(res.body.cart).to.haveOwnProperty('product');
            expect(res.body.cart.amount).to.be.a('number');
            expect(res.body.cart.product).to.be.a('object');
            expect(res.body.cart.amount).to.be.equal(2);
            expect(res.body.cart.product).to.haveOwnProperty('name');
            expect(res.body.cart.product).to.haveOwnProperty('amount');
            expect(res.body.cart.product).to.haveOwnProperty('price');
            expect(res.body.cart.product).to.haveOwnProperty('created_at');
            expect(res.body.cart.product).to.haveOwnProperty('expired_date');
            expect(res.body.cart.product).to.haveOwnProperty('pictureUrl');
            expect(res.body.cart.product.name).to.be.a('string');
            expect(res.body.cart.product.amount).to.be.a('number');
            expect(res.body.cart.product.price).to.be.a('number');
            expect(res.body.cart.product.created_at).to.be.a('string');
            expect(res.body.cart.product.expired_date).to.be.a('string');
            expect(res.body.cart.product.pictureUrl).to.be.a('string');
            expect(res.body.cart.product.name).to.be.equal('Milk Chocolate');
            expect(res.body.cart.product.amount).to.be.equal(3);
            expect(res.body.cart.product.price).to.be.equal(40000);
            expect(res.body.cart.product.created_at).to.be.equal(new Date(update_created_at).toLocaleDateString('en-US', options));
            expect(res.body.cart.product.expired_date).to.be.equal(new Date(update_expired_date).toLocaleDateString('en-US', options));
            expect(res.body.cart.product.pictureUrl).to.be.a('string');
            expect(res.body.cart.product.pictureUrl).to.be.equal(googlePictureUrl);
            done();
          })
      })

    })

    ////////////////////////////////////////
    ////              Fail              ////
    ////////////////////////////////////////

    describe('Fail', function () {

      it.only('should return status code 400 if none login person try to change the cart', function (done) {
        chai
          .request(app)
          .put(`/carts/${cartId}`)
          .set('token', '')
          .send({
            amount: 2,
            productId: productId
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.equal('Invalid token')
            done();
          })
      })

      it.only('should return status code 401 if another person try to change the cart', function (done) {
        chai
          .request(app)
          .put(`/carts/${cartId}`)
          .set('token', adminToken)
          .send({
            amount: 2,
            productId: productId
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.equal('Not Authorized')
            done();
          })
      })

      it.only('should return status code 401 if cart id not found or wrong', function (done) {
        chai
          .request(app)
          .put(`/carts/111`)
          .set('token', userToken)
          .send({
            amount: 2,
            productId: productId
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.equal('Cart Not Found')
            done();
          })
      })

      it.only('should return status code 400 if product id is wrong', function (done) {
        chai
          .request(app)
          .put(`/carts/${cartId}`)
          .set('token', userToken)
          .send({
            amount: 0,
            productId: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.equal('Product Not Found')
            done();
          })
      })

      it.only('should return status code 400 if amount is less than 0', function (done) {
        chai
          .request(app)
          .put(`/carts/${cartId}`)
          .set('token', userToken)
          .send({
            amount: 0,
            productId: productId
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.equal('Minimum product in cart amount is 1')
            done();
          })
      })

      it.only('should return status code 400 if amount is less than product amount', function (done) {
        chai
          .request(app)
          .put(`/carts/${cartId}`)
          .set('token', userToken)
          .send({
            amount: 5,
            productId: productId
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.equal('Product amount doesn\'t sufficient')
            done();
          })
      })

    })

  })

  ////////////////////////////////////////
  ////            DELETE              ////
  ////////////////////////////////////////
  
  describe('/DELETE /carts', function () {
    
    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {

      it.only('should return status code 200 response should be an arrays', function (done) {
        chai
          .request(app)
          .delete(`/carts/${cartId}`)
          .set('token', userToken)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('cart');
            expect(res.body.message).to.be.a('string');
            expect(res.body.cart).to.be.a('object');
            expect(res.body.message).to.equal(`Delete product Milk Chocolate from your cart`);
            expect(res.body.cart).to.haveOwnProperty('amount');
            expect(res.body.cart).to.haveOwnProperty('product');
            expect(res.body.cart.amount).to.be.a('number');
            expect(res.body.cart.product).to.be.a('object');
            expect(res.body.cart.amount).to.be.equal(2);
            expect(res.body.cart.product).to.haveOwnProperty('name');
            expect(res.body.cart.product).to.haveOwnProperty('amount');
            expect(res.body.cart.product).to.haveOwnProperty('price');
            expect(res.body.cart.product).to.haveOwnProperty('created_at');
            expect(res.body.cart.product).to.haveOwnProperty('expired_date');
            expect(res.body.cart.product).to.haveOwnProperty('pictureUrl');
            expect(res.body.cart.product.name).to.be.a('string');
            expect(res.body.cart.product.amount).to.be.a('number');
            expect(res.body.cart.product.price).to.be.a('number');
            expect(res.body.cart.product.created_at).to.be.a('string');
            expect(res.body.cart.product.expired_date).to.be.a('string');
            expect(res.body.cart.product.pictureUrl).to.be.a('string');
            expect(res.body.cart.product.name).to.be.equal('Milk Chocolate');
            expect(res.body.cart.product.amount).to.be.equal(3);
            expect(res.body.cart.product.price).to.be.equal(40000);
            expect(res.body.cart.product.created_at).to.be.equal(new Date(update_created_at).toLocaleDateString('en-US', options));
            expect(res.body.cart.product.expired_date).to.be.equal(new Date(update_expired_date).toLocaleDateString('en-US', options));
            expect(res.body.cart.product.pictureUrl).to.be.a('string');
            expect(res.body.cart.product.pictureUrl).to.be.equal(googlePictureUrl);
            done();
          })
      })

    })

    ////////////////////////////////////////
    ////              Fail              ////
    ////////////////////////////////////////

    describe('Fail', function () {

      it.only('should return status code 201 add cart to test delete', function (done) {
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

      it.only('should return status code 400 if none login person try to change the cart', function (done) {
        chai
          .request(app)
          .delete(`/carts/${cartId}`)
          .set('token', '')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.equal('Invalid token')
            done();
          })
      })

      it.only('should return status code 401 if another person try to change the cart', function (done) {
        chai
          .request(app)
          .delete(`/carts/${cartId}`)
          .set('token', adminToken)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.equal('Not Authorized')
            done();
          })
      })

      it.only('should return status code 401 if cart id not found or wrong', function (done) {
        chai
          .request(app)
          .delete(`/carts/111`)
          .set('token', userToken)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.equal('Cart Not Found')
            done();
          })
      })
    })

  })

})