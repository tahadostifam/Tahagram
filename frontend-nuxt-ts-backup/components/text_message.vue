<template>
  <!-- TEXT MESSAGE -->
  <div
    class="message_row"
    :class="{ my_message: my_message }"
    @contextmenu="$emit('contextmenu')"
  >
    <div class="message">
      <span v-if="!my_message && sender" class="sender_name">{{ sender }}</span>
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
import Vue from "vue";

export default Vue.extend({
  name: "TextMessage",
  props: {
    sender: {
      type: String,
      default: null
    },
    textContent: {
      type: String,
      required: true
    },
    sendTime: {
      type: String, 
      required: true
    },
    edited: {
      type: Boolean,
      default: false
    },
    isMyMessage: {
      type: Boolean,
      default: false
    },
    seenState: {
      type: String,
      required: true
    }
  },
});
</script>
