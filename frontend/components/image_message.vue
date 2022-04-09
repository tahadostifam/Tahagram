<template>
  <!-- IMAGE MESSAGE -->
  <div
    class="message_row type_image"
    :class="{ my_message: my_message }"
    @contextmenu="$emit('contextmenu')"
  >
    <div class="message">
      <span v-if="!my_message && sender" style class="sender_name">{{
        sender
      }}</span>

      <div class="image" @click="$emit('click')">
        <img :src="image_address" />
      </div>

      <p v-if="text_content" class="message_content" v-html="text_content"></p>
      <div class="message_footer">
        <span class="send_datetime">{{ send_time }}</span>
        <!-- SEEN STATE -->
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
  name: "ImageMessage",
  props: {
    sender: {
      type: String,
      required: true
    },
    textContent: {
      type: String,
      required: true
    },
    imageAddress: {
      type: String,
      required: true
    },
    sendTime: {
      type: String,
      required: true
    },
    edited: {
      type: Boolean,
    },
    isMyMessage: {
      type: Boolean,
    },
    seenState: {
      type: String,
      required: true
    },
  },
  data() {
    return {};
  },
  mounted() {
    // FIXME
    // const els = document.querySelectorAll(".image img");
    // els.forEach((item, _index) => {
    //   item.addEventListener("load", () => {
    //     item.classList.add("image__loaded");
    //   });
    // });
  },
};
</script>
