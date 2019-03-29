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
        <router-link v-if="isLogin" to="/transaction"> Transaction </router-link>
      </v-flex>
      <v-flex>
        <router-link v-if="isLogin" to="/cart"> Cart </router-link>
      </v-flex>
      <v-flex>
        <login-modal v-if="!isLogin"/>
      </v-flex>
      <v-flex>
        <register-modal v-if="!isLogin"/>
        <v-btn v-if="isLogin" color="primary" @click="logout">Log Out</v-btn>
      </v-flex>
    </v-toolbar>
    <v-flex>
      <div v-if="!transactions.length">
        No History of Transaction Yet
      </div>
      <div>
        <my-transactioncards
          v-for="transaction in transactions"
          :key="transaction._id"
          :transaction="transaction"
          @send="send($event)"
          @accept="accept($event)"/>
      </div>
    </v-flex>
  </div>
</template>

<script>

import MyToolbar from '@/components/MyToolbar.vue'
import MyTransactioncards from '@/components/MyTransactioncards.vue'
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
    CreateModal,
    MyTransactioncards
  },
  data () {
    return {
      role: localStorage.getItem('role'),
      transactions: []
    }
  },
  mounted () {
    serverAPI
      .get('/transactions', {
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .then(({ data }) => {
        this.transactions = data.transactions
      })
      .catch(({ resposne }) => {
        if (response.data) {
          SWAL('error', response.data.message)
        } else {
          console.log(response.data)
        }
      })
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
    accept(id) {
      serverAPI
        .put(`/transactions/${id}`, {
          status: 'accept'
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          SWAL('success', data.message)
          for(let i = 0; i < this.transactions.length; i++) {
            if(this.transactions[i]._id.toString() === id.toString()){
              console.log(this.transactions[i])
              this.transactions[i].status = 'accept'
              console.log(this.transactions[i])
              break;
            }
          }
        })
        .catch(({ response }) => {
          if (response.data) {
            SWAL('error', response.data.message)
          } else {
            console.log(response.data)
          }
        })
    },
    send(id) {
      serverAPI
        .put(`/transactions/${id}`, {
          status: 'send'
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          SWAL('success', data.message)
          for(let i = 0; i < this.transactions.length; i++) {
            if(this.transactions[i]._id.toString() === id.toString()){
              console.log(this.transactions[i])
              this.transactions[i].status = 'send'
              console.log(this.transactions[i])
              break;
            }
          }
        })
        .catch(({ response }) => {
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
