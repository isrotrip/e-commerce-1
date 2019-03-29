<template>
  <v-card>
    <v-img
      :src="product.pictureUrl"
      style="max-width:100%"
    ></v-img>

    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ product.name }}</h3>
        <div> Amount: {{ product.amount }} </div>
        <div> Price: {{ product.price }} </div>
        <div> Created At: {{ product.created_at }} </div>
        <div> Expired Date: {{ product.expired_date }} </div>
        <div> Weight: 100g </div>
      </div>
    </v-card-title>

    <v-card-actions>
      <input type="number" placeholder="amount" v-model="amount">
      <v-btn flat color="orange" @click="addToCart(product._id)">Add To Cart</v-btn>
      <update-modal v-if="role === 'admin'"
        :product="product"
        @update-product="$emit('update-product', $event)"/>
      <delete-modal v-if="role === 'admin'"
        :product="product"
        @delete-product="$emit('delete-product', $event)"/>
    </v-card-actions>
  </v-card>
</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex'
import UpdateModal from '@/components/UpdateModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'
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
  props: ['product'],
  data () {
    return {
      role: localStorage.getItem('role'),
      amount: ''
    }
  },
  components: {
    UpdateModal,
    DeleteModal
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
    addToCart (id) {
      if(this.isLogin) {
        serverAPI
          .post('/carts', {
            productId: id,
            amount: this.amount
          }, {
            headers: {
              token: localStorage.getItem('token')
            }
          })
          .then(({ data }) => {
            SWAL('success', data.message)
            this.amount = ''
          })
          .catch(({ response }) => {
            if (response.data) {
              SWAL('error', response.data.message)
            } else {
              console.log(response.data)
            }
          })
      } else {
        SWAL('error', 'Please login to continue')
      }
    } 
  }
}
</script>
