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
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "DefaultLayout",
  data() {
    return {
      theme_color: "green accent-4",
    };
  },
  async mounted() {
    this.$nextTick(function () {
      require("../assets/javascript/scripts");
    });

    const refresh_token = Cookies.get("refresh_token");
    const auth_token = Cookies.get("auth_token");
    const username = Cookies.get("username");

    if (refresh_token && auth_token && username) {
      this.$store.commit("auth/setRefreshToken", refresh_token);
      this.$store.commit("auth/setAuthToken", auth_token);
      this.$store.commit("auth/setUsername", username);
      this.$store.commit("auth/setUserLoggedIn", true);
      // Get user info | Auth
      await this.$store
        .dispatch("auth/Authenticate")
        .then(
          (user_data) => {
            console.log("logging in with saved tokens");

            this.$store.commit("auth/setUserData", user_data);
            this.$store.commit("auth/setChatsList", user_data.chats);

            this.$router.push({ path: "/" + this.$i18n.locale + "/chat" });
          },
          () => {
            console.log("login with saved tokens failed!");
          }
        )
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>
