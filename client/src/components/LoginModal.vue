<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Login</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Login</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
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
        <hr style="max-width: 60%; margin: auto">
        <center>
          <br>
          Or Login Via
          <div id="my-signin2"></div>
          <br>
        </center>
        <hr style="max-width: 60%; margin: auto">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="clearForm">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="loginSetup">Log In</v-btn>
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
      email: '',
      password: ''
    }
  },
  mounted () {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this.onSuccess
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
        dialog = false
      } else {
        this.clearForm()
      }
    }
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    onSuccess (googleUser) {
      const id_token = googleUser.getAuthResponse().id_token
      this.login({
        loginVia: 'google',
        google_token: id_token
      })
    },
    loginSetup () {
      this.login({
        loginVia: 'website',
        email: this.email,
        password: this.password
      })
    },
    clearForm () {
      this.dialog = false
      this.email = ''
      this.password = ''
    }
  }
}
</script>
