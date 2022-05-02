/* eslint-disable no-unused-vars */
<template>
  <div>
    <div v-if="!user_signed_in"></div>
    <div v-else>
      <Main />
    </div>
  </div>
</template>

<script>
import UsersHttp from '../http/users.http';

const usersHttp = new UsersHttp();

export default {
  name: 'IndexPage',
  data() {
    return {
      user_signed_in: false,
    };
  },
  mounted() {
    const vm = this;
    usersHttp
      .AuthenticationAction()
      .then((cb) => {
        vm.$store.commit('users/setUserData', cb);
        this.$data.user_signed_in = true;
      })
      .catch(() => {
        this.$router.push({ path: '/' + this.$i18n.locale + '/signin' });
      });
  },
};
</script>
