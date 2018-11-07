<template>
  <v-app>
    <v-content>
      <Output/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import Input from './components/Input'
import Output from './components/Output'

export default {
  name: 'App',
  components: {
    HelloWorld, 
    Input,
    Output
  },
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>
