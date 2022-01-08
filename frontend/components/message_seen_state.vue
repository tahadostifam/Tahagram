<template>
  <v-icon v-if="seen_state == 'sended'" class="checkmark_state"
    >mdi-check</v-icon
  >
  <v-icon v-else-if="seen_state == 'seened'" class="checkmark_state"
    >mdi-check-all</v-icon
  >
  <v-icon
    v-else-if="seen_state == 'sending'"
    class="checkmark_state"
    style="font-size: 16px !important"
    >mdi-alarm</v-icon
  >
</template>

<script>
export default {
  name: "MessageSeenState",
  props: ["seen_state"],
};
</script>
