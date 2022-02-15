<template>
  <v-dialog max-width="450" v-model="dialog" @input="close" scrollable>
    <div class="pt-2">
      <div class="d-flex justify-space-between align-center pl-4">
        <h3 class="text-h6">
          <template v-if="active_chat.chat_type == 'private'">{{
            $t("user_info")
          }}</template>
          <template v-if="active_chat.chat_type == 'channel'">{{
            $t("channel_info")
          }}</template>
          <template v-if="active_chat.chat_type == 'group'">{{
            $t("group_info")
          }}</template>
        </h3>
        <div class="mr-2">
          <v-btn large icon style="padding-top: 3px" @click="close">
            <v-icon class="icon"> mdi-close </v-icon>
          </v-btn>
        </div>
      </div>

      <div class="d-flex align-center px-4 pb-5 pt-2">
        <div
          class="avatar avatar_large"
          v-if="user_default_avatar"
          @click="$emit('preview_self_profile')"
        >
          <img :src="user_default_avatar" />
        </div>

        <template v-else>
          <div
            class="solid_color_avatar avatar_large"
            v-if="active_chat.username"
          >
            {{ active_chat.username[0] }}
          </div>
        </template>

        <div class="ml-4">
          <span class="text-white font-weight-medium d-block w-100">
            <template v-if="active_chat.full_name">
              {{ active_chat.full_name }}
            </template>
          </span>
          <span class="text-grey d-block w-100">
            <template
              v-if="active_chat.chat_type != 'private' && active_chat.members"
              >{{ active_chat.members.length }} {{ $t("members") }}</template
            >
            <template v-else>{{
              get_last_seen(active_chat.last_seen)
            }}</template>
          </span>
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
              <span class="_title">{{ $t("username") }}</span>
            </div>
          </div>
        </div>
      </div>

      <template
        v-if="
          active_chat && active_chat.members && active_chat.members.length > 0
        "
      >
        <v-divider></v-divider>

        <div class="pb-1 pt-5">
          <div class="members_list">
            <div class="members_list_title">
              <div>
                <v-icon>mdi-account-multiple-outline</v-icon>
              </div>
              <div>{{ active_chat.members.length }} {{ $t("members") }}</div>
            </div>

            <!-- Context Menu For Messages -->
            <v-menu
              v-model="context_menu.show"
              :position-x="context_menu.x"
              :position-y="context_menu.y"
              absolute
              offset-y
              v-if="context_menu_member_rank && active_chat.iam_creator"
            >
              <v-list style="width: 200px">
                <v-list-item
                  v-if="context_menu_member_rank == 'member'"
                  v-ripple
                  @click="promote_to_admin"
                >
                  <v-list-item-title>{{
                    $t("promote_to_admin")
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-ripple
                  v-if="context_menu_member_rank == 'admin'"
                  @click="remove_admin_access"
                >
                  <v-list-item-title>{{
                    $t("remove_admin_access")
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <div
              class="member_item"
              v-ripple
              v-for="(item, index) in active_chat.members"
              :key="index"
              @click="$emit('view_member_profile', item.username)"
              @contextmenu="show_context_menu($event, item.username, item.rank)"
            >
              <div>
                <div
                  class="avatar"
                  v-if="item.profile_photos && item.profile_photos[0]"
                >
                  <img
                    :src="gimme_profile_photo_link_addr(item.profile_photos[0])"
                  />
                </div>
                <div v-else-if="item.username" class="solid_color_avatar">
                  {{ item.username[0] }}
                </div>
              </div>
              <div>
                <span>
                  {{ item.full_name }}
                  <div
                    class="d-inline-block text-blue"
                    v-if="item.rank == 'creator'"
                  >
                    &starf;
                  </div>
                  <div
                    class="d-inline-block text-grey"
                    v-else-if="item.rank == 'admin'"
                  >
                    &starf;
                  </div>
                </span>
                <span
                  v-if="item.last_seen"
                  class="text-left"
                  :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
                >
                  {{ get_last_seen(item.last_seen) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </v-dialog>
</template>

<script>
import link_addrs from "~/mixins/link_addrs.js";
import parse_last_seen from "~/mixins/parse_last_seen.js";

export default {
  mixins: [link_addrs, parse_last_seen],
  name: "view_user_profile",
  data() {
    return {
      dialog: false,
      context_menu: {
        show: false,
        x: 0,
        y: 0,
      },
      context_menu_member_rank: null,
      context_menu_member_username: null,
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
    show_context_menu(e, member_username, member_rank) {
      e.preventDefault();
      if (member_username != vm.username) {
        this.$set(this.$data, "context_menu_member_username", member_username);
        this.$set(this.$data, "context_menu_member_rank", member_rank);
        this.$set(this.$data.context_menu, "show", false);
        this.$set(this.$data.context_menu, "x", e.clientX);
        this.$set(this.$data.context_menu, "y", e.clientY);
        this.$nextTick(() => {
          this.$set(this.$data.context_menu, "show", true);
        });
      }
    },
    promote_to_admin() {
      const username = this.$data.context_menu_member_username;
      if (username && username.trim().length > 0) {
        window.ws.send(
          JSON.stringify({
            event: "change_member_access",
            chat_id: this.active_chat.chat_id,
            member_username: username,
            rank: "admin",
          })
        );
      } else {
        console.error("username is empty in promote_to_admin event");
      }
    },
    remove_admin_access() {
      const username = this.$data.context_menu_member_username;
      if (username && username.trim().length > 0) {
        window.ws.send(
          JSON.stringify({
            event: "change_member_access",
            chat_id: this.active_chat.chat_id,
            member_username: username,
            rank: "member",
          })
        );
      } else {
        console.error("username is empty in promote_to_admin event");
      }
    },
  },
};
</script>
