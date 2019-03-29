<template>
  <div>
    <v-card-title>
      <span class="headline">Register</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field label="Name*" required v-model="name"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Email*" type="email" required v-model="email"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Password*" type="password" required v-model="password"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Secret*" type="password" required v-model="secret"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>
    <center>
      <v-btn color="blue darken-1" flat @click="registerSetup">Register</v-btn>
    </center>
  </div>
</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      secret: ''
    }
  },
  computed: {
    ...mapState([
      'toggleRegisterForm'
    ])
  },
  watch: {
    toggleRegisterForm (val) {
      if (val) {
        this.clearForm()
        this.CLEAR_REGISTER_FORM(false)
      }
    }
  },
  methods: {
    ...mapActions([
      'register'
    ]),
    ...mapMutations([
      'CLEAR_REGISTER_FORM'
    ]),
    registerSetup () {
      this.register({
        name: this.name,
        email: this.email,
        password: this.password,
        loginVia: 'website',
        beAdmin: this.secret
      })
    },
    clearForm () {
      this.name = ''
      this.email = ''
      this.password = ''
      this.secret = ''
    }
  }
}
</script>
