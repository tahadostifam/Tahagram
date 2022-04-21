<template>
  <div>
  </div>
</template>

<script>
import jsCookie from "js-cookie"

export default {
  name: "IndexPage",
  mounted(){
    const authToken = jsCookie.get("auth_token")
    if (authToken && authToken.trim().length > 0) {
      this.$router.push({ path: '/' + this.$i18n.locale + '/chat' });
    } else {
      this.$router.push({ path: '/' + this.$i18n.locale + '/signin' });
    }
  }
}
</script>