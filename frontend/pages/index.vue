<template>
  <div>
    <div v-if="!userSignedIn">
    </div>
    <div v-else>
      <Main/>
    </div>
  </div>
</template>

<script>
import UsersHttp from '../http/users.http'

const usersHttp = new UsersHttp();

export default {
  name: "IndexPage",
  data() {
    return {
      userSignedIn: false
    }
  },
  mounted(){
    const vm = this;
    usersHttp.AuthenticationAction().then((cb) => {
      vm.$store.commit("users/setUserData", cb)
      this.$data.userSignedIn = true;
    }).catch(() => {
      this.$router.push({ path: '/' + this.$i18n.locale + '/signin' });
    })
  }
}
</script>