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
    <div>
      <!-- <my-cards/>        -->
    </div>
  </div>

</template>

<script>

import MyToolbar from '@/components/MyToolbar.vue'
import MyCards from '@/components/MyCards.vue'
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
      role: localStorage.getItem('role')
    }
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
    ])
  }
}
</script>
