import configs from './configs/configs'
import I18nMessages from './plugins/i18n'

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

  css: ['~/assets/dist/styles.css'],

  plugins: ['~/plugins/configs.js', '~/plugins/directives.js'],

  components: true,

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify'],

  modules: ['@nuxtjs/pwa', '@nuxtjs/i18n'],

  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  loading: false,

  i18n: {
    locales: ['en', 'fa'],
    vueI18n: {
      messages: I18nMessages,
    },
  },

  vuetify: {
    customVariables: ['~/assets/scss/vuetify.configs.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: configs.themeColor,
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
}
