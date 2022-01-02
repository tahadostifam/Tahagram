<template>
  <div class="form rounded-sm grey darken-4 pa-5 elevation-3">
    <h2 class="mb-3">Signup</h2>
    <v-text-field
      type="text"
      label="Full Name"
      outlined
      filled
      dense
      :color="theme_color"
    ></v-text-field>

    <v-text-field
      type="text"
      label="Username"
      outlined
      filled
      dense
      :color="theme_color"
    ></v-text-field>

    <v-text-field
      type="password"
      label="Password"
      outlined
      filled
      dense
      :color="theme_color"
    ></v-text-field>

    <v-text-field
      type="password"
      label="Password Confirmation"
      outlined
      filled
      dense
      :color="theme_color"
    ></v-text-field>

    <v-btn :color="theme_color" depressed>Submit</v-btn>
  </div>
</template>

<script>
export default {
  name: 'SigninPage',
  data(){
    return{
      theme_color: "green accent-4"
    }
  }
}
</script>
