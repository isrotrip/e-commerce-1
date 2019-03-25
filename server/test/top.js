const { mongoose } = require('../app.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

function importTest(name, path) { 
  describe(name, function () {
    require(path);
  })
}

describe('Run All Test', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase();
    mongoose.disconnect();
    done();
  });
  importTest("User Test", './user/userTest');
  importTest("Product Test", './product/productTest');
  importTest("Cart Test", './cart/cartTest');
  importTest("Transaction Test", './transaction/transactionTest');
});