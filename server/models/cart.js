const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  amount: {
    type: Number,
    min:[1, 'Minimum product in cart amount is 1']
  },
  productId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Please select a product'],
    ref: 'Product'
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;