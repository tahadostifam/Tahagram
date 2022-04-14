<template>
  <div>
    <h1>Hello World</h1>
    <v-btn color="$configs.primary" @click="sayHello">Push Me</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: "IndexPage",
  methods: {
    alertMe(){
      alert("Hello World")
    },
    sayHello(){
      this.alertMe()
    },
  }
})
</script>
