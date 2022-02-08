<template>
  <v-dialog max-width="450" v-model="dialog" @input="close" scrollable>
    <div>
      <div class="d-flex justify-space-between align-center pl-4">
        <h3 class="text-h6">
          <template v-if="active_chat.chat_type == 'private'"
            >User Info</template
          >
          <template v-if="active_chat.chat_type == 'channel'"
            >Channel Info</template
          >
          <template v-if="active_chat.chat_type == 'group'"
            >Group Info</template
          >
        </h3>
        <div class="mr-2">
          <v-btn large icon style="padding-top: 3px" @click="close">
            <v-icon class="icon"> mdi-close </v-icon>
          </v-btn>
        </div>
      </div>

      <div class="d-flex align-center px-4 pb-5">
        <div
          class="avatar avatar_large"
          v-if="user_default_avatar"
          @click="$emit('preview_self_profile')"
        >
          <img :src="user_default_avatar" />
        </div>

        <template v-else>
          <ColoredAvatar
            v-if="active_chat.full_name"
            :value="active_chat.full_name[0]"
          />
          <ColoredAvatar v-else :value="''" />
        </template>

        <div class="ml-4">
          <span class="text-white font-weight-medium d-block w-100">
            <template v-if="active_chat.full_name">
              {{ active_chat.full_name }}
            </template>
          </span>
          <span class="text-grey d-block w-100"
            >last seen today at 5:15 PM</span
          >
        </div>
      </div>

      <v-divider></v-divider>

      <div class="icon_and_value_grid">
        <div class="_row">
          <v-icon>mdi-information-outline</v-icon>
          <div class="content">
            <div v-if="active_chat.bio" class="mb-3">
              <span class="value">{{ active_chat.bio }}</span>
              <span class="_title">Bio</span>
            </div>
            <div>
              <span class="value">{{ active_chat.username }}</span>
              <span class="_title">Username</span>
            </div>
          </div>
        </div>
      </div>

      <div class="pb-1">
        <div class="members_list">
          <div class="members_list_title">
            <div>
              <v-icon>mdi-account-multiple-outline</v-icon>
            </div>
            <div>10 Members</div>
          </div>
          <div class="member_item" v-ripple>
            <div>
              <div
                class="avatar"
                v-if="user_default_avatar"
                @click="$emit('preview_self_profile')"
              >
                <img :src="'https://picsum.photos/500/500'" />
              </div>
            </div>
            <div>
              <span>{{ username }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    dialog: {
      immediate: true,
      handler(new_value) {
        this.$emit("update:show", new_value);
      },
    },
  },
  props: {
    user_default_avatar: {
      type: String,
    },
    active_chat: {},
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
