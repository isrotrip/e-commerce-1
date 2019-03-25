<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="red" flat v-on="on">Delete a Cart</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Delete a Cart</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="ID*" type="text" required v-model="id" readonly></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Name*" type="text" required v-model="name" readonly></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Amount*" type="number" required v-model="amount" readonly></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Price*" type="number" required v-model="price" readonly></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="clearForm">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="deleteCart">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import serverAPI from '@/api/serverAPI.js'
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

export default {
  props: ['cart'],
  data () {
    return {
      dialog: false,
      id: '',
      name: '',
      price: '',
      amount: ''
    }
  },
  mounted () {
    this.id = this.cart._id
    this.name = this.cart.product.name
    this.price = this.cart.product.price
    this.amount = this.cart.amount
  },
  methods: {
    clearForm () {
      this.dialog = false
      this.dialog = false
      this.id = ''
      this.name = ''
      this.price = ''
      this.amount = ''
    },
    deleteCart () {
      serverAPI.delete(`/carts/${this.cart._id}`,
        {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          this.dialog = false
          SWAL('success', data.message)
          this.$emit('delete-cart', data.cart._id)
        }).catch(({ resposne }) => {
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
