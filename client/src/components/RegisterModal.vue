<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Register</v-btn>
      </template>
      <v-card>
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
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="clearForm">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="registerSetup">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      dialog: false,
      name: '',
      email: '',
      password: ''
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
        dialog = false
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
        loginVia: 'website'
      })
    },
    clearForm () {
      this.dialog = false
      this.name = ''
      this.email = ''
      this.password = ''
    }
  }
}
</script>
