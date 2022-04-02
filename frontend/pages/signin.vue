<template>
  <div>
    <div id="signin_form">
      <img id="logo" src="~/assets/images/logo.png" alt="Logo" />

      <div id="signin_form_content" v-if="!email_sended">
        <p class="text-center mb-10">
          Please enter your email we will send you an email that has verification code.
        </p>

        <v-text-field
          hint="Only email, yahoo, outlock"
          type="text"
          :label="$t('email')"
          outlined
          filled
          dense
          :color="$configs.theme_color"
          v-model="email"
        ></v-text-field>

        <v-checkbox
          class="mt-2 pa-0"
          :label="$t('remember_me')"
          :color="$configs.theme_color"
          v-model="remember_me"
        ></v-checkbox>

        <div
          v-if="form_errors"
          class="form_errors mb-3"
          :dir="this.$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
        >
          <p v-for="(item, index) in form_errors" :key="index" class="item">
            {{ item }}
          </p>
        </div>

        <div :dir="this.$i18n.locale == 'fa' ? 'rtl' : 'ltr'">
          <v-btn
            x-large
            class="rounded-lg"
            style="width: 100%;"
            @click="submit"
            :loading="submit_button_loading_state"
            :color="$configs.theme_color"
            depressed
            >{{ $t("submit") }}</v-btn
          >
        </div>
      </div>

      <div v-else id="signin_form_content">
        <div class="text-center mb-10">
          <h1>+98 922 346 6074</h1>
          <p>
            Please enter the code.
          </p>
        </div>

        <v-text-field
          type="text"
          :label="$t('code')"
          outlined
          filled
          dense
          :color="$configs.theme_color"
          v-model="verific_code"
        ></v-text-field>

      </div>
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
      email: "",
      remember_me: true,
      form_errors: [],
      submit_button_loading_state: false,
      email_sended: false,
      verific_code: ""
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
      this.$data.email_sended = true
      // if (this.inputs_are_valid() == true) {
      //   this.$set(this.$data, "submit_button_loading_state", true);
      //   this.$axios
      //     .$post(
      //       "/api/users/signin",
      //       {
      //         username: this.$data.username,
      //         password: this.$data.password,
      //       },
      //       {
      //         headers: {
      //           "Content-Type": "application/json; charset=UTF-8",
      //         },
      //       }
      //     )
      //     .then((response) => {
      //       if (response.message == "success") {
      //         this.$store.commit(
      //           "auth/setRefreshToken",
      //           response.tokens.refresh_token
      //         );
      //         this.$store.commit(
      //           "auth/setAuthToken",
      //           response.tokens.auth_token
      //         );
      //         this.$store.commit("auth/setUserData", response.data);
      //         this.$store.commit("auth/setUserLoggedIn", true);
      //         this.$store.commit("auth/setUsername", this.$data.username);
      //         this.$store.commit("auth/setChatsList", response.chats);

      //         if (this.$data.remember_me) {
      //           Cookies.set("refresh_token", response.tokens.refresh_token);
      //           Cookies.set("auth_token", response.tokens.auth_token);
      //           Cookies.set("username", this.$data.username);
      //         }

      //         this.$router.push({ path: "/" + this.$i18n.locale + "/chat" });
      //       } else {
      //         this.$set(this.$data, "form_errors", [
      //           this.$t("server_side_error"),
      //         ]);
      //       }
      //     })
      //     .catch((error) => {
      //       if (error && error.response && error.response.data) {
      //         if (
      //           error.response.data.message ==
      //           "username or password is incorrect"
      //         ) {
      //           this.$set(this.$data, "form_errors", [
      //             this.$t("username_or_password_is_incorrect"),
      //           ]);
      //         } else if (error.response.status == 400) {
      //           this.$set(this.$data, "form_errors", [
      //             this.$t("required_parameters_cannot_be_empty"),
      //           ]);
      //         } else if (error.response.status == 500) {
      //           this.$set(this.$data, "form_errors", [
      //             this.$t("server_side_error"),
      //           ]);
      //         }
      //       } else {
      //         this.$set(this.$data, "form_errors", [
      //           this.$t("server_side_error"),
      //         ]);
      //       }
      //     })
      //     .finally(() => {
      //       this.$set(this.$data, "submit_button_loading_state", false);
      //     });
      // }
    },
  },
};
</script>
