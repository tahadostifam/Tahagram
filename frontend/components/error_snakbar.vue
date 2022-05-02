<template>
  <v-snackbar
    v-model="local_show"
    color="red"
    :timeout="5000"
    :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
  >
    {{ $t("server_side_error") }}
    <template #action="{ attrs }">
      <v-btn text v-bind="attrs" @click="local_show = false">
        {{ $t("close") }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "ErrorSnakbar",
  props: {
    show: {
      type: Boolean
    }
  },
  data() {
    return {
      local_show: false,
    };
  },
  watch: {
    show: {
      immediate: true,
      handler(newValue) {
        this.local_show = newValue;
      },
    },
    local_show: {
      immediate: true,
      handler(newValue) {
        this.$emit("update:show", newValue);
      },
    },
  },
};
</script>
