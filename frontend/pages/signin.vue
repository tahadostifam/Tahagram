<template>
  <div>
    <div class="form_top_overlay">
      <h1>ChatApp</h1>
      <h2>
        Developed By
        <a href="https://github.com/tahadostifam/ChatApp">TahaDostifam</a> &
        AhmadKharazi
      </h2>
    </div>
    <div class="form rounded-sm grey darken-4 pa-5 elevation-3">
      <h2 class="mb-3">Signin</h2>
      <v-text-field
        type="text"
        label="Username"
        outlined
        filled
        dense
        :color="theme_color"
        v-model="username"
      ></v-text-field>

      <v-text-field
        type="password"
        label="Password"
        outlined
        filled
        dense
        v-model="password"
        :color="theme_color"
      ></v-text-field>

      <v-checkbox
        class="ma-0 pa-0"
        label="Remember me"
        :color="theme_color"
        v-model="remember_me"
      ></v-checkbox>

      <div v-if="form_errors" class="form_errors">
        <p v-for="(item, index) in form_errors" :key="index" class="item">
          {{ item }}
        </p>
      </div>

      <v-btn @click="submit" :color="theme_color" depressed class="mt-3"
        >Submit</v-btn
      >
    </div>
  </div>
</template>

<script>
import configs from "@/assets/javascript/configs";

export default {
  name: "signin",
  data() {
    return {
      theme_color: configs.theme_color,
      username: "",
      password: "",
      remember_me: true,
      form_errors: [],
    };
  },
  methods: {
    submit() {
      this.$axios
        .$post(
          "/users/signin",
          {
            username: this.$data.username,
            password: this.$data.password,
          },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          }
        )
        .then((response) => {
          if (response.message == "success") {
            // ANCHOR
            this.$store.commit(
              "auth/setRefreshToken",
              response.tokens.refresh_token
            );
            this.$store.commit("auth/setAuthToken", response.tokens.auth_token);
            this.$store.commit("auth/setUserData", response.data);
            this.$store.commit("auth/setUserLoggedIn", true);

            this.$router.push({ path: "/chat" });
          } else {
            this.$set(this.$data, "form_errors", [
              "An error occurred on the client side. please try again",
            ]);
          }
        })
        .catch((error) => {
          if (error.response.data) {
            if (
              error.response.data.message == "username or password is incorrect"
            ) {
              this.$set(this.$data, "form_errors", [
                "Username or password is incorrect",
              ]);
            } else if (error.response.status == 400) {
              this.$set(this.$data, "form_errors", [
                "Required parameters can't be are empty",
              ]);
            } else if (error.response.status == 500) {
              this.$set(this.$data, "form_errors", [
                "An error occurred on the client side. please try again",
              ]);
            }
          } else {
            this.$set(this.$data, "form_errors", [
              "An error occurred on the client side. please try again",
            ]);
          }
        });
    },
  },
};
</script>
