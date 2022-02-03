<template>
  <div
    class="solid_color_avatar"
    :class="{ avatar_xlarge: avatar_xlarge }"
    v-html="value"
  ></div>
</template>

<script>
import configs from "@/assets/javascript/configs";

export default {
  name: "ColoredAvatar",
  props: ["value", "avatar_xlarge"],
};
</script>
