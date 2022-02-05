import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "ChatApp",
    title: "ChatApp",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/scss/styles.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/i18n",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: "http://127.0.0.1:8000",
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en",
    },
  },

  router: {
    middleware: [],
  },

  loading: false,

  i18n: {
    locales: ["en", "fa"],
    defaultLocale: "fa",
    vueI18n: {
      fallbackLocale: "fa",
      messages: {
        en: {
          developed_by: "Developed By",
          username_or_password_is_incorrect:
            "Username or password is incorrect",
          required_parameters_cannot_be_empty:
            "Required parameters can't be are empty",
          server_side_error:
            "An error occurred on the client side. please try again",
          signup: "Signup",
          signin: "Signin",
          submit: "Submit",
          remember_me: "Remember Me",
          full_name: "Full Name",
          username: "Username",
          password: "Password",
          password_confirmation: "Password Confirmation",
          minimum_and_maximum_for_username:
            "Username must be at least 5 and at most 15 characters",
          password_and_passwordconfirmation_are_not_equal:
            "Password and PasswordConfirmation are not equal",
          username_already_registered: "Username already registered",
        },
        fa: {
          developed_by: "توسعه داده شده توسط",
          username_or_password_is_incorrect:
            "نام کاربری یا گذرواژه شما صحیح نمی باشد",
          required_parameters_cannot_be_empty: "فیلد ها نمیتواند خالی باشد",
          server_side_error:
            "خطایی در سمت سرور رخ داده است لطفا دوباره امتحان کنید",
          signup: "ثبت نام",
          signin: "ورود",
          submit: "ارسال",
          remember_me: "اکانت من رو به یاد داشته باش",
          full_name: "نام",
          username: "نام کاربری",
          password: "گذرواژه",
          password_confirmation: "تکرار گذرواژه",
          minimum_and_maximum_for_username:
            "نام کاربری حداقل باید ۵ و حداکثر ۱۵ کاراکتر باشد",
          password_and_passwordconfirmation_are_not_equal:
            "گذرواژه و تکرار گذرواژه برابر نیستند",
          username_already_registered: "این نام کاربری قبلا ثبت شده است",
        },
      },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/scss/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.green.accent4,
        },
      },
    },
  },

  server: {
    port: 3000,
    host: "0.0.0.0",
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
