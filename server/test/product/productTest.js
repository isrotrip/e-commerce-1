const { app } = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { userLogin, adminLogin, editableChocolate, defaultChocolate } = require('../common');
const supertest = require('supertest');

let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let created_at = new Date;
let expired_date = new Date
expired_date.setDate(expired_date.getDate() + 10);

let update_created_at = new Date;
let update_expired_date = new Date;
update_created_at.setDate(update_created_at.getDate() + 10);
update_expired_date.setDate(update_expired_date.getDate() + 20);

let userToken = null;
let adminToken = null;
let googlePictureUrl = null;
let productId = null;

require('dotenv').config();

chai.use(chaiHttp);

describe('ROUTE /products', function () {

  ////////////////////////////////////////
  ////            CREATE              ////
  ////////////////////////////////////////
  
  describe('/POST /products', function () {
    
    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {

      ////////////////////////////////////////
      ////        SET UP USER             ////
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
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('details');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Product Browny Chocolate is added to the shop');
            expect(res.body.details).to.haveOwnProperty('name');
            expect(res.body.details).to.haveOwnProperty('amount');
            expect(res.body.details).to.haveOwnProperty('price');
            expect(res.body.details).to.haveOwnProperty('created_at');
            expect(res.body.details).to.haveOwnProperty('expired_date');
            expect(res.body.details).to.haveOwnProperty('pictureUrl');
            expect(res.body.details.name).to.be.a('string');
            expect(res.body.details.name).to.equal('Browny Chocolate');
            expect(res.body.details.amount).to.be.a('number');
            expect(res.body.details.amount).to.equal(10);
            expect(res.body.details.price).to.be.a('number');
            expect(res.body.details.price).to.equal(30000);
            expect(res.body.details.created_at).to.equal(new Date(created_at).toLocaleDateString('en-US', options));
            expect(res.body.details.expired_date).to.equal(new Date(expired_date).toLocaleDateString('en-US', options));
            expect(res.body.details.pictureUrl).to.be.a('string');
            googlePictureUrl = res.body.details.pictureUrl
            productId = res.body.details._id
            done();
          })
      })

    })


    ////////////////////////////////////////
    ////              Fail              ////
    ////////////////////////////////////////

    describe('Fail', function () {

      it.only('should return status code 400 if the non-login user try to create product', function (done) {
        supertest(app)
          .post('/products')
          .set('token', '')
          .attach('image', '')
          .field(defaultChocolate)
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

      it.only('should return status code 401 if the customer try to create product', function (done) {
        supertest(app)
          .post('/products')
          .set('token', userToken)
          .attach('image', '')
          .field(defaultChocolate)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Not authorized')
            done();
          })
      })

      it.only('should return status code 400 if the field name is empty', function (done) {
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: '',
            amount: 0,
            price: 0,
            created_at: '',
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Name field should be fill')
            done();
          })
      })

      it.only('should return status code 400 if the field name is already on the products list', function (done) {
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Browny Chocolate',
            amount: 0,
            price: 0,
            created_at: '',
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Products already on the list')
            done();
          })
      })

      it.only('should return status code 400 if amount less than 0', function (done) {
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: -1,
            price: 0,
            created_at: '',
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Amount can\'t be less than 0')
            done();
          })
      })

      it.only('should return status code 400 if price field is less than 1000', function (done) {
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: 1,
            price: 500,
            created_at: '',
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Minimum price is 1000')
            done();
          })
      })

      it.only('should return status code 400 if price field is negative', function (done) {
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: 1,
            price: -500,
            created_at: '',
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Minimum price is 1000')
            done();
          })
      })

      it.only('should return status code 400 if created_at field is empty', function (done) {
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: 1,
            price: 1000,
            created_at: '',
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Invalid Date format')
            done();
          })
      })

      it.only('should return status code 400 if expired_date is empty', function (done) {
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: 1,
            price: 1000,
            created_at: created_at.toString(),
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Invalid Date format')
            done();
          })
      })

      it.only('should return status code 400 if expired_date < created_at', function (done) {
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: 1,
            price: 1000,
            created_at: expired_date.toString(),
            expired_date: created_at.toString()
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Cannot create expired product')
            done();
          })
      })

      it.only('should return status code 400 if image is empty', function (done) {
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: 1,
            price: 1000,
            created_at: created_at.toString(),
            expired_date: expired_date.toString()
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Picture field should be fill')
            done();
          })
      })

    })

  })


  ////////////////////////////////////////
  ////            READ                ////
  ////////////////////////////////////////

  describe('/GET /products', function () {

    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {
      describe('Read all products', function () {
        it.only('should return status code 200 response should be an objects', function (done) {
          chai
            .request(app)
            .get('/products')
            .end(function(err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.have.be.an('object');
              expect(res.body).to.haveOwnProperty('message');
              expect(res.body).to.haveOwnProperty('products');
              expect(res.body.message).to.be.an('string');
              expect(res.body.message).to.be.equal('Read Product success');
              expect(res.body.products).to.be.an('array');
              expect(res.body.products[0]).to.haveOwnProperty('name')
              expect(res.body.products[0]).to.haveOwnProperty('amount')
              expect(res.body.products[0]).to.haveOwnProperty('price')
              expect(res.body.products[0]).to.haveOwnProperty('created_at')
              expect(res.body.products[0]).to.haveOwnProperty('expired_date')
              expect(res.body.products[0]).to.haveOwnProperty('pictureUrl')
              expect(res.body.products[0].name).to.be.a('string')
              expect(res.body.products[0].amount).to.be.a('number')
              expect(res.body.products[0].price).to.be.a('number')
              expect(res.body.products[0].created_at).to.be.a('string')
              expect(res.body.products[0].expired_date).to.be.a('string')
              expect(res.body.products[0].pictureUrl).to.be.a('string')
              expect(res.body.products[0].name).to.be.equal('Browny Chocolate')
              expect(res.body.products[0].amount).to.be.equal(10)
              expect(res.body.products[0].price).to.be.equal(30000)
              expect(res.body.products[0].created_at).to.be.equal(new Date(created_at).toLocaleDateString('en-US', options))
              expect(res.body.products[0].expired_date).to.be.equal(new Date(expired_date).toLocaleDateString('en-US', options))
              expect(res.body.products[0].pictureUrl).to.be.equal(googlePictureUrl)
              done()
            })
        })
      })

      describe('Read one product found', function () {
        it.only('should return status code 200 response should be an objects', function (done) {
          chai
            .request(app)
            .get(`/products/${productId}`)
            .end(function(err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.have.be.an('object');
              expect(res.body).to.haveOwnProperty('message');
              expect(res.body).to.haveOwnProperty('product');
              expect(res.body.message).to.be.an('string');
              expect(res.body.message).to.be.equal('Product found');
              expect(res.body.product).to.be.an('object');
              expect(res.body.product).to.haveOwnProperty('name')
              expect(res.body.product).to.haveOwnProperty('amount')
              expect(res.body.product).to.haveOwnProperty('price')
              expect(res.body.product).to.haveOwnProperty('created_at')
              expect(res.body.product).to.haveOwnProperty('expired_date')
              expect(res.body.product).to.haveOwnProperty('pictureUrl')
              expect(res.body.product.name).to.be.a('string')
              expect(res.body.product.amount).to.be.a('number')
              expect(res.body.product.price).to.be.a('number')
              expect(res.body.product.created_at).to.be.a('string')
              expect(res.body.product.expired_date).to.be.a('string')
              expect(res.body.product.pictureUrl).to.be.a('string')
              expect(res.body.product.name).to.be.equal('Browny Chocolate')
              expect(res.body.product.amount).to.be.equal(10)
              expect(res.body.product.price).to.be.equal(30000)
              expect(res.body.product.created_at).to.be.equal(new Date(created_at).toLocaleDateString('en-US', options))
              expect(res.body.product.expired_date).to.be.equal(new Date(expired_date).toLocaleDateString('en-US', options))
              expect(res.body.product.pictureUrl).to.be.equal(googlePictureUrl)
              done()
            })
        })
      })

    })

    ////////////////////////////////////////
    ////            Fail                ////
    ////////////////////////////////////////

    describe('Fail' , function() {
      describe('Read one product not found', function () {
        it.only('should return status code 404 response should be an objects', function (done) {
          chai
            .request(app)
            .get(`/products/111`)
            .end(function(err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(404);
              expect(res.body).to.have.be.an('object');
              expect(res.body).to.haveOwnProperty('message');
              expect(res.body.message).to.be.an('string');
              expect(res.body.message).to.be.equal('Product Not Found');
              done()
            })
        })
      })
    })

  })

  ////////////////////////////////////////
  ////            UPDATE              ////
  ////////////////////////////////////////

  describe('/UPDATE /products', function () {

    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {
      describe('Update a product', function () {
        it.only('should return status code 200 response should be an objects', function (done) {
          this.timeout(10000);
          chai
            .request(app)
            .put(`/products/${productId}`)
            .set('token', adminToken)
            .attach('image', '')
            .field(editableChocolate)
            .end(function(err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.have.be.an('object');
              expect(res.body).to.haveOwnProperty('message');
              expect(res.body).to.haveOwnProperty('product');
              expect(res.body.message).to.be.an('string');
              expect(res.body.message).to.be.equal('Product Milk Chocolate is updated');
              expect(res.body.product).to.be.an('object');
              expect(res.body.product).to.haveOwnProperty('name')
              expect(res.body.product).to.haveOwnProperty('amount')
              expect(res.body.product).to.haveOwnProperty('price')
              expect(res.body.product).to.haveOwnProperty('created_at')
              expect(res.body.product).to.haveOwnProperty('expired_date')
              expect(res.body.product).to.haveOwnProperty('pictureUrl')
              expect(res.body.product.name).to.be.a('string')
              expect(res.body.product.amount).to.be.a('number')
              expect(res.body.product.price).to.be.a('number')
              expect(res.body.product.created_at).to.be.a('string')
              expect(res.body.product.expired_date).to.be.a('string')
              expect(res.body.product.pictureUrl).to.be.a('string')
              expect(res.body.product.name).to.be.equal('Milk Chocolate')
              expect(res.body.product.amount).to.be.equal(3)
              expect(res.body.product.price).to.be.equal(40000)
              expect(res.body.product.created_at).to.be.equal(new Date(update_created_at).toLocaleDateString('en-US', options))
              expect(res.body.product.expired_date).to.be.equal(new Date(update_expired_date).toLocaleDateString('en-US', options))
              expect(res.body.product.pictureUrl).to.be.a('string')
              googlePictureUrl = res.body.product.pictureUrl
              done()
            })
        })

        it.only('should return status code 200 response should be an objects when update without changing image and same product', function (done) {
          this.timeout(10000);
          chai
            .request(app)
            .put(`/products/${productId}`)
            .set('token', adminToken)
            .attach('image', '')
            .field(editableChocolate)
            .end(function(err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.have.be.an('object');
              expect(res.body).to.haveOwnProperty('message');
              expect(res.body).to.haveOwnProperty('product');
              expect(res.body.message).to.be.an('string');
              expect(res.body.message).to.be.equal('Product Milk Chocolate is updated');
              expect(res.body.product).to.be.an('object');
              expect(res.body.product).to.haveOwnProperty('name')
              expect(res.body.product).to.haveOwnProperty('amount')
              expect(res.body.product).to.haveOwnProperty('price')
              expect(res.body.product).to.haveOwnProperty('created_at')
              expect(res.body.product).to.haveOwnProperty('expired_date')
              expect(res.body.product).to.haveOwnProperty('pictureUrl')
              expect(res.body.product.name).to.be.a('string')
              expect(res.body.product.amount).to.be.a('number')
              expect(res.body.product.price).to.be.a('number')
              expect(res.body.product.created_at).to.be.a('string')
              expect(res.body.product.expired_date).to.be.a('string')
              expect(res.body.product.pictureUrl).to.be.a('string')
              expect(res.body.product.name).to.be.equal('Milk Chocolate')
              expect(res.body.product.amount).to.be.equal(3)
              expect(res.body.product.price).to.be.equal(40000)
              expect(res.body.product.created_at).to.be.equal(new Date(update_created_at).toLocaleDateString('en-US', options))
              expect(res.body.product.expired_date).to.be.equal(new Date(update_expired_date).toLocaleDateString('en-US', options))
              expect(res.body.product.pictureUrl).to.be.a('string')
              expect(res.body.product.pictureUrl).to.be.equal(googlePictureUrl)
              done()
            })
        })
      })
    })

    ////////////////////////////////////////
    ////              Fail              ////
    ////////////////////////////////////////

    describe('Fail', function () {

      it.only('should return status code 404 if product item is wrong or invalid', function (done) {
        supertest(app)
          .put(`/products/111`)
          .set('token', adminToken)
          .attach('image', '')
          .field(defaultChocolate)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Product Not Found')
            done();
          })
      })

      it.only('should return status code 400 if the non-login user try to update product', function (done) {
        supertest(app)
          .put(`/products/${productId}`)
          .set('token', '')
          .attach('image', '')
          .field(defaultChocolate)
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

      it.only('should return status code 401 if the customer try to update product', function (done) {
        supertest(app)
          .put(`/products/${productId}`)
          .set('token', userToken)
          .attach('image', '')
          .field(defaultChocolate)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Not authorized')
            done();
          })
      })

      it.only('should return status code 400 if the field name is empty', function (done) {
        supertest(app)
          .put(`/products/${productId}`)
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: '',
            amount: 0,
            price: 0,
            created_at: '',
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Name field should be fill')
            done();
          })
      })

      it.only('should return status code 400 if amount less than 0', function (done) {
        supertest(app)
          .put(`/products/${productId}`)
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: -1,
            price: 0,
            created_at: '',
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Amount can\'t be less than 0')
            done();
          })
      })

      it.only('should return status code 400 if price field is less than 1000', function (done) {
        supertest(app)
          .put(`/products/${productId}`)
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: 1,
            price: 500,
            created_at: '',
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Minimum price is 1000')
            done();
          })
      })

      it.only('should return status code 400 if created_at field is empty', function (done) {
        supertest(app)
          .put(`/products/${productId}`)
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: 1,
            price: 1000,
            created_at: '',
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Invalid Date format')
            done();
          })
      })

      it.only('should return status code 400 if expired_date is empty', function (done) {
        supertest(app)
          .put(`/products/${productId}`)
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: 1,
            price: 1000,
            created_at: created_at.toString(),
            expired_date: ''
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Invalid Date format')
            done();
          })
      })

      it.only('should return status code 400 if expired_date < created_at', function (done) {
        supertest(app)
          .put(`/products/${productId}`)
          .set('token', adminToken)
          .attach('image', '')
          .field({
            name: 'Latte Chocolate',
            amount: 1,
            price: 1000,
            created_at: expired_date.toString(),
            expired_date: created_at.toString()
          })
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Cannot create expired product')
            done();
          })
      })

    })

  })

  ////////////////////////////////////////
  ////            DELETE              ////
  ////////////////////////////////////////

  describe('/DELETE /products', function () {

    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {
      it.only('should return status code 200 if admin delete the product', function (done) {
        supertest(app)
          .delete(`/products/${productId}`)
          .set('token', adminToken)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('product');
            expect(res.body.message).to.be.a('string');
            expect(res.body.product).to.be.a('object');
            expect(res.body.message).to.be.equal('Successfully delete Milk Chocolate');
            expect(res.body.product).to.haveOwnProperty('name')
            expect(res.body.product).to.haveOwnProperty('amount')
            expect(res.body.product).to.haveOwnProperty('price')
            expect(res.body.product).to.haveOwnProperty('created_at')
            expect(res.body.product).to.haveOwnProperty('expired_date')
            expect(res.body.product).to.haveOwnProperty('pictureUrl')
            expect(res.body.product.name).to.be.a('string')
            expect(res.body.product.amount).to.be.a('number')
            expect(res.body.product.price).to.be.a('number')
            expect(res.body.product.created_at).to.be.a('string')
            expect(res.body.product.expired_date).to.be.a('string')
            expect(res.body.product.pictureUrl).to.be.a('string')
            expect(res.body.product.name).to.be.equal('Milk Chocolate')
            expect(res.body.product.amount).to.be.equal(3)
            expect(res.body.product.price).to.be.equal(40000)
            expect(res.body.product.created_at).to.be.equal(new Date(update_created_at).toLocaleDateString('en-US', options))
            expect(res.body.product.expired_date).to.be.equal(new Date(update_expired_date).toLocaleDateString('en-US', options))
            expect(res.body.product.pictureUrl).to.be.a('string')
            expect(res.body.product.pictureUrl).to.be.equal(googlePictureUrl)
            done();
          })
      })
    })

    ////////////////////////////////////////
    ////             Fail               ////
    ////////////////////////////////////////
  
    describe('Fail', function () {

      it.only('should return status code 201 response should be an objects', function (done) {
        this.timeout(10000);
        supertest(app)
          .post('/products')
          .set('token', adminToken)
          .attach('image', './test/images/test.png')
          .field(defaultChocolate)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body).to.haveOwnProperty('details');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Product Browny Chocolate is added to the shop');
            expect(res.body.details).to.haveOwnProperty('name');
            expect(res.body.details).to.haveOwnProperty('amount');
            expect(res.body.details).to.haveOwnProperty('price');
            expect(res.body.details).to.haveOwnProperty('created_at');
            expect(res.body.details).to.haveOwnProperty('expired_date');
            expect(res.body.details).to.haveOwnProperty('pictureUrl');
            expect(res.body.details.name).to.be.a('string');
            expect(res.body.details.name).to.equal('Browny Chocolate');
            expect(res.body.details.amount).to.be.a('number');
            expect(res.body.details.amount).to.equal(10);
            expect(res.body.details.price).to.be.a('number');
            expect(res.body.details.price).to.equal(30000);
            expect(res.body.details.created_at).to.equal(new Date(created_at).toLocaleDateString('en-US', options));
            expect(res.body.details.expired_date).to.equal(new Date(expired_date).toLocaleDateString('en-US', options));
            expect(res.body.details.pictureUrl).to.be.a('string');
            googlePictureUrl = res.body.details.pictureUrl
            productId = res.body.details._id
            done();
          })
      })      
  
      it.only('should return status code 404 if product item is wrong or invalid', function (done) {
        supertest(app)
          .delete(`/products/111`)
          .set('token', adminToken)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Product Not Found')
            done();
          })
      })

      it.only('should return status code 400 if the non-login user try to delete product', function (done) {
        supertest(app)
          .delete(`/products/${productId}`)
          .set('token', '')
          .attach('image', '')
          .field(defaultChocolate)
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

      it.only('should return status code 401 if the customer try to delete product', function (done) {
        supertest(app)
          .delete(`/products/${productId}`)
          .set('token', userToken)
          .attach('image', '')
          .field(defaultChocolate)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.be.equal('Not authorized')
            done();
          })
      })
  
    })
  })


})
