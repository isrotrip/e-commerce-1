import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
    },
    {
      path: '/iWantToBeAdmin',
      name: 'secret',
      component: () => import(/* webpackChunkName: "home" */ './views/Secret.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import(/* webpackChunkName: "cart" */ './views/Cart.vue'),
      children: [{
        path: 'rajaOngkir/:id',
        componentcomponent: () => import(/* webpackChunkName: "rajaOngkir" */ './views/RajaOngkir.vue')
      }]
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: () => import(/* webpackChunkName: "transaction" */ './views/Transaction.vue')
    }
  ]
})
