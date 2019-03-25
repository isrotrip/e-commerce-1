import axios from 'axios'

let serverAPI = axios.create({
  baseURL: 'http://localhost:3000'
})

export default serverAPI
