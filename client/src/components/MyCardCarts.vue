<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ cart._id }}</h3>
        <div>Product: {{ cart.product.name }}</div>
        <div>Amount: {{ cart.amount }}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <button flat @click="addToTransaction">Add To Transaction</button>
      <update-cartmodal
        :cart="cart"
        @update-cart="$emit('update-cart', $event)"/>
      <delete-cartmodal
        :cart="cart"
        @delete-cart="$emit('delete-cart', $event)"/>
    </v-card-actions>
  </v-card>
</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex'
import serverAPI from '@/api/serverAPI'
import UpdateCartmodal from '@/components/UpdateCartModal.vue'
import DeleteCartmodal from '@/components/DeleteCartModal.vue'

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
  props: ['cart', 'city', 'province'],
  data () {
    return {
      role: localStorage.getItem('role'),
      amount: ''
    }
  },
  components: {
    UpdateCartmodal,
    DeleteCartmodal
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
    addToTransaction () {
      this.$emit('selected-change', this.cart._id)
      this.$router.push(`/cart/${this.cart._id}`)
    }
  }
}
</script>
