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
          class="rounded-text-field"
          hint="Only email, yahoo, outlook"
          type="text"
          :placeholder="$t('email')"
          outlined
          filled
          :color="$configs.themeColor"
        ></v-text-field>

        <v-checkbox
          v-model="remember_me"
          class="mt-2 pa-0"
          :label="$t('remember_me')"
          :color="$configs.themeColor"
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
            :color="$configs.themeColor"
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
          class="rounded-text-field"
          type="text"
          :label="$t('code')"
          single-line
          outlined
          hide-details
          filled
          :color="$configs.themeColor"
          :maxlength=6
          autocomplete="false"
          required
        ></v-text-field>

        <div
          v-if="form_errors"
          class="form_errors mb-5 mt-3"
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

        <v-btn
          :disabled="verific_code.trim().length < 6"
          x-large
          class="rounded-lg"
          style="width: 100%"
          :loading="submit_verific_code_button_loading_state"
          :color="$configs.themeColor"
          depressed
          @click="submitSecondForm"
          >{{ $t('submit') }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import configs from '../configs/configs';
import isValidEmail from '../lib/input_rules';
import UsersHttp from '../http/users.http';

const usersHttp = new UsersHttp();

export default {
  name: 'SigninPage',
  data() {
    return {
      themeColor: configs.themeColor,
      email: 'mr.tahadostifam@gmail.com',
      remember_me: true,
      form_errors: [],
      submit_button_loading_state: false,
      submit_verific_code_button_loading_state: false,
      email_sended: false,
      verific_code: '',
    };
  },
  methods: {
    isValidEmail,
    addFormError(items) {
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
            this.clearFormErrors();
          },
          (cb) => {
            if (cb.message === 'verific_code_limit' && cb.limit_end) {
              // State -> Limit of getting verification code
              const limitEndDate = new Date(cb.limit_end).toLocaleString(
                'fa-IR'
              );
              this.addFormError([
                {
                  message: this.$t('verific_code_limit', [limitEndDate]).toString(),
                  type: "error",
                },
              ]);
            } else {
              // State -> Unknown Error
              this.addFormError([
                {
                  message: this.$t('server_side_error').toString(),
                  type: "error",
                },
              ]);
            }
          }
        );
      } else {
        this.addFormError([
          {
            message: this.$t('required_parameters_cannot_be_empty').toString(),
            type: "error",
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
        .then((cb) => {
          this.$router.push({ path: "/" + this.$i18n.locale + "/"})
        })
        .catch((cb) => {
          console.error(cb);

          this.clearFormErrors();

          switch (cb.message) {
            case 'verific code is not valid':
              this.addFormError([
                {
                  message: vm.$t('bad_verific_code').toString(),
                  type: "error",
                },
              ]);
              break;
            case 'verific code expired':
              this.addFormError([
                {
                  message: vm.$t('verific_code_expired').toString(),
                  type: "error",
                },
              ]);
              break;
            case 'maximum verific code try count':
              this.addFormError([
                {
                  message: vm.$t('maximum_try_count').toString(),
                  type: "error",
                },
              ]);
              break;
            default:
              this.addFormError([
                {
                  message: vm.$t('server_side_error').toString(),
                  type: "error",
                },
              ]);
              break;
          }
        });
    },
  },
};
</script>