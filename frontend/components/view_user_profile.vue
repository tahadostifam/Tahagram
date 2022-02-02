<template>
  <v-dialog max-width="450" v-model="dialog" @input="close" scrollable>
    <v-card>
      <div class="d-flex justify-space-between align-center">
        <v-card-title class="text-h6"> User Info </v-card-title>
        <div class="mr-2">
          <v-btn large icon style="padding-top: 3px" @click="close">
            <v-icon class="icon"> mdi-close </v-icon>
          </v-btn>
        </div>
      </div>

      <div class="d-flex align-center px-4 pb-5">
        <div
          class="avatar"
          v-if="user_default_avatar"
          @click="preview_self_profile"
        >
          <img :src="user_default_avatar" />
        </div>

        <template v-else>
          <ColoredAvatar v-if="user_full_name" :value="user_full_name[0]" />
          <ColoredAvatar v-else :value="''" />
        </template>

        <div class="ml-4">
          <span class="text-white font-weight-medium d-block w-100">
            <template v-if="user_full_name">
              {{ user_full_name }}
            </template>
          </span>
          <span class="text-grey d-block w-100"
            >last seen today at 5:15 PM</span
          >
        </div>
      </div>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "view_user_profile",
  data() {
    return {
      dialog: false,
    };
  },
  watch: {
    show: {
      immediate: true,
      handler(new_value) {
        this.dialog = new_value;
      },
    },
  },
  props: {
    user_default_avatar: {
      type: String,
    },
    user_full_name: {
      type: String,
    },
    show: {
      type: Boolean,
    },
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
  },
};
</script>
