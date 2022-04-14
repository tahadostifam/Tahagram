<template>
  <div>
    <h1>Hello World</h1>
    <v-btn color="primary">Push Me</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import jsCookie from "js-cookie"

export default Vue.extend({
  name: "IndexPage",
  created(){
    jsCookie
  }
})
</script>
