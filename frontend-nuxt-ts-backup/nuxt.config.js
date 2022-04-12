import colors from 'vuetify/es5/util/colors';
import configs from './configs/configs';
import I18nMessages from './lib/i18n';

export default {
  head: {
    titleTemplate: 'ChatApp',
    title: 'ChatApp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'A Chat-Application built in Nodejs & Nuxtjs',
      },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['@/assets/scss/dist/styles.css'],

  plugins: [
    '~/plugins/configs.ts',
    '~/plugins/directives.ts'
  ],

  components: true,

  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],

  modules: ['@nuxtjs/axios', '@nuxtjs/pwa'],

  axios: {
    baseURL: configs.baseURL,
  },

  loading: false,

  i18n: {
    locales: ['en', 'fa'],
    // defaultLocale: "fa",
    vueI18n: {
      // fallbackLocale: "fa",
      messages: I18nMessages,
    },
  },

  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  vuetify: {
    customVariables: ['~/assets/scss/vuetify.configs.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.green.accent4,
        },
      },
    },
  },

  build: {},

  server: {
    port: 3000,
    host: '0.0.0.0',
  },

  telemetry: false,
};
