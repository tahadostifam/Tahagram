<template>
  <div></div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  mounted() {
    this.$store.commit("auth/setRefreshToken", null);
    this.$store.commit("auth/setAuthToken", null);
    this.$store.commit("auth/setUserData", null);
    this.$store.commit("auth/setUserLoggedIn", false);

    Cookies.remove("refresh_token");
    Cookies.remove("auth_token");
    Cookies.remove("username");

    this.$router.push({ path: "/signin" });
  },
};
</script>
