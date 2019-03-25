require('dotenv').config();

let userRegister = {
  name: 'isro',
  email: 'isro@mail.com',
  password: '12345',
  loginVia: 'website'
}

let adminRegister = {
  name: 'adip',
  email: 'adip@mail.com',
  password: '12345',
  loginVia: 'website',
  beAdmin: process.env.BE_ADMIN
}

let userLogin = {
  email: 'isro@mail.com',
  password: '12345',
  loginVia: 'website'
}

let adminLogin = {
  email: 'adip@mail.com',
  password: '12345',
  loginVia: 'website'
}

let googleTokenLogin = process.env.GOOGLE_TOKEN_TEST

let created_at = new Date;
let expired_date = new Date
expired_date.setDate(expired_date.getDate() + 10);

let update_created_at = new Date;
let update_expired_date = new Date;
update_created_at.setDate(update_created_at.getDate() + 10);
update_expired_date.setDate(update_expired_date.getDate() + 20);

let defaultChocolate = {
  name: 'Browny Chocolate',
  amount: 10,
  price: 30000,
  created_at: created_at.toString(),
  expired_date: expired_date.toString()
}

let editableChocolate = {
  name: 'Milk Chocolate',
  amount: 3,
  price: 40000,
  created_at: update_created_at.toString(),
  expired_date: update_expired_date.toString()
}

module.exports = { userRegister, userLogin, adminRegister, adminLogin, googleTokenLogin, defaultChocolate, editableChocolate }
