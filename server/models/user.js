const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hashPassword = require('../helpers/hashPassword');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name field should be fill']
  },
  email: {
    type: String,
    validate: [{
        validator(email) {
          const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
          return re.test(String(email).toLowerCase());
        }, message: 'Invalid email format',
      }, {
        validator(email) {
          return User
            .findOne({
              email: email
            })
            .then(user => {
              if(user && user._id.toString() !== this._id.toString()) {
                return false;
              } else {
                return true;
              }
            })
            .catch(error => {
              return error;
            })
        }, message: 'Email has been taken'
      }
    ],
    required: [true, 'Email field should be fill']
  },
  password: {
    type: String,
    minlength: [5, 'Min password length is 5'],
    maxlength: [10, 'Max password length is 10'],
    required: [true, 'Password field should be fill']
  },
  loginVia: {
    type: String,
    required: [true, 'loginVia field should be fill'],
    enum: {
      values: ['website', 'google'],
      message: 'Invalid loginVia options'
    }
  },
  role: {
    type: String,
    required: [true, 'Role field should be fill']
  }
})

userSchema.pre('save', function(next) {
  if(this.password.length > 4 && this.password.length < 10) {
    this.password = hashPassword(this.password);
    next();
  } else {
    next();
  }
})

const User = mongoose.model('User', userSchema);

module.exports = User;