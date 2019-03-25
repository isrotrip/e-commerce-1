<template>

  <div>

    <v-toolbar style="margin-bottom: 10px">
      <v-layout align-center justify-space-around row fill-height/>
      <v-flex xs6 sm6 md8>
        <v-toolbar-title class="headline text-uppercase">
          <router-link to="/">
          <span>ISRO</span>
          <span class="font-weight-light">PEDIA</span>
          </router-link>
        </v-toolbar-title>
      </v-flex>
      <v-flex>
        <router-link v-if="isLogin" to="transaction"> Transaction </router-link>
      </v-flex>
      <v-flex>
        <router-link v-if="isLogin" to="cart"> Cart </router-link>
      </v-flex>
      <v-flex>
        <login-modal v-if="!isLogin"/>
      </v-flex>
      <v-flex>
        <register-modal v-if="!isLogin"/>
        <v-btn v-if="isLogin" color="primary" @click="logout">Log Out</v-btn>
      </v-flex>
    </v-toolbar>
    <v-flex>
      <div>
        <my-cardcarts
          v-for="cart in carts"
          :key="cart._id"
          :cart="cart"
          :dataOngkir="dataOngkir"
          :city="city"
          :province="province"
          @delete-cart="deleteCart($event)"
          @update-cart="updateCart($event)"/>
      </div>
    </v-flex>
  </div>
</template>

<script>

import MyToolbar from '@/components/MyToolbar.vue'
import MyCardcarts from '@/components/MyCardCarts.vue'
import serverAPI from '@/api/serverAPI'

import Swal from 'sweetalert2'

import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'
import CreateModal from '@/components/CreateModal.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
function SWAL (type, title) {
  Swal.fire({
    position: 'top-end',
    type: type,
    title: title,
    showConfirmButton: false,
    timer: 1500
  })
}

export default {
  components: {
    LoginModal,
    RegisterModal,
    CreateModal,
    MyCardcarts
  },
  data () {
    return {
      role: localStorage.getItem('role'),
      carts: [],
      dataOngkir: [],
      city: [],
      province: []
    }
  },
  mounted () {
    serverAPI
      .get('/carts', {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .then(({ data }) => {
        this.carts = data.carts
        return serverAPI
          .get('/transactions/rajaOngkir', {
            headers: {
              token: localStorage.getItem('token')
            }
          })
      })
      .then(({ data }) => {
        this.dataOngkir = data.dataOngkir
        this.city = this.dataOngkir.city.map(city => city.name)
        this.province = this.dataOngkir.province.map(province => province.name)
      })
      .catch(({ resposne }) => {
        if (response.data) {
          SWAL('error', response.data.message)
        } else {
          console.log(response.data)
        }
      })
  },
  computed: {
    ...mapState([
      'isLogin'
    ])
  },
  watch: {
    isLogin (val) {
      if (val) {
        this.role = localStorage.getItem('role')
      } else {
        this.role = ''
      }
    }
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    deleteCart (id) {
      console.log(id)
      this.carts = this.carts.filter(cart => cart._id.toString() !== id.toString())
    },
    updateCart (updatedCart) {
      this.carts = this.carts.filter(cart => cart._id.toString() !== updatedCart._id.toString())
      this.carts.push(updatedCart)
    }
  }
}
</script>
