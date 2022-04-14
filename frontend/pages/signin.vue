<template>
  <div>
    <div id="signin_form">
      <img id="logo" src="~/assets/images/logo.png" alt="Logo" />

      <div v-if="!email_sended" id="signin_form_content">
        <p class="text-center mb-10" dir="auto">
          {{ $t("signin_intro_text") }}
        </p>

        <v-text-field
          v-model="email"
          hint="Only email, yahoo, outlock"
          type="text"
          :label="$t('email')"
          outlined
          filled
          dense
          :color="$configs.theme_color"
          :rules="[input_rules.required, input_rules.email]"
        ></v-text-field>

        <v-checkbox
          v-model="remember_me"
          class="mt-2 pa-0"
          :label="$t('remember_me')"
          :color="$configs.theme_color"
        ></v-checkbox>

        <div
          v-if="form_errors"
          class="form_errors mb-3"
          :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
        >
          <p v-for="(item, index) in form_errors" :key="index" class="item">
            {{ item }}
          </p>
        </div>

        <div :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'">
          <v-btn
            :disabled="!email.trim().length > 0"
            x-large
            class="rounded-lg"
            style="width: 100%"
            :loading="submit_button_loading_state"
            :color="$configs.theme_color"
            depressed
            @click="submit"
            >{{ $t('submit') }}</v-btn
          >
        </div>
      </div>

      <div v-else id="signin_form_content">
        <div class="text-center mb-10">
          <h1>+98 922 346 6074</h1>
          <p>Please enter the code.</p>
        </div>

        <v-text-field
          v-model="verific_code"
          type="text"
          :label="$t('code')"
          outlined
          filled
          dense
          :color="$configs.theme_color"
        ></v-text-field>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import Cookies from "js-cookie";
import Vue from 'vue';
import configs from '../configs/configs';
import isValidEmail from '../lib/valid_email'
import UsersHttp from '../http/users.http'

const usersHttp = new UsersHttp();

export default Vue.extend({
  name: 'SigninPage',
  data() {
    return {
      theme_color: configs.theme_color,
      email: '',
      remember_me: true,
      form_errors: [],
      submit_button_loading_state: false,
      email_sended: false,
      verific_code: '',
      input_rules: {
        required: (value) => !!value || this.$t('required'),
        email: (value) => isValidEmail(value, this)
      },
    };
  },
  methods: {
    submit() {
      const email = this.$data.email.trim();
      if (email.length > 0) {
        this.$set(this.$data, "submit_button_loading_state", true);

        usersHttp.SigninAction(email).then(() => {
          this.$set(this.$data, "submit_button_loading_state", true);
          this.$set(this.$data, "email_sended", true);
        }, () => {
          alert("error")
        })
      }
    },
  },
});
</script>
