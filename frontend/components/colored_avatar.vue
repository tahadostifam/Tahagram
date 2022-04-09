<template>
  <div
    class="solid_color_avatar"
    :class="{ avatar_xlarge: avatar_xlarge }"
  >{{value}}</div>
</template>

<script>
export default {
  name: "ColoredAvatar",
  props: {
    value: {
      type: String,
      required: true
    },
    avatarXlarge: {
      type: Boolean,
      default: false
    }
  },
};
</script>
