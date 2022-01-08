<template>
  <div class="row_flex">
    <div class="image" v-if="image_url">
      <img :src="image_url" onload="window.lazyImage(this)" class="avatar" />
    </div>
    <div v-else>
      <div class="solid_color_avatar" ref="colored_avatar">
        {{ username[0] }}
      </div>
    </div>

    <div>
      <span class="d-block">{{ username }}</span>
      <span class="d-block text--secondary">{{ message_preview }}</span>
    </div>
  </div>
</template>

<script>
import configs from "@/assets/javascript/configs";

export default {
  name: "MessageRow",
  data() {
    return {
      avatar_class: "grey",
    };
  },
  mounted() {
    let final_class = "";
    const random_index = Math.floor(
      Math.random() * configs.avatar_random_colors.length
    );
    configs.avatar_random_colors[random_index].forEach((color) => {
      this.$refs.colored_avatar.classList.add(color);
    });
  },
  props: ["username", "message_preview", "image_url"],
};
</script>
