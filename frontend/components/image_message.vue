<template>
  <!-- IMAGE MESSAGE -->
  <div class="message_row my_message type_image">
    <div class="message">
      <div class="image">
        <img :src="image_address" />
      </div>

      <p class="message_content" v-if="text_content" v-html="text_content"></p>
      <div class="message_footer">
        <span class="send_datetime">{{ send_time }}</span>
        <!-- SEEN STATE -->
        <MessageSeenState :seen_state="seen_state"></MessageSeenState>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextMessage",
  data() {
    return {};
  },
  mounted() {
    const els = document.querySelectorAll(".image img");
    els.forEach((item, index) => {
      item.addEventListener("load", () => {
        item.classList.add("image__loaded");
      });
    });
  },
  props: [
    "sender",
    "text_content",
    "image_address",
    "send_time",
    "edited",
    "my_message",
    "seen_state",
    "image_message_downloaded",
  ],
};
</script>
