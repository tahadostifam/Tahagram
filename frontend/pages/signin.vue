<template>
  <div>
    <FormTopOverlay />

    <div class="form rounded-sm grey darken-4 pa-5 elevation-3">
      <h2 h2 class="mb-3">Signin</h2>
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

      <div v-if="form_errors" class="form_errors mb-3">
        <p v-for="(item, index) in form_errors" :key="index" class="item">
          {{ item }}
        </p>
      </div>

      <v-btn
        @click="submit"
        :loading="submit_button_loading_state"
        :color="theme_color"
        depressed
        >Submit</v-btn
      >
      <div class="sepa mt-4"></div>
      <NuxtLink to="/signup" class="w-100 d-block mt-3">Signup</NuxtLink>
    </div>
  </div>
</template>

<script>
import configs from "@/assets/javascript/configs";
import Cookies from "js-cookie";

export default {
  name: "signin",
  data() {
    return {
      theme_color: configs.theme_color,
      username: "",
      password: "",
      remember_me: true,
      form_errors: [],
      submit_button_loading_state: false,
    };
  },
  methods: {
    inputs_are_valid() {
      if (this.$data.username != "" && this.$data.password != "") {
        return true;
      } else {
        this.$set(this.$data, "form_errors", [
          "Required params can't be empty",
        ]);
        return false;
      }
    },
    submit() {
      if (this.inputs_are_valid() == true) {
        this.$set(this.$data, "submit_button_loading_state", true);
        this.$axios
          .$post(
            "/api/users/signin",
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
              this.$store.commit(
                "auth/setRefreshToken",
                response.tokens.refresh_token
              );
              this.$store.commit(
                "auth/setAuthToken",
                response.tokens.auth_token
              );
              this.$store.commit("auth/setUserData", response.data);
              this.$store.commit("auth/setUserLoggedIn", true);
              this.$store.commit("auth/setUsername", this.$data.username);
              this.$store.commit("auth/setChatsList", response.chats);

              if (this.$data.remember_me) {
                Cookies.set("refresh_token", response.tokens.refresh_token);
                Cookies.set("auth_token", response.tokens.auth_token);
                Cookies.set("username", this.$data.username);
              }

              this.$store.dispatch("auth/setSocket");

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
                error.response.data.message ==
                "username or password is incorrect"
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
          })
          .finally(() => {
            this.$set(this.$data, "submit_button_loading_state", false);
          });
      }
    },
  },
};
</script>
