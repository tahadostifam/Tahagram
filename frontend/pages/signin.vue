<template>
  <div>
    <div id="signin_form">
      <img id="logo" src="~/assets/images/logo.png" alt="Logo" />

      <div v-if="!email_sended" id="signin_form_content">
        <p class="text-center mb-10" dir="auto">
          {{ $t('signin_intro_text') }}
        </p>

        <v-text-field
          v-model="email"
          hint="Only email, yahoo, outlock"
          type="text"
          :placeholder="$t('email')"
          outlined
          filled
          :color="$configs.theme_color"
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
          <p
            v-for="(item, index) in form_errors"
            :key="index"
            class="item"
            :class="{
              'item-success': item.type === 'success',
              'item-error': item.type === 'error',
            }"
          >
            {{ item.message }}
          </p>
        </div>

        <div :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'">
          <v-btn
            :disabled="
              !email.trim().length > 0 || isValidEmail(email, this) !== true
            "
            x-large
            class="rounded-lg"
            style="width: 100%"
            :loading="submit_button_loading_state"
            :color="$configs.theme_color"
            depressed
            @click="submitFirstForm"
            >{{ $t('submit') }}</v-btn
          >
        </div>
      </div>

      <div v-else id="signin_form_content">
        <div class="text-center mb-10">
          <h1>
            {{ email }}
          </h1>
          <p>Please enter the code.</p>
        </div>

        <v-text-field
          v-model="verific_code"
          type="number"
          :label="$t('code')"
          single-line
          outlined
          filled
          :color="$configs.theme_color"
          :maxlength=6
          @keydown="verificCodeChange"
        ></v-text-field>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import Cookies from "js-cookie";
import Vue from 'vue';
import configs from '../configs/configs';
import isValidEmail from '../lib/input_rules';
import UsersHttp, { SigninActionError } from '../http/users.http';
import { HttpCallbackBase } from '../http/base';

const usersHttp = new UsersHttp();

enum EFormError {
  Success = 'success',
  Error = 'error',
}
interface IFormError {
  message: string;
  type: EFormError;
}

export default Vue.extend({
  name: 'SigninPage',
  data() {
    return {
      theme_color: configs.theme_color,
      email: 'mr.tahadostifam@gmail.com',
      remember_me: true,
      form_errors: [],
      submit_button_loading_state: false,
      email_sended: false,
      verific_code: '',
    };
  },
  methods: {
    isValidEmail,
    addFormError(items: Array<IFormError>) {
      items.forEach((item) => {
        this.$data.form_errors.push({
          message: item.message,
          type: item.type,
        });
      });
    },
    clearFormErrors() {
      this.$set(this.$data, 'form_errors', []);
    },
    submitFirstForm() {
      this.clearFormErrors();

      const email = this.$data.email.trim();
      if (email.length > 0) {
        this.$set(this.$data, 'submit_button_loading_state', true);

        usersHttp.SigninAction(email).then(
          () => {
            // State -> Success
            this.$set(this.$data, 'email_sended', true);
          },
          (cb: SigninActionError) => {
            if (cb.message === 'verific_code_limit' && cb.limit_end) {
              // State -> Limit of getting verification code
              const limitEndDate = new Date(cb.limit_end).toLocaleString(
                'fa-IR'
              );
              // limitEndString.lcal
              // let limitEndString = "";
              // limitEndString +=
              this.addFormError([
                {
                  message: this.$t('verific_code_limit', [limitEndDate]),
                  type: EFormError.Error,
                },
              ]);
            } else {
              // State -> Unknown Error
              this.addFormError([
                {
                  message: this.$t('server_side_error'),
                  type: EFormError.Error,
                },
              ]);
            }
          }
        );
      } else {
        this.addFormError([
          {
            message: this.$t('required_parameters_cannot_be_empty'),
            type: EFormError.Error,
          },
        ]);
      }
      this.$set(this.$data, 'submit_button_loading_state', false);
    },
    submitSecondForm() {
      const vm = this;
      usersHttp
        .SubmitValidateCodeForm(
          this.$data.email.trim(),
          this.$data.verific_code.trim()
        )
        .then(() => {
          console.log('success signin');
        })
        .catch((cb: HttpCallbackBase) => {
          this.clearFormErrors();
          switch (cb.message) {
            case 'bad_verific_code':
              break;
            case 'verific_code_expired':
              break;
            case 'verific_code_limit':
              break;
            case 'maximum_try_count':
              break;
            default:
              this.addFormError([
                {
                  message: vm.$t('server_side_error'),
                  type: EFormError.Error,
                },
              ]);
              break;
          }
        });
    },
    verificCodeChange() {
      const inputMaxLength = 6;
      const verificCode = this.$data.verific_code.trim();
      if (verificCode.length + 1 > inputMaxLength - 1) {
        this.submitSecondForm()
        this.$data.verific_code = verificCode.slice(0, inputMaxLength);
      }
    },
  },
});
</script>
