<template>
  <v-dialog max-width="450" v-model="show_dialog" scrollable>
    <v-card>
      <div class="d-flex justify-space-between align-center">
        <v-card-title class="text-h6"> New Channel </v-card-title>
        <div class="mr-2">
          <v-btn
            large
            icon
            style="padding-top: 3px"
            @click="$emit('close_button')"
          >
            <v-icon class="icon"> mdi-close </v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateChannelDialog",
  data() {
    return {
      show_dialog: false,
    };
  },
  props: ["show"],
  watch: {
    show: {
      immediate: true,
      handler(new_value) {
        this.show_dialog = new_value;
      },
    },
    show_dialog: {
      immediate: true,
      handler(new_value) {
        this.$emit("update:show", new_value);
      },
    },
  },
};
</script>
