<template>
  <div
    @click="$emit('click_event')"
    class="chat_row"
    :class="{ active_chat: active_chat }"
  >
    <div class="row_flex">
      <div class="image" v-if="image_url">
        <img :src="image_url" onload="window.lazyImage(this)" class="avatar" />
      </div>
      <div v-else>
        <ColoredAvatar :value="chat_name[0]" />
      </div>
      <div>
        <span class="d-block">{{ chat_name }}</span>
        <span class="d-block text--secondary truncate">{{ last_message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatRow",
  props: ["chat_name", "last_message", "image_url", "active_chat"],
};
</script>
