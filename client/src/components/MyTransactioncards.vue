<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ transaction._id }}</h3>
        <div>User ID: {{ transaction.userId }}</div>
        <div v-if="transaction.adminId">Admin ID: {{ transaction.adminId }}</div>
        <div>Product: {{ transaction.product.name }}</div>
        <div>Amount: {{ transaction.amount }}</div>
        <div>TotalPrice: {{ transaction.totalPrice }}</div>
        <div>Status: {{ transaction.status }}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <button
        v-if="role === 'admin' && transaction.status === 'pending'"
        @click="$emit('send', transaction._id)">
        Send
      </button>
      <button
        v-if="transaction.status === 'send' && canAccept"
        @click="$emit('accept', transaction._id)">
        Accept
      </button>
    </v-card-actions>
  </v-card>
</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex'
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
  props: ['transaction'],
  data () {
    return {
      role: localStorage.getItem('role'),
      amount: ''
    }
  },
  computed: {
    ...mapState([
      'isLogin'
    ]),
    canAccept() {
      return localStorage.getItem('_id').toString() === this.transaction.userId.toString()
    }
  },
  watch: {
    isLogin (val) {
      if (val) {
        this.role = localStorage.getItem('role')
      } else {
        this.role = ''
      }
    }
  }
}
</script>
