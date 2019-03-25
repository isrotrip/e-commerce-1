<template>

  <div>
    <my-toolbar
      @add-product="addProduct($event)"
      style="margin-bottom: 10px"/>
    <div v-if="products.length > 0">
        <my-cards
        v-for="product in products"
        :key="product._id"
        :product="product"
        @update-product="updateProduct($event)"
        @delete-product="deleteProduct($event)"/>
    </div>
  </div>

</template>

<script>

import MyToolbar from '@/components/MyToolbar.vue'
import MyCards from '@/components/MyCards.vue'
import serverAPI from '@/api/serverAPI'

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
  components: {
    MyToolbar,
    MyCards
  },
  data () {
    return {
      products: []
    }
  },
  created () {
    serverAPI
      .get('/products')
      .then(({ data }) => {
        this.products = data.products
      })
      .catch(({ response }) => {
        if (response.data) {
          SWAL('error', response.data.message)
        } else {
          console.log(response.data)
        }
      })
  },
  methods: {
    addProduct (product) {
      this.products.push(product)
    },
    deleteProduct (deletedProduct) {
      this.products = this.products.filter(product => product._id.toString() !== deletedProduct._id.toString())
    },
    updateProduct (updateProduct) {
      this.products = this.products.filter(product => product._id.toString() !== updateProduct._id.toString())
      this.products.push(updateProduct)
    }
  }
}
</script>
