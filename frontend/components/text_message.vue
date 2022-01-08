<template>
  <!-- TEXT MESSAGE -->
  <div
    class="message_row"
    :class="{ my_message: my_message }"
    @contextmenu="$emit('contextmenu')"
  >
    <div class="message">
      <span v-if="!my_message" class="sender_name">{{ sender }}</span>
      <p class="message_content" v-html="text_content"></p>
      <div class="message_footer">
        <span v-if="edited" class="edit_state mr-1 font-italic">edited</span>
        <span class="send_datetime">{{ send_time }}</span>
        <MessageSeenState
          v-if="my_message"
          :seen_state="seen_state"
        ></MessageSeenState>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextMessage",
  props: [
    "sender",
    "text_content",
    "send_time",
    "edited",
    "my_message",
    "seen_state",
  ],
};
</script>
