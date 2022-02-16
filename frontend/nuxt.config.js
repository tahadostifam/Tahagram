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
    // baseURL: "http://127.0.0.1:8000",
    baseURL: "http://192.168.88.142:8000",
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en",
    },
    meta: {
      name: "Chat-App",
      description: "A Chat-Application built in Nodejs & Nuxtjs",
      theme_color: "#212121",
      start_url: "/",
    },
    manifest: {
      name: "Chat-Application",
      short_name: "ChatApp",
      description: "A Chat-Application built in Nodejs & Nuxtjs",
      theme_color: "#212121",
      start_url: "/",
    },
  },

  router: {
    middleware: [],
  },

  loading: false,

  i18n: {
    locales: ["en", "fa"],
    // defaultLocale: "fa",
    vueI18n: {
      // fallbackLocale: "fa",
      messages: {
        en: {
          developed_by: "Developed By",
          username_or_password_is_incorrect:
            "Username or password is incorrect",
          required_parameters_cannot_be_empty:
            "Required parameters can't be are empty",
          server_side_error:
            "An error occurred on the server side. please try again",
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
          cancel: "Cancel",
          back: "Back",
          create: "Create",
          save: "Save",
          new_channel: "New Channel",
          new_group: "New Group",
          channel_name: "Channel Name",
          channel_username: "Channel Username",
          desc: "Description",
          next: "Next",
          saved_messages: "Saved Messages",
          settings: "Settings",
          logout: "Logout",
          version: "Version",
          edit_profile: "Edit Profile",
          notifications: "Notifications",
          language: "Language",
          about_chatapp: "About Chatapp",
          edit_your_name: "Edit your name",
          set_profile_photo: "Set Profile Photo",
          name: "Name",
          any_detail_such_as: "Any details such as age, occupation or city",
          detail_example: "Example: Full-Stack Web Developer Based Iran",
          write_message: "Write a message...",
          group_name: "Group name",
          group_username: "Group username",
          members: "Members",
          last_seen_recently: "last seen recently",
          account_created: "Account Created",
          account_created_text: `
            Your account created successfully with this information that you entered
            at form. Now you should just signin into your account using Signin
            Form.
            Enjoy using ChatApp :)
          `.trim(),
          goto_signin: "Go To Signin",
          last_seen_at: "last seen at {0}",
          online: "online",
          caption: "Caption",
          members: "Members",
          no_chat_selected: "Select a chat to start messaging",
          no_messages_yet: "No messages yet",
          user_info: "User Info",
          group_info: "Group Info",
          channel_info: "Channel Info",
          group: "Group",
          channel: "Channel",
          user: "User",
          send: "Send",
          caption: "Caption",
          user_joined_in_chat: "joined in chat",
          close: "Close",
          delete_chat: "Delete Chat",
          promote_to_admin: "Promote to admin",
          remove_admin_access: "Remove admin access",
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
          cancel: "انصراف",
          back: "برگشت",
          create: "ساخت",
          save: "ذخیره",
          new_channel: "کانال جدید",
          new_group: "گروه جدید",
          channel_name: "نام کانال",
          channel_username: "نام کاربری کانال",
          desc: "توضیحات",
          next: "بعدی",
          saved_messages: "پیام های ذخیره شده",
          settings: "تنظیمات",
          logout: "خروج از حساب کاربری",
          version: "ورژن",
          edit_profile: "ویرایش پروفایل",
          notifications: "اعلان ها",
          language: "زبان",
          about_chatapp: "درباره",
          edit_your_name: "ویرایش نام",
          set_profile_photo: "انتخاب عکس پروفایل",
          name: "نام",
          any_detail_such_as: "هرگونه اطلاعاتی مانند سن یا شغل یا شهر",
          detail_example: "مثال : برنامه نویس فول استک در حیطه وب",
          write_message: "چیزی بنویسید...",
          group_name: "نام گروه",
          group_username: "نام کاربری گروه",
          members: "کاربر ها",
          last_seen_recently: "آخرین بازدید به تازگی",
          account_created: "اکانت شما ساخت شد",
          account_created_text: `
            اکانت شما با اطلاعاتی که وارد کرده بودید با موفقیت ساخته شد. برای وارد شدن به اکانت خود به فرم ورود بروید. موفق باشید!
          `.trim(),
          goto_signin: "صفحه ورود",
          last_seen_at: "آخرین بازدید در {0}",
          online: "آنلاین",
          caption: "توضیحات",
          members: "عضو",
          no_chat_selected: "لطفاً برای شروع پیام رسانی یک گفتگو انتخاب کنید",
          no_messages_yet: "پیامی وجود ندارد",
          user_info: "اطلاعات کاربر",
          group_info: "اطلاعات گروه",
          channel_info: "اطلاعات کانال",
          group: "گروه",
          channel: "کانال",
          user: "کاربر",
          send: "ارسال",
          caption: "توضیحات",
          user_joined_in_chat: "عضو شد",
          close: "بستن",
          delete_chat: "حذف کردن گفت و گو",
          promote_to_admin: "ارتقا به مدیر",
          remove_admin_access: "حذف دسترسی مدیر",
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

  telemetry: false,
};
