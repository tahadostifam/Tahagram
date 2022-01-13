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
        <!-- <div class="solid_color_avatar" ref="colored_avatar">
          {{ chat_name[0] }}
        </div> -->
        <ColoredAvatar :value="chat_name[0]"/>
        </div>
      </div>

      <div>
        <span class="d-block">{{ chat_name }}</span>
        <span class="d-block text--secondary">{{ last_message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import configs from "@/assets/javascript/configs";

export default {
  name: "ChatRow",
  props: ["chat_name", "last_message", "image_url", "active_chat"],
};
</script>
