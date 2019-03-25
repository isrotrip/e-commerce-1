<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      //
    }
  },
  created () {
    this.SET_GOOGLE()
  },
  mounted () {
    if (localStorage.getItem('token')) {
      this.verify()
    }
  },
  methods: {
    ...mapMutations([
      'SET_GOOGLE'
    ]),
    ...mapActions([
      'verify'
    ])
  }
}
</script>
