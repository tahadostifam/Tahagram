<template>
  <div
    class="solid_color_avatar"
    ref="colored_avatar"
    :class="{ avatar_xlarge: avatar_xlarge }"
  >
    {{ value }}
  </div>
</template>

<script>
import configs from "@/assets/javascript/configs";

export default {
  name: "ColoredAvatar",
  props: ["value", "avatar_xlarge"],
};
</script>
