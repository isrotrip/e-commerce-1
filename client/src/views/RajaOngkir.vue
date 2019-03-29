<template>
  <div>
    <v-layout row wrap align-center>
      <v-flex xs12>
        <p>Cart Id: {{ cart._id }} </p>
        <p>Product Name: {{ cart.product.name }}</p>
        <p>Amount: {{ cart.amount }} </p>
        <p>Total Product Price: {{ cart.amount*cart.product.price }} </p>
      </v-flex>
      <v-flex xs6>
        <v-subheader>Prepended icon</v-subheader>
      </v-flex>
      <v-flex xs6>
        <v-select
          v-model="origin"
          :items="states"
          menu-props="auto"
          label="Select"
          hide-details
          prepend-icon="map"
          single-line
        ></v-select>
      </v-flex>
      <v-flex xs6>
        <v-subheader>Appended icon</v-subheader>
      </v-flex>
      <v-flex xs6>
        <v-select
          v-model="destination"
          :items="states"
          append-outer-icon="map"
          menu-props="auto"
          hide-details
          label="Select"
          single-line
        ></v-select>
      </v-flex>
      <v-layout row wrap align-center>
      <v-flex xs6>
        <v-subheader>Select Courier</v-subheader>
      </v-flex>
      <v-flex xs6>
        <v-select
          v-model="selectCourier"
          :items="couriers"
          item-text="state"
          item-value="abbr"
          label="Select"
          persistent-hint
          return-object
          single-line
        ></v-select>
      </v-flex>
      <v-flex xs12>
        <center>
          <button @click="showPrice">Show Price</button>
        </center>
      </v-flex>
      <v-flex xs12 v-if="transportPrice">
        <p>Transport Price: {{transportPrice}}</p>
        <p>Total Price: {{totalPrice}}</p>
      </v-flex>
      <v-flex xs12 v-if="transportPrice">
        <center>
          <button @click="makeTransactions">Make Transactions</button>
        </center>
      </v-flex>
    </v-layout>
    </v-layout>
  </div>
</template>

<script>

import MyToolbar from '@/components/MyToolbar.vue'
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
  props: ['selected'],
  components: {
    LoginModal,
    RegisterModal,
    CreateModal
  },
  data () {
    return {
      role: localStorage.getItem('role'),
      dataOngkir: [],
      states: [],
      couriers: ['tiki', 'jne', 'pos'],
      origin: '',
      destination: '',
      selectCourier: '',
      city: [],
      cart: {
        product: {}
      },
      transportPrice: 0
    }
  },
  computed: {
    ...mapState([
      'isLogin'
    ]),
    totalPrice() {
      return this.transportPrice + this.cart.amount*this.cart.product.price
    }
  },
  mounted() {
    serverAPI
      .get(`/carts/${this.$route.params.id}`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .then(({ data }) => {
        this.cart = data.cart
        return serverAPI
          .get('/transactions/rajaOngkir', {
            headers: {
              token: localStorage.getItem('token')
            }
          }) 
      })
      .then(({ data }) => {
        this.dataOngkir = data.dataOngkir
        this.city = this.dataOngkir.city
        this.states = this.city.map(city => city.name)
      })
      .catch(({ resposne }) => {
        if (response.data) {
          SWAL('error', response.data.message)
        } else {
          console.log(response.data)
        }
      })
  },
  watch: {
    isLogin (val) {
      if (val) {
        this.role = localStorage.getItem('role')
      } else {
        this.role = ''
      }
    },
    selected (val) {
      this.getCart()
    }
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    showPrice(){
      serverAPI
        .post('/transactions/rajaOngkir',{
          origin: this.states.indexOf(this.origin).toString(),
          destination: this.states.indexOf(this.destination).toString(),
          courier: this.selectCourier,
          weight: this.cart.amount * 100,
          cartId: this.cart._id
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          this.transportPrice = data.info[0].costs[0].cost[0].value
        })
        .catch(({ resposne }) => {
          if (response.data) {
            SWAL('error', response.data.message)
          } else {
            console.log(response.data)
          }
        })
    },
    getCart(){
      serverAPI
        .get(`/carts/${this.$route.params.id}`, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          this.cart = data.cart
        })
        .catch(({ resposne }) => {
          if (response.data) {
            SWAL('error', response.data.message)
          } else {
            console.log(response.data)
          }
        })
    },
    makeTransactions(){
      serverAPI
        .post('/transactions', {
          productPrice: this.cart.amount*this.cart.product.price,
          totalPrice: this.totalPrice,
          deliverPrice: this.transportPrice,
          cartId: this.cart._id
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          SWAL('success', data.message)
          this.$emit('add-transactions', this.cart._id)
          this.cart = {
            product: {}
          }
          this.transportPrice = 0
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
}
</script>
