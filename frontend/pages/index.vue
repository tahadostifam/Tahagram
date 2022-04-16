<template>
  <div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import jsCookie from "js-cookie"

export default Vue.extend({
  name: "IndexPage",
  mounted(){
    const authToken = jsCookie.get("auth_token")
    if (authToken && authToken.trim().length > 0) {
      this.$router.push({ path: '/' + (this as any).$i18n.locale + '/chat' });
    } else {
      this.$router.push({ path: '/' + (this as any).$i18n.locale + '/signin' });
    }
  }
})
</script>
