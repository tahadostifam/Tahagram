<template>
  <v-app dark>
    <v-main>
      <div class="splash_screen fixed" id="full_splash_screen">
        <div class="center">
        <v-progress-circular
            class="mb-2 d-block"
            indeterminate
            :color="theme_color"
        ></v-progress-circular>
        </div>
      </div>
      <Nuxt/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      theme_color: 'green accent-4'
    }
  },
  mounted: function(){
    this.$nextTick(function () {
      require('../assets/javascript/scripts')
    })
  }
}
</script>
