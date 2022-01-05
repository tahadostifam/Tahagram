<template>
  <div class="form rounded-sm grey darken-4 pa-5 elevation-3">
    <h2 class="mb-3">Signin</h2>
    <v-text-field
      type="text"
      label="Username"
      outlined
      filled
      dense
      :color="theme_color"
      v-model="username"
    ></v-text-field>

    <v-text-field
      type="password"
      label="Password"
      outlined
      filled
      dense
      v-model="password"
      :color="theme_color"
    ></v-text-field>

    <v-checkbox
    class="ma-0 pa-0"
    label="Remember me"
    :color="theme_color"
    value="1"
    v-model="remember_me"
    ></v-checkbox>

    <div v-if="form_errors" class="form_errors">
      <p v-for="(item, index) in form_errors" :key="index" class="item">{{item}}</p>
    </div>

    <v-btn @click="submit" :color="theme_color" depressed>Submit</v-btn>
  </div>
</template>

<script>
import configs from '@/assets/javascript/configs'

export default {
  name: 'SigninPage',
  data(){
    return{
      theme_color: configs.theme_color,
      username: '',
      password: '',
      remember_me: '',
      form_errors: []
    }
  },
  methods: {
    async submit(){
      await this.$axios.$post(configs.api_address + '/users/signin').then((response) => {
        console.log(response.data);
      })
    }
  }
}
</script>
