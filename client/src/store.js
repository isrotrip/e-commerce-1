import Vue from 'vue'
import Vuex from 'vuex'
import serverAPI from '@/api/serverAPI'
import router from './router'
import Swal from 'sweetalert2'

function SWAL (type, title) {
  Swal.fire({
    position: 'top-end',
    type: type,
    title: title,
    showConfirmButton: false,
    timer: 1500
  })
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    auth2: null,
    toggleRegisterForm: false
  },
  mutations: {
    SET_LOGOUT (state) {
      state.isLogin = false
    },
    SET_LOGIN (state) {
      state.isLogin = true
    },
    SET_GOOGLE (state) {
      gapi.load('auth2', function () {
        state.auth2 = gapi.auth2.init({
          client_id: '612778850243-dg97rokia8qgd1ej1eat5slslfe1a6qb.apps.googleusercontent.com'
        })
      })
    },
    CLEAR_REGISTER_FORM (state, payload) {
      state.toggleRegisterForm = payload
    }
  },
  actions: {
    verify ({ commit, dispatch }) {
      serverAPI
        .get('/users/verify', {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          if (data.userLogin) {
            SWAL('success', data.message)
            localStorage.setItem('name', data.userLogin.name)
            localStorage.setItem('email', data.userLogin.email)
            localStorage.setItem('role', data.userLogin.role)
            localStorage.setItem('_id', data.userLogin._id)
            localStorage.setItem('loginVia', data.userLogin.loginVia)
            localStorage.setItem('token', data.token)
            commit('SET_LOGIN')
          } else {
            localStorage.clear()
            dispatch('logout')
          }
        })
        .catch(({ response }) => {
          if (response.data) {
            SWAL('error', response.data.message)
          } else {
            console.log(response.data)
          }
        })
    },
    logout ({ state, commit }) {
      state.auth2.signOut().then(() => {
        let name = localStorage.getItem('name')
        localStorage.clear()
        SWAL('success', `Have a nice day ${name}`)
        commit('SET_LOGOUT')
        router.push('/')
      })
    },
    login ({ commit }, payload) {
      serverAPI
        .post('/users/login', payload)
        .then(({ data }) => {
          SWAL('success', data.message)
          localStorage.setItem('name', data.userLogin.name)
          localStorage.setItem('email', data.userLogin.email)
          localStorage.setItem('role', data.userLogin.role)
          localStorage.setItem('_id', data.userLogin._id)
          localStorage.setItem('loginVia', data.userLogin.loginVia)
          localStorage.setItem('token', data.token)
          commit('SET_LOGIN')
        })
        .catch(({ response }) => {
          if (response.data) {
            SWAL('error', response.data.message)
          } else {
            console.log(response.data)
          }
        })
    },
    register ({ commit }, payload) {
      serverAPI
        .post('/users/register', payload)
        .then(({ data }) => {
          SWAL('success', data.message)
          commit('CLEAR_REGISTER_FORM', true)
        })
        .catch(({ response }) => {
          if (response.data) {
            SWAL('error', response.data.message)
          } else {
            console.log(response.data)
          }
        })
    }
  }
})
