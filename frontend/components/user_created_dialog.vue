<template>
  <v-dialog v-model="user_created_dialog" max-width="370" persistent>
    <div class="px-4 pt-3">
      <h3 class="text-h6 mb-2">{{ $t('account_created') }}</h3>

      <p class="text-grey" :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'">
        {{ $t('account_created_text') }}
      </p>

      <v-card-actions class="pb-4 pr-0">
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="gotoSigninPage">
          {{ $t('goto_signin') }}
        </v-btn>
      </v-card-actions>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'UserCreatedDialog',
  data() {
    return {
      user_created_dialog: true,
    };
  },
  methods: {
    gotoSigninPage() {
      this.$router.push({ path: '/' + this.$i18n.locale + '/signin' });
    },
  },
});
</script>
