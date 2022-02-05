<template>
  <v-dialog max-width="350" v-model="user_created_dialog" persistent>
    <v-card>
      <v-card-title class="text-h5"> Account Created </v-card-title>

      <v-card-text>
        Your account created successfully with this information that you entered
        at form. Now you should just signin into your account using Signin
        Form.<br />
        Enjoy using ChatApp :)
      </v-card-text>

      <v-card-actions class="pb-4">
        <!-- <v-btn color="green darken-1" text @click="user_created_dialog = false">
          Close
        </v-btn> -->

        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="goto_signin_page">
          Go To Signin
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UserCreatedDialog",
  data() {
    return {
      user_created_dialog: true,
    };
  },
  methods: {
    goto_signin_page() {
      this.$router.push({ path: "/" + this.$i18n.locale + "/signin" });
    },
  },
};
</script>
