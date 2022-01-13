<template>
  <div
    class="solid_color_avatar"
    ref="colored_avatar"
    :style="this.$emit('style')"
  >
    {{ value }}
  </div>
</template>

<script>
import configs from "@/assets/javascript/configs";

export default {
  name: "ColoredAvatar",
  data() {
    return {
      avatar_class: "grey",
      size_class: "",
    };
  },
  mounted() {
    let vm = this;
    if (!vm.image_url) {
      let final_class = "";
      const random_index = Math.floor(
        Math.random() * configs.avatar_random_colors.length
      );
      configs.avatar_random_colors[random_index].forEach((color) => {
        this.$refs.colored_avatar.classList.add(color);
      });
    }
  },
  props: ["value", "avatar_size"],
};
</script>
