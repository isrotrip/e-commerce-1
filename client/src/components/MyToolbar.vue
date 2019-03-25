<template>
  <v-toolbar>
    <v-layout align-center justify-space-around row fill-height/>
    <v-flex xs6 sm6 md8>
      <v-toolbar-title class="headline text-uppercase">
        <span>ISRO</span>
        <span class="font-weight-light">PEDIA</span>
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
      <create-modal
        v-if="role === 'admin'"
        @add-product="$emit('add-product', $event)"/>
    </v-flex>
    <v-flex>
      <register-modal v-if="!isLogin"/>
      <v-btn v-if="isLogin" color="primary" @click="logout">Log Out</v-btn>
    </v-flex>
  </v-toolbar>
</template>

<script>

import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'
import CreateModal from '@/components/CreateModal.vue'
import { mapState, mapMutations, mapActions } from 'vuex'

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
