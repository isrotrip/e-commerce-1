require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const NODE_ENV = process.env.NODE_ENV;
const { authenticate } = require('./middlewares/verify')
const cors = require('cors');

mongoose.set('useFindAndModify', false);

mongoose.connect(`mongodb://localhost:27017/e-commerce${NODE_ENV}`, {useNewUrlParser: true});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const transactionsRouter = require('./routes/transactions');

const app = express();

app.use(cors());

if (process.env.NODE_ENV !== '_test') {
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use(authenticate);
app.use('/carts', cartsRouter);
app.use('/transactions', transactionsRouter);

module.exports = { app, mongoose };
