<template>
  <div>
    <UserCreatedDialog v-if="user_created_dialog"></UserCreatedDialog>
    <FormTopOverlay />
    <div class="form rounded-sm grey darken-4 pa-5 elevation-3">
      <h2 class="mb-3">{{ $t("signup") }}</h2>
      <v-text-field
        type="text"
        :label="$t('full_name')"
        outlined
        filled
        dense
        :color="theme_color"
        v-model="full_name"
      ></v-text-field>

      <v-text-field
        type="text"
        :label="$t('username')"
        outlined
        filled
        dense
        :color="theme_color"
        @keyup="keyup_username_event"
        v-model="username"
      ></v-text-field>

      <v-text-field
        type="password"
        :label="$t('password')"
        outlined
        filled
        dense
        :color="theme_color"
        v-model="password"
      ></v-text-field>

      <v-text-field
        type="password"
        :label="$t('password_confirmation')"
        outlined
        filled
        dense
        :color="theme_color"
        v-model="password_confirmation"
      ></v-text-field>

      <div v-if="form_errors" class="form_errors mb-3">
        <p v-for="(item, index) in form_errors" :key="index" class="item">
          {{ item }}
        </p>
      </div>

      <v-btn
        :loading="submit_button_loading_state"
        :color="theme_color"
        depressed
        @click="submit"
        >{{ $t("submit") }}</v-btn
      >

      <div class="sepa mt-4">
        <NuxtLink to="/signin" class="w-100 d-block mt-3">{{
          $t("signin")
        }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import configs from "@/assets/javascript/configs";
import slugify from "slugify";

export default {
  name: "signup",
  data() {
    return {
      full_name: "",
      username: "",
      password: "",
      password_confirmation: "",
      submit_button_loading_state: false,
      theme_color: configs.theme_color,
      form_errors: [],
      user_created_dialog: false,
    };
  },
  methods: {
    keyup_username_event() {
      const username = this.$data.username;
      let limited_username = slugify(username, {
        lower: true,
        strict: false,
        locale: "vi",
      });
      this.$set(this.$data, "username", limited_username);
    },
    inputs_are_valid() {
      let errors_list = [];
      if (
        this.$data.full_name == "" ||
        this.$data.username == "" ||
        this.$data.password == "" ||
        this.$data.password_confirmation == ""
      ) {
        errors_list.push(this.$t("required_parameters_cannot_be_empty"));
      }
      if (this.$data.username.length < 5 || this.$data.username.length > 15) {
        errors_list.push(this.$t("minimum_and_maximum_for_username"));
      }

      if (
        this.$data.password.trim() != this.$data.password_confirmation.trim()
      ) {
        errors_list.push(
          this.$t("password_and_passwordconfirmation_are_not_equal")
        );
      }

      if (errors_list.length > 0) {
        this.$set(this.$data, "form_errors", errors_list);
        return false;
      } else return true;
    },
    goto_signin_page() {
      this.$router.push({ path: "/signin" });
    },
    submit() {
      if (this.inputs_are_valid()) {
        this.$set(this.$data, "submit_button_loading_state", true);
        this.$axios
          .$post("/api/users/signup", {
            full_name: this.$data.full_name,
            username: this.$data.username,
            password: this.$data.password,
          })
          .then((response) => {
            if (response.message == "user created successfully") {
              this.$set(this.$data, "user_created_dialog", true);
            }
          })
          .catch((error) => {
            if (error.response.data) {
              if (error.response.status == 400) {
                console.log(error.response);
                this.$set(this.$data, "form_errors", [
                  this.$t("required_parameters_cannot_be_empty"),
                ]);
              } else if (error.response.status == 409) {
                this.$set(this.$data, "form_errors", [
                  this.$t("username_already_registered"),
                ]);
              } else if (error.response.status == 500) {
                this.$set(this.$data, "form_errors", [
                  this.$t("server_side_error"),
                ]);
              } else if (
                error.response.message == "username already registered"
              ) {
                this.$set(this.$data, "form_errors", [
                  this.$t("username_already_registered"),
                ]);
              }
            } else {
              this.$set(this.$data, "form_errors", [
                this.$t("server_side_error"),
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
