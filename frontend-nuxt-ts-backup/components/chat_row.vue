<template>
  <div
    class="chat_row"
    :class="{ active_chat: activeChat }"
    @click="$emit('clickEvent')"
  >
    <div class="row_flex">
      <div v-if="imageUrl" class="image">
        <img v-lazy-image :src="imageUrl" class="avatar" />
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
  props: {
    chatName: {
      type: String,
      required: true
    },
    lastMessage: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: null
    },
    activeChat: {
      type: Boolean,
    }
  },
};
</script>
