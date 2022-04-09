<template>
  <v-snackbar
    color="red"
    v-model="snackbar"
    :timeout="5000"
    :dir="this.$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
  >
    {{ $t("server_side_error") }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="snackbar = false">
        {{ $t("close") }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "ErrorSnakbar",
  data() {
    return {
      snackbar: false,
    };
  },
  props: ["show"],
  watch: {
    show: {
      immediate: true,
      handler(new_value) {
        this.snackbar = new_value;
      },
    },
    snackbar: {
      immediate: true,
      handler(new_value) {
        this.$emit("update:show", new_value);
      },
    },
  },
};
</script>
