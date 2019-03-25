<template>
  <div>
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
  components: {
    LoginModal,
    RegisterModal,
    CreateModal
  },
  data () {
    return {
      role: localStorage.getItem('role'),
      carts: []
    }
  },
  mounted () {
    console.log('masuk kesini')
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
