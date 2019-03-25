const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  product: Object,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  itemPrice: {
    type: Number
  },
  deliverPrice: {
    type: Number
  },
  totalPrice: {
    type: Number
  },
  amount: {
    type: Number
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'send', 'accept'],
      message: 'Wrong Input Data'
    }
  }
})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;