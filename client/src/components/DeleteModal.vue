<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="red" flat v-on="on">Delete a Product</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Delete a Product</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="Name*" type="email" required v-model="name" readonly></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Amount*" type="number" required v-model="amount" readonly></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Price*" type="number" required v-model="price" readonly></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Created at*" type="date" required v-model="created_at" readonly></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Expired at*" type="date" required v-model="expired_date" readonly></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="clearForm">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="deleteProduct">Delete</v-btn>
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
  props: ['product'],
  data () {
    return {
      dialog: false,
      name: '',
      amount: '',
      price: '',
      created_at: '',
      expired_date: '',
      pictureUrl: '',
      image: ''
    }
  },
  mounted () {
    this.name = this.product.name
    this.amount = this.product.amount
    this.price = this.product.price
    this.created_at = this.product.created_at
    this.expired_date = this.product.expired_date
    this.pictureUrl = this.product.pictureUrl
  },
  methods: {
    clearForm () {
      this.dialog = false
      this.name = ''
      this.amount = ''
      this.price = ''
      this.created_at = ''
      this.expired_date = ''
      this.pictureUrl = ''
      this.image = ''
    },
    deleteProduct () {
      serverAPI.delete(`/products/${this.product._id}`,
        {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          this.dialog = false
          SWAL('success', data.message)
          this.$emit('delete-product', data.product)
        }).catch((error) => {
          if (response.data) {
            SWAL('error', response.data.message)
          } else {
            console.log(response.data)
          }
        })
    },
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) { return }
      this.createImage(files[0])
      this.pictureUrl = e.target.files[0]
    },
    createImage (file) {
      var image = new Image()
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage: function (e) {
      this.image = ''
    }
  }
}
</script>
