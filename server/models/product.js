const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name field should be fill'],
    validate: {
      validator(value) {
        return Product
          .findOne({
            name: value
          })
          .then(product => {
            if(product && product._id.toString() !== this._id.toString()) {
              return false
            } else {
              return true
            }
          })
      }, message: 'Products already on the list'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Amount field should be fill'],
    min: [0, 'Amount can\'t be less than 0']
  },
  price: {
    type: Number,
    required: [true, 'Price field should be fill'],
    min: [1000, 'Minimum price is 1000']
  },
  created_at: {
    type: Date,
    required: [true, 'Created date field should be fill']
  },
  expired_date: {
    type: Date,
    required: [true, 'Expired date field should be fill'],
    validate: {
      validator(value) {
        return this.expired_date > this.created_at
      }, message: 'Cannot create expired product'
    }
  },
  pictureUrl: {
    type: String,
    required: [true, 'Picture field should be fill']
  }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;