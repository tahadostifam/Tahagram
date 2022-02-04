<template>
  <div>
    <UserCreatedDialog v-if="user_created_dialog"></UserCreatedDialog>
    <FormTopOverlay />
    <div class="form rounded-sm grey darken-4 pa-5 elevation-3">
      <h2 class="mb-3">Signup</h2>
      <v-text-field
        type="text"
        label="Full Name"
        outlined
        filled
        dense
        :color="theme_color"
        v-model="full_name"
      ></v-text-field>

      <v-text-field
        type="text"
        label="Username"
        outlined
        filled
        dense
        :color="theme_color"
        @keyup="keydown_username_event"
        v-model="username"
      ></v-text-field>

      <v-text-field
        type="password"
        label="Password"
        outlined
        filled
        dense
        :color="theme_color"
        v-model="password"
      ></v-text-field>

      <v-text-field
        type="password"
        label="Password Confirmation"
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
        >Submit</v-btn
      >

      <div class="sepa mt-4">
        <NuxtLink to="/signin" class="w-100 d-block mt-3">Signin</NuxtLink>
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
    keydown_username_event() {
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
        errors_list.push("Required params can't be empty");
      }
      if (this.$data.username.length < 5 || this.$data.username.length > 15) {
        errors_list.push(
          "Username must be at least 5 and at most 15 characters"
        );
      }

      if (
        this.$data.password.trim() != this.$data.password_confirmation.trim()
      ) {
        errors_list.push("Password and PasswordConfirmation are not equal");
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
                  "Required parameters can't be are empty",
                ]);
              } else if (error.response.status == 409) {
                this.$set(this.$data, "form_errors", [
                  "Username already registered",
                ]);
              } else if (error.response.status == 500) {
                this.$set(this.$data, "form_errors", [
                  "An error occurred on the client side. please try again",
                ]);
              } else if (
                error.response.message == "username already registered"
              ) {
                this.$set(this.$data, "form_errors", [
                  "Username already registered",
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
