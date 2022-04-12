<template>
  <v-snackbar
    v-model="snackbar"
    color="red"
    :timeout="5000"
    :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
  >
    {{ $t('server_side_error') }}
    <template #action="{ attrs }">
      <v-btn text v-bind="attrs" @click="snackbar = false">
        {{ $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'ErrorSnakbar',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      snackbar: false,
    };
  },
  watch: {
    show: {
      immediate: true,
      handler(newValue: Boolean) {
        this.snackbar = newValue;
      },
    },
    snackbar: {
      immediate: true,
      handler(newValue: Boolean) {
        this.$emit('update:show', newValue);
      },
    },
  },
});
</script>
