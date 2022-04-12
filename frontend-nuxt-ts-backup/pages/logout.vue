<template>
  <div></div>
</template>

<script lang="ts">
import Cookies from "js-cookie";
import Vue from "vue";
export default Vue.extend({
  name: "LogoutPage",
  mounted() {
    this.$store.commit("auth/setRefreshToken", null);
    this.$store.commit("auth/setAuthToken", null);
    this.$store.commit("auth/setUserData", null);
    this.$store.commit("auth/setUserLoggedIn", false);

    Cookies.remove("refresh_token");
    Cookies.remove("auth_token");
    Cookies.remove("username");
    
    this.$router.push({ path: "/" + this.$i18n.locale + "/signin" });
  },
})
</script>
