<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Create a Product</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Create a Product</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Name*" type="email" required v-model="name"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Amount*" type="number" required v-model="amount"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Price*" type="number" required v-model="price"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Created at*" type="date" required v-model="created_at"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Expired at*" type="date" required v-model="expired_date"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div v-if="!image">
                  <input label="*" type="file" @change="onFileChange">
                </div>
                <div v-else>
                  <img :src="image" style="max-width:300px"/>
                  <button @click="removeImage">Remove image</button>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="clearForm">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="createProduct">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
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
    async createProduct () {
      await new Promise(resolve => {
        setTimeout(resolve, 500)
      })
      const fd = new FormData()
      fd.append('image', this.pictureUrl)
      fd.append('name', this.name)
      fd.append('amount', this.amount)
      fd.append('price', this.price)
      fd.append('created_at', this.created_at)
      fd.append('expired_date', this.expired_date)
      await serverAPI.post(`/products`,
        fd, {
          headers: {
            token: localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(({ data }) => {
          this.dialog = false
          SWAL('success', data.message)
          this.$emit('add-product', data.details)
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
