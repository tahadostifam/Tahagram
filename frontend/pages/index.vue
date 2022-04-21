<template>
  <div>
    <div v-if="!userSignedIn">
    </div>
    <div>
      Welcome {{ $store.state }}
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
    usersHttp.AuthenticationAction().then(() => {
      this.$data.userSignedIn = true;
    }).catch(() => {
      this.$router.push({ path: '/' + this.$i18n.locale + '/signin' });
    })
  }
}
</script>