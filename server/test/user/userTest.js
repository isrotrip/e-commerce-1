const { app } = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { userRegister, userLogin, adminRegister, adminLogin, googleTokenLogin } = require('../common');

require('dotenv').config();

chai.use(chaiHttp);

describe('ROUTE /users', function (done) {

  ////////////////////////////////////////
  ////            Register            ////
  ////////////////////////////////////////


  describe('/POST /users/register', function () {

    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {
      describe('Register as customer', function () {
        it.only('should return status code 201 response should be an objects', function (done) {
          chai
            .request(app)
            .post('/users/register')
            .send(userRegister)
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(201);
              expect(res.body).to.have.be.an('object');
              expect(res.body).to.haveOwnProperty('message');
              expect(res.body).to.haveOwnProperty('details');
              expect(res.body.message).to.be.a('string');
              expect(res.body.message).to.be.equal('Account with email isro@mail.com successfully registered');
              expect(res.body.details).to.haveOwnProperty('name');
              expect(res.body.details).to.haveOwnProperty('email');
              expect(res.body.details).to.haveOwnProperty('password');
              expect(res.body.details).to.haveOwnProperty('loginVia');
              expect(res.body.details).to.haveOwnProperty('role');
              expect(res.body.details.name).to.be.a('string');
              expect(res.body.details.email).to.be.a('string');
              expect(res.body.details.password).to.be.a('string');
              expect(res.body.details.loginVia).to.be.a('string');
              expect(res.body.details.role).to.be.a('string');
              expect(res.body.details.name).to.equal('isro');
              expect(res.body.details.password).to.not.equal('12345');
              expect(res.body.details.email).to.equal('isro@mail.com');
              expect(res.body.details.loginVia).to.equal('website');
              expect(res.body.details.role).to.equal('customer');
              done();
            })
        })
      })

      describe('Register as Admin', function () {
        it.only('should return status code 201 response should be an objects', function (done) {
          chai
            .request(app)
            .post('/users/register')
            .send(adminRegister)
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res).to.have.status(201);
              expect(res.body).to.have.be.an('object');
              expect(res.body).to.haveOwnProperty('message');
              expect(res.body).to.haveOwnProperty('details');
              expect(res.body.message).to.be.a('string');
              expect(res.body.message).to.be.equal('Account with email adip@mail.com successfully registered as admin');
              expect(res.body.details).to.haveOwnProperty('name');
              expect(res.body.details).to.haveOwnProperty('email');
              expect(res.body.details).to.haveOwnProperty('password');
              expect(res.body.details).to.haveOwnProperty('loginVia');
              expect(res.body.details).to.haveOwnProperty('role');
              expect(res.body.details.name).to.be.a('string');
              expect(res.body.details.email).to.be.a('string');
              expect(res.body.details.password).to.be.a('string');
              expect(res.body.details.loginVia).to.be.a('string');
              expect(res.body.details.role).to.be.a('string');
              expect(res.body.details.name).to.equal('adip');
              expect(res.body.details.password).to.not.equal('12345');
              expect(res.body.details.email).to.equal('adip@mail.com');
              expect(res.body.details.loginVia).to.equal('website');
              expect(res.body.details.role).to.equal('admin');
              done();
            })
        })
      })
    })

    ////////////////////////////////////////
    ////              Fail              ////
    ////////////////////////////////////////
  
    describe('Fail', function () {
      it.only('should return status code 400 if name field is not filled', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: '',
            email: '',
            password: '',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Name field should be fill')
            done();
          })
      })
  
      it.only('should return status code 400 if email field is not filled', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: 'a',
            email: '',
            password: '',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Email field should be fill')
            done();
          })
      })

      it.only('should return status code 400 if wrong email format', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: 'a',
            email: 'a',
            password: '',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Invalid email format');
            done();
          })
      })

      it.only('should return status code 400 if email is already on database', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: 'a',
            email: 'isro@mail.com',
            password: '',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Email has been taken');
            done();
          })
      })
  
      it.only('should return status code 400 if password field is not filled', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: 'a',
            email: 'a@a.a',
            password: '',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Password field should be fill')
            done();
          })
      })

      it.only('should return status code 400 if password length is less than 5', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: 'a',
            email: 'a@a.a',
            password: 'aaaa',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Min password length is 5')
            done();
          })
      })

      it.only('should return status code 400 if password length is greater than 10', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: 'a',
            email: 'a@a.a',
            password: 'aaaaaaaaaaaaaaaaaaaaaaaa',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Max password length is 10')
            done();
          })
      })
  
      it.only('should return status code 400 if loginVia field is not filled', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: 'a',
            email: 'a@a.a',
            password: 'aaaaa',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('loginVia field should be fill')
            done();
          })
      })

      it.only('should return status code 400 if loginVia field is not filled', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: 'a',
            email: 'a@a.a',
            password: 'aaaaa',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('loginVia field should be fill')
            done();
          })
      })

      it.only('should return status code 400 if loginVia options is wrong', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: 'a',
            email: 'a@a.a',
            password: 'aaaaa',
            loginVia: 'a'
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Invalid loginVia options');
            done();
          })
      })
  
      it.only('should return status code 400 response should be an objects', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            name: 'adi',
            email: 'adi@mail.com',
            password: '12345',
            loginVia: 'google',
            beAdmin: 'wrong'
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Not authorized to use this feature')
            done();
          })
      })
    })
  })

  ////////////////////////////////////////
  ////             Login              ////
  ////////////////////////////////////////

  describe('/POST users/login', function () {

    ////////////////////////////////////////
    ////            Success             ////
    ////////////////////////////////////////

    describe('Success', function () {

      describe('Login via website', function () {

        describe('Login as customer', function () {
          it.only('should return status code 200 response should be object', function (done) {
            chai
              .request(app)
              .post('/users/login')
              .send(userLogin)
              .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.be.an('object');
                expect(res.body).to.haveOwnProperty('message');
                expect(res.body).to.haveOwnProperty('token');
                expect(res.body).to.haveOwnProperty('userLogin');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.be.equal('Welcome isro');
                expect(res.body.token).to.be.a('string');
                expect(res.body.userLogin).to.be.an('object');
                expect(res.body.userLogin).to.haveOwnProperty('_id');
                expect(res.body.userLogin).to.haveOwnProperty('name');
                expect(res.body.userLogin).to.haveOwnProperty('email');
                expect(res.body.userLogin).to.not.haveOwnProperty('password');
                expect(res.body.userLogin).to.haveOwnProperty('loginVia');
                expect(res.body.userLogin).to.haveOwnProperty('role');
                expect(res.body.userLogin._id).to.be.a('String');
                expect(res.body.userLogin.name).to.be.a('String');
                expect(res.body.userLogin.email).to.be.a('String');
                expect(res.body.userLogin.name).to.equal('isro');
                expect(res.body.userLogin.email).to.equal('isro@mail.com');
                expect(res.body.userLogin.loginVia).to.equal('website');
                expect(res.body.userLogin.role).to.equal('customer');
                done();
              })
          })
        })
  
        describe('Login as admin', function () {
          it.only('should return status code 200 response should be object', function (done) {
            chai
              .request(app)
              .post('/users/login')
              .send(adminLogin)
              .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.be.an('object');
                expect(res.body).to.haveOwnProperty('message');
                expect(res.body).to.haveOwnProperty('token');
                expect(res.body).to.haveOwnProperty('userLogin');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.be.equal('Welcome Admin adip');
                expect(res.body.token).to.be.a('string');
                expect(res.body.userLogin).to.be.an('object');
                expect(res.body.userLogin).to.haveOwnProperty('_id');
                expect(res.body.userLogin).to.haveOwnProperty('name');
                expect(res.body.userLogin).to.haveOwnProperty('email');
                expect(res.body.userLogin).to.not.haveOwnProperty('password');
                expect(res.body.userLogin).to.haveOwnProperty('loginVia');
                expect(res.body.userLogin).to.haveOwnProperty('role');
                expect(res.body.userLogin._id).to.be.a('String');
                expect(res.body.userLogin.name).to.be.a('String');
                expect(res.body.userLogin.email).to.be.a('String');
                expect(res.body.userLogin.name).to.equal('adip');
                expect(res.body.userLogin.email).to.equal('adip@mail.com');
                expect(res.body.userLogin.loginVia).to.equal('website');
                expect(res.body.userLogin.role).to.equal('admin');
                done();
              })
          })
        })

      })

      describe('Login via google', function () {

        describe('Login as customer', function () {
          it.only('should return status code 201 if user haven\'t register with google and return objects', function (done) {
            this.timeout(10000);
            chai
              .request(app)
              .post('/users/login')
              .send({
                loginVia: 'google',
                google_token: googleTokenLogin
              })
              .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                expect(res.body).to.have.be.an('object');
                expect(res.body).to.haveOwnProperty('message');
                expect(res.body).to.haveOwnProperty('token');
                expect(res.body).to.haveOwnProperty('userLogin');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.be.equal('Welcome Hyper HD');
                expect(res.body.token).to.be.a('string');
                expect(res.body.userLogin).to.be.an('object');
                expect(res.body.userLogin).to.haveOwnProperty('_id');
                expect(res.body.userLogin).to.haveOwnProperty('name');
                expect(res.body.userLogin).to.haveOwnProperty('email');
                expect(res.body.userLogin).to.not.haveOwnProperty('password');
                expect(res.body.userLogin).to.haveOwnProperty('loginVia');
                expect(res.body.userLogin).to.haveOwnProperty('role');
                expect(res.body.userLogin._id).to.be.a('String');
                expect(res.body.userLogin.name).to.be.a('String');
                expect(res.body.userLogin.email).to.be.a('String');
                expect(res.body.userLogin.name).to.equal('Hyper HD');
                expect(res.body.userLogin.email).to.equal('isrotrip93@gmail.com');
                expect(res.body.userLogin.loginVia).to.equal('google');
                expect(res.body.userLogin.role).to.equal('customer');
                done();
              })
          })
        })

        describe('Login as customer', function () {
          it.only('should return status code 200 if user have register with google and return objects', function (done) {
            this.timeout(10000);
            chai
              .request(app)
              .post('/users/login')
              .send({
                loginVia: 'google',
                google_token: googleTokenLogin
              })
              .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.be.an('object');
                expect(res.body).to.haveOwnProperty('message');
                expect(res.body).to.haveOwnProperty('token');
                expect(res.body).to.haveOwnProperty('userLogin');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.be.equal('Welcome Hyper HD');
                expect(res.body.token).to.be.a('string');
                expect(res.body.userLogin).to.be.an('object');
                expect(res.body.userLogin).to.haveOwnProperty('_id');
                expect(res.body.userLogin).to.haveOwnProperty('name');
                expect(res.body.userLogin).to.haveOwnProperty('email');
                expect(res.body.userLogin).to.not.haveOwnProperty('password');
                expect(res.body.userLogin).to.haveOwnProperty('loginVia');
                expect(res.body.userLogin).to.haveOwnProperty('role');
                expect(res.body.userLogin._id).to.be.a('String');
                expect(res.body.userLogin.name).to.be.a('String');
                expect(res.body.userLogin.email).to.be.a('String');
                expect(res.body.userLogin.name).to.equal('Hyper HD');
                expect(res.body.userLogin.email).to.equal('isrotrip93@gmail.com');
                expect(res.body.userLogin.loginVia).to.equal('google');
                expect(res.body.userLogin.role).to.equal('customer');
                done();
              })
          })
        })

      })
      
    })

    describe('Fail', function () {

      ////////////////////////////////////////
      ////             Fail               ////
      ////////////////////////////////////////

      it.only('should return status code 400 when email field is empty', function (done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: '',
            password: '',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Email field should be fill');
            done();
          })
      })

      it.only('should return status code 400 when password field is empty', function (done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'a',
            password: '',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Password field should be fill');
            done();
          })
      })

      it.only('should return status code 400 when loginVia field is empty', function (done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'a',
            password: 'a',
            loginVia: ''
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Invalid loginVia');
            done();
          })
      })

      it.only('should return status code 400 when loginVia field is wrong', function (done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'a',
            password: 'a',
            loginVia: 'a'
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Invalid loginVia');
            done();
          })
      })

      it.only('should return status code 400 when wrong username/password', function (done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'a',
            password: 'a',
            loginVia: 'website'
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Wrong email/password');
            done();
          })
      })

      it.only('should return status code 400 response if loginVia is different from database loginVia', function (done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'isro@mail.com',
            password: '12345',
            loginVia: 'google'
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Please provide google token');
            done();
          })
      })

      it.only('should return status code 400 response if loginVia is different from database loginVia', function (done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'isrotrip93@gmail.com',
            password: 'google',
            loginVia: 'website'
          })
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.be.an('object');
            expect(res.body).to.haveOwnProperty('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('Please login via google');
            done();
          })
      })
    })
  })

})