require('dotenv').config();
let axios = require('axios');

let rajaOngkirApi = axios.create({
  baseURL: `https://api.rajaongkir.com/starter`,
  headers: {
    key: process.env.RAJAONGKIR_KEY
  }
})

module.exports = rajaOngkirApi