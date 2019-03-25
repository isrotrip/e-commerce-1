require('dotenv').config();
const User = require('../models/user');
const hashPassword = require('../helpers/hashPassword');
const jwtConvert = require('../helpers/jwtConvert');
const googleDecoder = require('../helpers/googleDecoder');

class UserController {
  static login(req, res) {
    if(!req.body.email && req.body.loginVia !== 'google') {
      res.status(400).json({
        message: 'Email field should be fill'
      })
    } else if(!req.body.password && req.body.loginVia !== 'google') {
      res.status(400).json({
        message: 'Password field should be fill'
      })
    } else { 
      if(req.body.loginVia === 'website') {
        User
          .findOne({
            email: req.body.email,
            password: hashPassword(req.body.password)
          })
          .then(user => {
            if(user) {
              if(user.loginVia === req.body.loginVia) {
                let userLogin = {
                  _id: user.id,
                  name: user.name,
                  email: user.email,
                  loginVia: user.loginVia,
                  role: user.role
                }
                let token = jwtConvert.sign(userLogin);
                let successMessage = {
                  token: token,
                  userLogin: userLogin
                }
                if(user.role === 'admin') {
                  successMessage.message = `Welcome Admin ${user.name}`
                } else {
                  successMessage.message = `Welcome ${user.name}`
                }
                res.status(200).json(successMessage);
              } else {
                res.status(400).json({
                  message: `Please login via ${user.loginVia}`
                })
              }
            } else {
              res.status(400).json({
                message: 'Wrong email/password'
              })
            }
          })
      } else if (req.body.loginVia === 'google') {
        if(req.body.google_token) {
          let asyncDecode = googleDecoder(req.body.google_token);
          asyncDecode
            .then(userInfo => {
              User
                .findOne({
                  email: userInfo.email
                })
                .then(user => {
                  if(user) {
                    if(user.loginVia === req.body.loginVia) {
                      let userLogin = {
                        _id: user.id,
                        name: user.name,
                        email: user.email,
                        loginVia: user.loginVia,
                        role: user.role
                      }
                      let token = jwtConvert.sign(userLogin);
                      let successMessage = {
                        token: token,
                        userLogin: userLogin,
                        message: `Welcome ${user.name}`
                      }
                      res.status(200).json(successMessage);
                    } else {
                      res.status(400).json({
                        message: `Please loginVia via ${user.loginVia}`
                      })
                    }
                  } else {
                    return User
                      .create({
                        name: userInfo.name,
                        email: userInfo.email,
                        password: process.env.DUMMY_GOOGLE_PASSWORD,
                        loginVia: 'google',
                        role: 'customer'
                      })
                      .then(user => {
                        let userLogin = {
                          _id: user.id,
                          name: user.name,
                          email: user.email,
                          loginVia: user.loginVia,
                          role: user.role
                        }
                        let token = jwtConvert.sign(userLogin);
                        let successMessage = {
                          token: token,
                          userLogin: userLogin,
                          message: `Welcome ${user.name}`
                        }
                        res.status(201).json(successMessage);
                      })
                  }
                })
            })
            .catch(error => {
              res.status(500).json({
                message: 'Internal server error'
              })
            })
        } else {
          res.status(400).json({
            message: 'Please provide google token'
          })
        }
      } else {
        res.status(400).json({
          message: 'Invalid loginVia'
        })
      }
    }
  }

  static register(req, res) {
    if(req.body.beAdmin && req.body.beAdmin !== process.env.BE_ADMIN) {
      res.status(401).json({
        message: 'Not authorized to use this feature'
      })
    } else {
      if(req.body.beAdmin === process.env.BE_ADMIN) {
        req.body.role = 'admin'
      } else {
        req.body.role = 'customer'
      }
      User
        .create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          loginVia: req.body.loginVia,
          role: req.body.role
        })
        .then(user => {
          let successMessage = {
            details: {
              name: user.name,
              email: user.email,
              password: user.password,
              loginVia: user.loginVia,
              role: user.role
            }
          }
          if(user.role === 'admin') {
            successMessage.message = `Account with email ${user.email} successfully registered as admin`;
          } else {
            successMessage.message = `Account with email ${user.email} successfully registered`;
          }
          res.status(201).json(successMessage);
        })
        .catch(error => {
          if(error.errors.name) {
            res.status(400).json({
              message: error.errors.name.message
            })
          } else if(error.errors.email) {
            res.status(400).json({
              message: error.errors.email.message
            })
          } else if(error.errors.password) {
            res.status(400).json({
              message: error.errors.password.message
            })
          } else if(error.errors.loginVia) {
            res.status(400).json({
              message: error.errors.loginVia.message
            })
          } else {
            res.status(500).json({
              message: 'Internal Server Error'
            })
          }
        })
    }
  }

  static verify(req, res) {
    let successMessage = {
      message: `Welcome back ${req.userLogin.name}`,
      userLogin: req.userLogin,
      token: req.headers.token
    }
    res.status(200).json(successMessage)
  }

}

module.exports = UserController;