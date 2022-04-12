/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <div>
    <ErrorSnakbar
      :show="show_error_snakbar"
      @update:show="update_error_snakbar"
    ></ErrorSnakbar>

    <!-- <ViewImage
      :images_list="view_image.list"
      :show="view_image.show"
      :show_remove_button="view_image.show_remove_button"
      @close_button="view_image.show = false"
      @remove_button="remove_profile_photo"
    ></ViewImage> -->

    <NavDrawer
      :show="show_nav_drawer"
      :user_info="user_info"
      :user_default_avatar="user_default_avatar"
      @logout="logout"
      @show_settings_dialog="
        show_nav_drawer = false;
        show_settings_dialog = true;
      "
      @show_create_channel_dialog="
        show_nav_drawer = false;
        show_create_channel_dialog = true;
      "
      @show_create_group_dialog="
        show_nav_drawer = false;
        show_create_group_dialog = true;
      "
      @update:show="(new_value) => (show_nav_drawer = new_value)"
    ></NavDrawer>

    <!-- <SettingsDialog
      :show="show_settings_dialog"
      :user_default_avatar="user_default_avatar"
      :user_info="user_info"
      :active_section="settings_dialog_active_section"
      :photo_uploading_state="photo_uploading_state"
      @initilizing_socket_again="initilizing_socket_again"
      @preview_self_profile="preview_self_profile"
      @update:show="(new_value) => (show_settings_dialog = new_value)"
    ></SettingsDialog> -->

    <!-- <v-dialog v-model="crop_profile_photo.show" max-width="350">
      <div class="pa-5 pb-0">
        <cropper
          :src="crop_profile_photo.src"
          :stencil-size="{
            width: 280,
            height: 280,
          }"
          @change="crop_profile_photo_onchange"
        />
        <v-card-actions class="pr-0">
          <v-spacer></v-spacer>
          <v-btn
            :color="$configs.theme_color"
            text
            @click="crop_profile_photo.show = false"
          >
            CANCEL
          </v-btn>
          <v-btn
            :color="$configs.theme_color"
            text
            :loading="crop_profile_photo.button_loading_state"
            @click="upload_cropped_profile_photo"
          >
            SAVE
          </v-btn>
        </v-card-actions>
      </div>
    </v-dialog> -->

    <!-- <v-dialog v-model="crop_media_to_send.show" max-width="350">
      <div class="pa-5 pb-0">
        <cropper
          :src="crop_media_to_send.src"
          @change="crop_media_to_send_onchange"
        />
        <v-text-field
          v-model="media_to_send_caption"
          label="Caption"
          class="mt-2"
        ></v-text-field>
        <v-card-actions class="pr-0 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            :color="$configs.theme_color"
            text
            @click="crop_media_to_send.show = false"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            :color="$configs.theme_color"
            text
            :loading="crop_media_to_send.button_loading_state"
            @click="upload_cropped_media_to_send"
          >
            {{ $t("send") }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-dialog> -->

    <!-- <CreateChannelDialog
      :show="show_create_channel_dialog"
      @close_button="show_create_channel_dialog = false"
      @update:show="(new_value) => (show_create_channel_dialog = new_value)"
      @chat_created="a_channel_or_group_chat_created"
    ></CreateChannelDialog>

    <CreateGroupDialog
      :show="show_create_group_dialog"
      @close_button="show_create_group_dialog = false"
      @update:show="(new_value) => (show_create_group_dialog = new_value)"
      @chat_created="a_channel_or_group_chat_created"
    ></CreateGroupDialog>

    <ViewUserProfile
      :show.sync="view_user_profile.show"
      :user_default_avatar="
        gimme_profile_photo_link_addr(active_chat.profile_photo)
      "
      :active_chat="active_chat"
      @preview_self_profile="preview_user_profile"
      @update:show="(new_value) => (view_user_profile.show = new_value)"
      @view_member_profile="view_member_profile"
      @remove_button="remove_profile_photo"
    ></ViewUserProfile> -->

    <div id="main_container" class="pa-0">
      <div class="chats_list">
        <div class="section_header border">
          <div class="row_flex mx-auto" style="height: 100%">
            <div>
              <v-btn
                color="gray"
                dark
                icon
                large
                @click="show_nav_drawer = !show_nav_drawer"
              >
                <v-icon color="grey"> mdi-menu </v-icon>
              </v-btn>
            </div>
            <div>
              <input
                v-model="search_chat_input"
                type="text"
                class="custom_input pr-9"
                placeholder="Search"
              />
              <button
                v-if="search_chat_input.trim().length > 0"
                id="search_input_clear_button"
                @click="search_chat_input = ''"
              >
                <v-icon>mdi-close</v-icon>
              </button>
            </div>
          </div>
        </div>

        <div class="chats">
          <div v-if="updating_user_info_state" class="internet_bar">
            <v-progress-circular
              class="d-inline-block mr-4"
              indeterminate
            ></v-progress-circular>
            Updating...
          </div>
          <div
            v-else-if="$nuxt.isOffline || show_internet_bar"
            class="internet_bar"
          >
            <v-progress-circular
              class="d-inline-block mr-4"
              indeterminate
            ></v-progress-circular>
            Connecting...
          </div>

          <template v-if="search_chat_input.trim().length == 0">
            <template v-if="user_info.chats && user_info.chats.length > 0">
              <ChatRow
                v-for="(item, index) in user_info.chats"
                :key="index"
                :chat_name="item.full_name"
                :active_chat="item.chat_id == active_chat.chat_id"
                :image_url="gimme_profile_photo_link_addr(item.profile_photo)"
                :last_message="gimme_last_message(item.chat_id)"
                @click_event="show_chat(item.chat_id, 'chats_list')"
              ></ChatRow>
            </template>
            <ThereIsNothing v-else />
          </template>
          <template v-else-if="!show_internet_bar && search_chat_result">
            <span class="chat_row_badge">Global search</span>
            <ChatRow
              v-for="(item, index) in search_chat_result"
              :key="index"
              :chat_name="item.full_name"
              :image_url="gimme_profile_photo_link_addr(item.profile_photo)"
              :last_message="gimme_last_message(item.chat_id)"
              @click_event="show_chat(item._id, 'search_chat_result')"
            ></ChatRow>
            <template v-if="search_chat_in_local_result">
              <span class="chat_row_badge mt-5">Local search</span>
              <ChatRow
                v-for="(item, index) in search_chat_in_local_result"
                :key="index + item.username"
                :chat_name="item.full_name"
                :image_url="gimme_profile_photo_link_addr(item.profile_photo)"
                :last_message="gimme_last_message(item.chat_id)"
                @click_event="show_chat(item._id, 'search_chat_in_local')"
              ></ChatRow>
            </template>
          </template>
        </div>

        <div class="chat_view" :class="{ show: show_chat_view }">
          <template v-if="show_chat_view">
            <div class="section_header border px-3">
              <div
                class="d-flex align-center justify-space-between"
                style="height: 100%"
              >
                <v-btn
                  id="back_button_from_chat"
                  icon
                  depressed
                  large
                  class="mr-3"
                  @click="leaving_chat_button"
                >
                  <v-icon> mdi-arrow-left </v-icon>
                </v-btn>
                <div
                  class="d-flex align-center text-decoration-none mr-5"
                  style="width: 100%"
                  @click="show_user_profile"
                >
                  <div
                    v-if="
                      active_chat.profile_photo &&
                      active_chat.profile_photo.filename
                    "
                    class="image"
                  >
                    <img
                      :src="
                        gimme_profile_photo_link_addr(active_chat.profile_photo)
                      "
                      class="avatar"
                      onload="window.lazyImage(this)"
                    />
                  </div>

                  <div>
                    <span class="d-block font-weight-bold ml-3 text-white">{{
                      active_chat.full_name
                    }}</span>
                    <span
                      :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
                      class="d-block text-sm-caption font-weight-bold ml-3 text--secondary text-left"
                    >
                      <template v-if="active_chat.chat_type == 'private'">
                        <template v-if="active_chat.last_seen">
                          {{ get_last_seen(active_chat.last_seen) }}
                        </template>
                      </template>
                      <template v-else>
                        {{ $t(active_chat.chat_type) }}
                      </template>
                      <!-- <template v-else> FIXME
                        {{
                          active_chat.members_length
                            ? active_chat.members_length
                            : "1"
                        }}
                        {{ $t("members") }}
                      </template> -->
                    </span>
                  </div>
                </div>

                <div>
                  <v-menu
                    v-if="active_chat.chat_type == 'private'"
                    offset-y
                    transition="slide-y-transition"
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        color="gray"
                        dark
                        v-bind="attrs"
                        icon
                        large
                        v-on="on"
                      >
                        <v-icon color="grey"> mdi-dots-vertical </v-icon>
                      </v-btn>
                    </template>
                    <v-list style="width: 220px">
                      <!-- <v-list-item v-ripple>
                        <v-list-item-title>Mute</v-list-item-title>
                      </v-list-item> -->
                      <v-list-item
                        v-ripple
                        :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
                        @click="submit_delete_chat"
                      >
                        <v-list-item-title class="text-red">{{
                          $t("delete_chat")
                        }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </div>

            <div v-if="chat_is_loading" class="splash_screen absolute">
              <div class="center">
                <v-progress-circular
                  class="mb-2 d-block"
                  indeterminate
                  :color="$configs.theme_color"
                ></v-progress-circular>
              </div>
            </div>

            <div class="messages-scroll">
              <div
                v-if="
                  active_chat.messages &&
                  active_chat.messages.length > 0 &&
                  active_chat.username &&
                  active_chat.full_name
                "
                class="messages_list"
              >
                <!-- Context Menu For Messages -->
                <v-menu
                  v-model="context_menu_for_messages.show"
                  :position-x="context_menu_for_messages.x"
                  :position-y="context_menu_for_messages.y"
                  absolute
                  offset-y
                >
                  <v-list style="width: 200px">
                    <v-list-item
                      v-if="
                        active_chat.chat_type == 'private' ||
                        active_chat.chat_type == 'group' ||
                        active_chat.iam_admin_of_chat == true
                      "
                      v-ripple
                    >
                      <v-list-item-title>Reply</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-ripple @click="copy_message_to_clipboard">
                      <v-list-item-title>Copy</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-ripple>
                      <v-list-item-title>Forward</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="
                        active_chat.chat_type == 'private' ||
                        active_chat.iam_admin_of_chat == true ||
                        its_my_message()
                      "
                      v-ripple
                      @click="delete_message"
                    >
                      <v-list-item-title class="text-red"
                        >Delete</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>

                <template v-for="(item, index) in active_chat.messages">
                  <TextMessage
                    v-if="item.message_type == 'text'"
                    :key="index"
                    :message_id="item.message_id"
                    :sender="select_message_sender_fullname(item.message_id)"
                    :send_time="parse_message_date(item.send_time)"
                    :text_content="item.content"
                    :edited="item.edited"
                    :my_message="itsMyMessage(item)"
                    :seen_state="item.seen_state"
                    @contextmenu.native="
                      show_contextmenu_of_message($event, item.message_id)
                    "
                  ></TextMessage>
                  <ImageMessage
                    v-else-if="item.message_type == 'photo'"
                    :key="index"
                    :message_id="item.message_id"
                    :sender="select_message_sender_fullname(item.message_id)"
                    :send_time="parse_message_date(item.send_time)"
                    :text_content="item.caption"
                    :image_address="
                      gimmePhotoMessageLinkAddr(item.filename)
                    "
                    :my_message="itsMyMessage(item)"
                    :edited="item.edited"
                    :seen_state="item.seen_state"
                    @contextmenu.native="
                      show_contextmenu_of_message($event, item.message_id)
                    "
                    @click="
                      view_photo_message_as_full_screen(item.filename)
                    "
                  ></ImageMessage>
                  <div
                    v-else-if="item.message_type == 'join'"
                    :key="index"
                    class="text-center"
                  >
                    <span
                      class="badge_message"
                      :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
                      ><a>{{ item.username }}</a>
                      {{ $t("user_joined_in_chat") }}</span
                    >
                  </div>
                </template>
              </div>
              <div v-else class="text-center">
                <span class="badge_message">{{ $t("no_messages_yet") }}</span>
              </div>
            </div>

            <div
              v-if="
                active_chat.chat_type == 'private' ||
                (active_chat.chat_type == 'group' &&
                  active_chat.iam_amember_of_chat) ||
                active_chat.iam_admin_of_chat
              "
              class="send_message_section"
            >
              <div class="send_box">
                <v-btn
                  id="send_media_button"
                  :color="$configs.theme_color"
                  dark
                  icon
                  x-large
                  style="overflow: hidden"
                >
                  <input
                    id="send_media_input"
                    type="file"
                    style="
                      opacity: 0;
                      position: absolute;
                      width: 200px;
                      height: 40px;
                      z-index: 40;
                    "
                    accept="image/png,image/jpg,image/jpeg"
                    onchange="window.select_photo_to_send(this)"
                  />
                  <v-icon small :color="$configs.theme_color"> mdi-image </v-icon>
                </v-btn>

                <v-text-field
                  id="send_message_textbox"
                  v-model="send_text_message_input"
                  aria-multiline="true"
                  class="rounded-pill"
                  solo
                  :placeholder="$t('write_message')"
                  :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
                  @keypress.enter="submit_send_text_messages()"
                ></v-text-field>

                <emoji-picker class="emoji_picker" @emoji="insertEmoji">
                  <div
                    slot="emoji-invoker"
                    slot-scope="{ events: { click: clickEvent } }"
                    @click.stop="clickEvent"
                  >
                    <v-btn
                      id="emojies_button"
                      :color="$configs.theme_color"
                      dark
                      icon
                      x-large
                    >
                      <v-icon small :color="$configs.theme_color"> mdi-emoticon </v-icon>
                    </v-btn>
                  </div>
                  <div slot="emoji-picker" slot-scope="{ emojis, insertEmoji }">
                    <v-card
                      id="emoji_picker_card"
                      class="rounded-lg"
                      elevation="2"
                    >
                      <div class="pa-2">
                        <div>
                          <div
                            v-for="(emojiGroup, category) in emojis"
                            :key="category"
                          >
                            <h5 class="set_title">{{ category }}</h5>
                            <div>
                              <span
                                v-for="(emoji, emojiName) in emojiGroup"
                                :key="emojiName"
                                class="emoji_span"
                                :title="emojiName"
                                @click="insertEmoji(emoji)"
                                >{{ emoji }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </div>
                </emoji-picker>

                <v-btn
                  id="send_message_button"
                  :color="$configs.theme_color"
                  dark
                  icon
                  x-large
                  :disabled="send_text_message_input.trim().length == 0"
                  @click="submit_send_text_messages"
                >
                  <v-icon class="pl-1" small :color="$configs.theme_color">
                    mdi-send
                  </v-icon>
                </v-btn>
              </div>
            </div>
            <v-btn
              v-else-if="active_chat.iam_amember_of_chat"
              height="65"
              depressed
              class="bottom_full_bar rounded-0"
            >
              MUTE
            </v-btn>
            <v-btn
              v-else
              height="65"
              depressed
              class="bottom_full_bar rounded-0"
              @click="join_into_chat"
            >
              JOIN
            </v-btn>
          </template>
          <div v-if="!active_chat.chat_id" id="no_chat_selected">
            <span class="badge_message rtl">{{ $t("no_chat_selected") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EmojiPicker } from "vue-emoji-picker";
// import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import Vue from "vue";
import configs from "../configs/configs";
import linkAddrs from "../mixins/link_addrs";
import parseLastSeen from "../mixins/parse_last_seen";
import { IImageCropperCallback } from "../lib/interfaces"

export default Vue.extend({
  name: "ChatPage",
  components: {
    EmojiPicker,
    // Cropper,
  },
  mixins: [linkAddrs, parseLastSeen],
  data() {
    return {
      show_error_snakbar: false,
      theme_color: configs.theme_color,
      send_text_message_input: "",
      context_menu_for_messages: {
        show: false,
        x: 0,
        y: 0,
      },
      show_chat_view: false,
      chat_is_loading: false,
      show_nav_drawer: false,
      show_settings_dialog: false,
      settings_dialog_active_section: "home",
      settings_dialog_edit_full_name: false,
      update_full_name_input: "",
      user_default_avatar: undefined,
      crop_profile_photo: {
        show: false,
        src: null,
        canvas: null,
        button_loading_state: false,
      },
      crop_media_to_send: {
        show: false,
        src: null,
        canvas: null,
        button_loading_state: false,
      },
      photo_uploading_state: false,
      view_image: {
        show: false,
        list: [],
      },
      search_chat_input: "",
      search_chat_result: null,
      search_chat_in_local_result: null,
      bio_input: "",
      active_chat: {
        chat_id: null,
        messages: null,
        username: null,
        full_name: null,
        profile_photo: null,
      },
      chats_list: null,
      message_context_menu_message_id: null,
      show_internet_bar: false,
      updating_user_info_state: false,
      view_user_profile: {
        show: false,
      },
      show_create_channel_dialog: false,
      show_create_group_dialog: false,
      media_to_send_caption: "",
    };
  },
  computed: {
    username() {
      return this.$store.state.auth.auth.username;
    },
    user_info() {
      return this.$store.state.auth.user_info;
    },
  },
  mounted() {
    this.check_if_user_had_profile_photo();
    this.handle_escape_button();
    this.watch_profile_photos_change();
    this.watch_user_info_changes();
    this.watch_search_chat_submit();
    this.watch_internet_state_changes();
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    itsMyMessage(item: any): void {
      // const chat_type = this.$data.active_chat.chat_type;
      // if (chat_type != "channel") {
      //   return item.sender_username == vm.username;
      // } else if (
      //     this.$data.active_chat.iam_admin_of_chat ||
      //     this.$data.active_chat.iam_creator
      //   ) {
      //     return true;
      //   } else {
      //     return false;
      //   }
    },
    submit_delete_chat() {
      // ws.send(
      //   JSON.stringify({
      //     event: "delete_chat",
      //     chat_id: this.$data.active_chat.chat_id,
      //   })
      // );
    },
    update_error_snakbar(newValue: Boolean) {
      this.$set(this.$data, "show_error_snakbar", newValue);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    remove_profile_photo(filename: string) {
      // if (filename && filename.length > 0) {
      //   this.$axios
      //     .$post(
      //       "/api/profile_photos/remove_profile_photo",
      //       {
      //         filename,
      //       },
      //       {
      //         headers: {
      //           auth_token: this.$store.state.auth.auth.auth_token,
      //           username: this.username,
      //         },
      //       }
      //     )
      //     .then((response) => {
      //       if (response.message == "profile_photo removed") {
      //         this.$store.commit("auth/removeProfilePhoto", filename);
      //       }
      //       this.$set(
      //         this.$data.view_image,
      //         "list",
      //         this.$store.state.auth.user_info.profile_photos
      //       );
      //       const def_prof = this.$store.state.auth.user_info.profile_photos[0];
      //       this.$set(
      //         this.$data,
      //         "user_default_avatar",
      //         this.gimme_profile_photo_link_addr(def_prof)
      //       );
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //       this.error_occurred();
      //     });
      // }
    },
    its_my_message(): boolean {
      return true
      // const chats_messages = this.$store.state.auth.user_info.chats_messages;
      // const chat_id = this.$data.active_chat.chat_id;
      // if (
      //   chat_id &&
      //   chat_id.length > 0 &&
      //   this.$data.message_context_menu_message_id
      // ) {
      //   const chat = chats_messages.find(({ _id }) => _id == chat_id);
      //   if (chat) {
      //     const message = chat.messages_list.find(
      //       ({ message_id }) =>
      //         message_id == this.$data.message_context_menu_message_id
      //     );
      //     if (message) {
      //       if (message.sender_username == this.username) {
      //         return true;
      //       } else {
      //         return false;
      //       }
      //     }
      //   }
      // }
    },
    view_photo_message_as_full_screen(filename: string) {
      const photoAddr = this.gimmePhotoMessageLinkAddr(filename);
      this.show_view_image_modal(
        [
          {
            src: photoAddr,
          },
        ],
        false
      );
    },
    view_member_profile(username: string) {
      if (username === this.username) {
        this.$set(this.$data, "show_settings_dialog", true);
      } else {
        this.$set(this.$data, "search_chat_input", username);
        this.$set(this.$data.view_user_profile, "show", false);
      }
    },
    copy_message_to_clipboard() {
      const messageId = this.$data.message_context_menu_message_id;
      if (
        this.$data.active_chat.messages &&
        this.$data.active_chat.messages.length > 0 &&
        messageId
      ) {
        const message = this.$data.active_chat.messages.find(
          ({ message_id: localMessageId }) => localMessageId === messageId
        );
        if (message) {
          navigator.clipboard.writeText(message.content);
        }
      }
    },
    gimme_last_message(chatId: String): String {
      const chatsMessages = this.$store.state.auth.user_info.chatsMessages;
      if (chatsMessages) {
        const chat = chatsMessages.find(({ _id }) => _id === chatId);
        if (chat && chat.messages_list && chat.messages_list.length > 0) {
          const message = chat.messages_list[chat.messages_list.length - 1];
          if (message) {
            const messageType = message.message_type;
            if (messageType === "text") {
              return message.content.substr(0, 30);
            }
            if (messageType === "photo") {
              return "📷";
            }
          }
        }
      }
      return "";
    },
    watch_internet_state_changes() {
      this.$store.watch(
        () => this.$nuxt.isOffline,
        (value) => {
          if (value === false) {
            this.update_user_info();
          }
        }
      );
    },
    update_user_info() {
      this.$set(this.$data, "updating_user_info_state", true);
      // await window.vm.$store
      //   .dispatch("auth/Authenticate")
      //   .then(
      //     (user_data) => {
      //       console.log("Updating user info...");

      //       console.log("logging in with saved tokens");

      //       window.vm.$store.commit("auth/setUserData", user_data);
      //       window.vm.$store.commit("auth/setChatsList", user_data.chats);

      //       // TODO
      //       // update the messages of active_chat
      //     },
      //     () => {
      //       console.log("login with saved tokens failed!");
      //     }
      //   )
      //   .catch((err) => {
      //     console.log(err);
      //   })
      //   .finally(() => {
      //     this.$set(this.$data, "updating_user_info_state", false);
      //   });
    },
    a_channel_or_group_chat_created(chat) {
      // window.ws.close(); // FIXME - i cannot find a really important bug in this section
      // problem detail : users cannot send message after creating a new_channel
      // for fix this we have to update our info in frontend side

      // this.set_the_active_chat({
      //   chat_id: chat.chat_id,
      //   chat_type: chat.chat_type,
      //   full_name: chat.name,
      //   username: chat.username,
      //   profile_photo: chat.profile_photo,
      //   iam_admin_of_chat: true,
      // });

      // if (chat.members) {
      //   this.$set(
      //     this.$data.active_chat,
      //     "members_length",
      //     chat.members.length
      //   );
      // } FIXME

      // this.$set(this.$data.active_chat, "messages", null);

      this.$store.commit("auth/addChat", {
        chat_id: chat.chat_id,
        chat_type: chat.chat_type,
        full_name: chat.name,
        username: chat.username,
        profile_photo: chat.profile_photo,
      });

      this.$store.commit("auth/createNewChat", {
        _id: chat.chat_id,
        chat_type: chat.chat_type,
        messages_list: [],
      });

      // this.$set(this.$data, "show_chat_view", true);
      if (chat.chat_type == "channel") {
        this.$set(this.$data, "show_create_channel_dialog", false);
      } else if (chat.chat_type == "group") {
        this.$set(this.$data, "show_create_group_dialog", false);
      }
    },
    select_photo_to_send(e) {
      const file = e.files[0];
      const localPath = URL.createObjectURL(file);
      this.$set(this.$data.crop_media_to_send, "src", localPath);
      this.$set(this.$data.crop_media_to_send, "show", true);
    },
    upload_cropped_media_to_send() {
      // this.$set(this.$data.crop_media_to_send, "button_loading_state", true);
      // this.$set(this.$data.crop_media_to_send, "show", false);

      // const canvas = this.$data.crop_media_to_send.canvas;
      // if (canvas) {
      //   const croppedImage = canvas.toDataURL("image/png");
      //   const imageFile = window.dataURLtoFile(croppedImage, "photo_message");
      //   if (imageFile && this.$data.active_chat.chat_id) {
      //     const request_body = new FormData();
      //     request_body.append("photo", imageFile);
      //     request_body.append("chat_id", this.$data.active_chat.chat_id);
      //     request_body.append("chat_type", this.$data.active_chat.chat_type);
      //     if (
      //       this.$data.media_to_send_caption &&
      //       this.$data.media_to_send_caption.trim().length > 0
      //     ) {
      //       request_body.append("caption", this.$data.media_to_send_caption);
      //     }
      //     if (this.$data.active_chat.chat_type == "private") {
      //       request_body.append(
      //         "target_username",
      //         this.$data.active_chat.username
      //       );
      //     }

      //     this.$axios
      //       .$post("/api/messages/new_photo_message", request_body, {
      //         headers: {
      //           username: vm.username,
      //           auth_token: vm.$store.state.auth.auth.auth_token,
      //         },
      //       })
      //       .then((response) => {
      //         console.log(response);
      //       })
      //       .catch((error) => {
      //         console.error(error.response);
      //         this.error_occurred();
      //       });
      //     this.$set(
      //       this.$data.crop_media_to_send,
      //       "button_loading_state",
      //       false
      //     );
      //   } else {
      //     console.log("no photo to upload");
      //   }
      // } else
      //   console.log(
      //     "uploading photo_message failed! :: cropped image canvas is empty"
      //   );
    },
    show_user_profile() {
      if (this.$data.active_chat.username) {
        const dataToSend: any = {
          event: "get_chat_full_info",
          chat_id: this.$data.active_chat.chat_id,
          chat_type: this.$data.active_chat.chat_type,
        };
        if (this.$data.active_chat.chat_type === "private") {
          dataToSend.target_username = this.$data.active_chat.username;
        }
        // window.ws.send(JSON.stringify(dataToSend)); FIXME
      }

      this.$set(this.$data.view_user_profile, "show", true);
    },
    submit_send_text_messages() {
      // const input = this.$data.send_text_message_input.trim();
      // this.$set(this.$data, "send_text_message_input", "");
      // if (input != "") {
      //   const ws = window.ws;
      //   if (ws) {
      //     if (this.$data.active_chat.chat_id) {
      //       switch (this.$data.active_chat.chat_type) {
      //         case "private":
      //           ws.send(
      //             JSON.stringify({
      //               event: "send_text_message",
      //               send_text_message_input: input,
      //               chat_id: this.$data.active_chat.chat_id,
      //               target_username: this.$data.active_chat.username,
      //               chat_type: "private",
      //             })
      //           );
      //           break;
      //         case "channel":
      //         case "group":
      //           ws.send(
      //             JSON.stringify({
      //               event: "send_text_message",
      //               send_text_message_input: input,
      //               chat_id: this.$data.active_chat.chat_id,
      //               chat_type: this.$data.active_chat.chat_type,
      //             })
      //           );
      //           break;
      //       }
      //     }
      //   } else {
      //     this.initilizing_socket_again().then(() => {
      //       this.submit_send_text_messages();
      //     });
      //   }
      // }
    },
    join_into_chat() {
      if (this.$data.active_chat.chat_type !== "private") {
        this.getNonJoinedChatsMessage(this.$data.active_chat.chat_id);
        // window.ws.send(
        //   JSON.stringify({
        //     event: "join_to_chat",
        //     chat_id: this.$data.active_chat.chat_id,
        //   })
        // );

        const chatRowExists = this.$store.state.auth.user_info.chats.find(
          ({ localChatId }: { localChatId: string}) => localChatId === this.$data.active_chat.chat_id
        );
        if (!chatRowExists) {
          this.$store.commit("auth/addChat", {
            chat_id: this.$data.active_chat.chat_id,
            chat_type: this.$data.active_chat.chat_type,
            full_name: this.$data.active_chat.full_name,
            username: this.$data.active_chat.username,
            profile_photo: this.$data.active_chat.profile_photo,
            iam_amember_of_chat: true,
          });
        }

        const chatExists =
          this.$store.state.auth.user_info.chats_messages.find(
            ({ _id }: { _id: string }) => _id === this.$data.active_chat.chat_id
          );
        if (!chatExists) {
          this.$store.commit("auth/createNewChat", {
            _id: this.$data.active_chat.chat_id,
            chat_type: this.$data.active_chat.chat_type,
            messages_list: this.$data.active_chat.messages,
            target_username: this.$data.active_chat.username,
          });
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async show_chat(chatId: string, chatLocation: string) {
      // this.$set(this.$data, "chat_is_loading", true);

      // const vm = this;
      // let chat = null;

      // function doGetChatMessages() {
      //   if (
      //     vm.$store.state.auth.user_info.chats_messages &&
      //     vm.$store.state.auth.user_info.chats_messages.length > 0
      //   ) {
      //     const chatsMessages = vm.$store.state.auth.user_info.chats_messages;
      //     if (chatsMessages && chat.sides) {
      //       const findResult = chatsMessages.find(
      //         ({ sides }) =>
      //           sides.user_1 === chat.username || sides.user_2 === chat.username
      //       );
      //       if (findResult && findResult.sides) {
      //         vm.$set(
      //           vm.$data.active_chat,
      //           "messages",
      //           findResult.messages_list
      //         );
      //       } else {
      //         vm.$set(vm.$data.active_chat, "messages", null);
      //       }
      //     } else {
      //       console.log("cant find user.sides -> show_chat event");
      //       vm.$set(vm.$data.active_chat, "messages", null);
      //     }
      //     chat = {
      //       chat_id: chat._id,
      //       username: chat.username,
      //       profile_photo: chat.profile_photo,
      //       full_name: chat.full_name,
      //       chat_type: chat.chat_type,
      //     };

      //     vm.set_the_active_chat(chat);
      //   }

      //   vm.set_the_active_chat(chat);
      // }

      // switch (chatLocation) {
      //   case "chats_list":
      //     chat = this.user_info.chats.find(
      //       ({ chat_id: localChatId }) => localChatId === chatId
      //     );
      //     if (chat && chat.chat_type === "private") {
      //       const msgsList = await this.fetch_chat_messages_list(chatId);
      //       this.$set(this.$data.active_chat, "messages", msgsList);
      //     } else {
      //       const msgsList = await this.fetch_chat_messages_list(chatId);
      //       this.$set(this.$data.active_chat, "messages", msgsList);
      //     }
      //     this.set_the_active_chat(chat);
      //     break;
      //   case "search_chat_result":
      //     chat = this.$data.search_chat_result.find(
      //       ({ _id }) => _id === chatId
      //     );
      //     if (chat.chat_type === "private") {
      //       doGetChatMessages();
      //     } else {
      //       this.getNonJoinedChatsMessage(chatId);
      //       this.set_the_active_chat(chat);
      //     }
      //     break;
      //   case "search_chat_in_local":
      //     chat = this.$data.search_chat_in_local_result.find(
      //       ({ _id }) => _id === chatId
      //     );
      //     if (chat.chat_type === "private") {
      //       doGetChatMessages();
      //     } else {
      //       this.getNonJoinedChatsMessage(chatId);
      //       this.set_the_active_chat(chat);
      //     }
      //     break;

      // if (chat && chat.username && chat.chat_type === "private") {
      //   // window.ws.send( FIXME
      //   //   JSON.stringify({
      //   //     event: "get_last_seen",
      //   //     username: chat.username,
      //   //   })
      //   // );
      // }

      // if (chat.chat_type !== "private") {
      //   this.$set(this.$data.active_chat, "members_length", chat.members);
      // }

      // this.$set(this.$data, "search_chat_input", "");

      // this.$set(this.$data, "show_chat_view", true);
      // this.$set(this.$data, "chat_is_loading", false);},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getNonJoinedChatsMessage(chatIid: string) {
      // ws.send(
      //   JSON.stringify({
      //     event: "get_chat_messages",
      //     chat_id,
      //   })
      // );

      // vm.$set(vm.$data, "chat_is_loading", true);
    },
    // FIXME TYPE
    set_the_active_chat(chat: any) {
      if (chat._id) {
        this.$set(this.$data.active_chat, "chat_id", chat._id);
      }
      if (chat.chat_id) {
        this.$set(this.$data.active_chat, "chat_id", chat.chat_id);
      }
      this.$set(this.$data.active_chat, "username", chat.username);
      this.$set(this.$data.active_chat, "full_name", chat.full_name);
      this.$set(this.$data.active_chat, "profile_photo", chat.profile_photo);
      this.$set(this.$data.active_chat, "chat_type", chat.chat_type);

      if (chat.chat_type !== "private") {
        if (chat.iam_admin_of_chat) {
          this.$set(
            this.$data.active_chat,
            "iam_admin_of_chat",
            chat.iam_admin_of_chat
          );
        } else {
          this.$set(this.$data.active_chat, "iam_admin_of_chat", false);
        }
        if (chat.iam_amember_of_chat) {
          this.$set(
            this.$data.active_chat,
            "iam_amember_of_chat",
            chat.iam_amember_of_chat
          );
        } else {
          this.$set(this.$data.active_chat, "iam_amember_of_chat", false);
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetch_chat_messages_list(chatId: string) {
      // NOTE
      // this method will be work when user clicked on the a chat
      // when it happend... we should going to user_chats_messages and finding the messages for that chat
      // const chatsMessages = this.$store.state.auth.user_info.chats_messages;
      // if (chatsMessages) {
      //   const findResult = chatsMessages.find(({ _id }) => _id === chatId);
      //   if (findResult) {
      //     return findResult.messages_list; // messages of chat
      //   }
      // }
      return null;
    },
    parse_message_date(sendTime: number): String {
      const date = new Date(sendTime);

      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours || 12;
      const finalMinutes = minutes < 10 ? "0" + minutes : minutes;
      const timeString =
        hours + ":" + finalMinutes + " " + String(ampm).toUpperCase();

      return timeString;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    select_message_sender_fullname(messageId: String) {
      ""
      // if (this.$data.active_chat.chat_type === "private") {
      //   return null;
      // } else if (this.$data.active_chat.chat_type === "channel") {
      //   return null;
      // } else {
      //   const chatsMessages = this.$store.state.auth.user_info.chats_messages;
      //   if (
      //     chatsMessages &&
      //     chatsMessages.length > 0 &&
      //     this.$data.active_chat.chat_id
      //   ) {
      //     const chat = chatsMessages.find(
      //       ({ _id }) => _id === this.$data.active_chat.chat_id
      //     );
      //     if (chat) {
      //       const message = chat.messages_list.find(
      //         ({ message_id: localMessageId }) => localMessageId === messageId
      //       );
      //       if (message) {
      //         return message.sender_username;
      //       } else {
      //         console.log(
      //           "cannot find message in select_message_sender_fullname function -> chat.vue"
      //         );
      //       }
      //     } else {
      //       console.log("chat not found on select_message_sender_fullname");
      //     }
      //   }
      // }
    },
    check_if_user_had_profile_photo() {
      if (
        this.$store.state.auth.user_info.profile_photos &&
        this.$store.state.auth.user_info.profile_photos.length > 0
      ) {
        const profilePhoto =
          this.$store.state.auth.user_info.profile_photos[0];
        if (profilePhoto && profilePhoto.filename) {
          const firstPhotoFilename = profilePhoto.filename;
          this.$set(
            this.$data,
            "user_default_avatar",
            this.$axios.defaults.baseURL +
              "/uploads/profile_photos/" +
              firstPhotoFilename
          );
        }
      }
    },
    watch_search_chat_submit() {
      this.$store.watch(
        () => this.$data.search_chat_input,
        (_value) => {
          let chatsList = this.$data.chats_list;
          if (typeof chatsList === "object") {
            chatsList = Array(this.$data.chats_list);
          }
          const input = this.$data.search_chat_input;
          if (input.trim()) {
            if (chatsList) {
              const localSearchResult = chatsList.filter((item: any) => {
                if (
                  String(item.username).includes(input) ||
                  String(item.full_name).includes(input)
                ) {
                  return true;
                }
                return false;
              });
              this.$set(
                this.$data,
                "search_chat_in_local_result",
                localSearchResult
              );
            }
            // const ws = window.ws; FIXME
            // if (ws) {
            //   ws.send(
            //     JSON.stringify({
            //       event: "search_in_chats",
            //       input,
            //     })
            //   );
            // } else {
            //   this.initilizing_socket_again().then(() => {
            //     this.search_chat_submit();
            //   });
            // }
          }
        }
      );
    },
    preview_user_profile() {
      // const list = [];
      // if (this.$data.active_chat.profile_photos) {
      //   this.$data.active_chat.profile_photos.forEach((item) => {
      //     const photoAddr = this.gimme_profile_photo_link_addr(item);
      //     if (photoAddr) {
      //       list.push({
      //         src: photoAddr,
      //       });
      //     }
      //   });
      //   if (list.length > 0) {
      //     this.show_view_image_modal(list, false);
      //   }
      // } else if (this.$data.active_chat.profile_photo) {
      //   const photoAddr = this.gimme_profile_photo_link_addr(
      //     this.$data.active_chat.profile_photo
      //   );
      //   if (photoAddr) {
      //     this.show_view_image_modal(
      //       [
      //         {
      //           src: photoAddr,
      //         },
      //       ],
      //       false
      //     );
      //   }
      // }
    },
    preview_self_profile() {
      // const list: Array<any> = []; // FIXME
      // this.$store.state.auth.user_info.profile_photos.forEach((item) => {
      //   const photoAddr = this.gimme_profile_photo_link_addr(item);
      //   if (photoAddr) {
      //     list.push({
      //       src: photoAddr,
      //       filename: item.filename,
      //     });
      //   }
      //   if (list.length > 0) {
      //     this.show_view_image_modal(list, true);
      //   }
      // });

      // this.show_view_image_modal(list, true);
    },
    // FIXME TYPE
    show_view_image_modal(list: any , showRemoveButton: boolean) {
      this.$set(this.$data.view_image, "list", list);
      this.$set(this.$data.view_image, "show", true);
      this.$set(
        this.$data.view_image,
        "show_remove_button",
        showRemoveButton
      );
    },
    initializing_socket_again() { // FIXME -> Remove this shit method from project
      return new Promise(resolve => {
        setTimeout(() => {
          console.error("socket is empty!");
          // await window.initSocket(); FIXME
          resolve(null);
        }, 1000);
      });
    },
    insertEmoji(emoji: string) {
      this.$set(this.$data, "send_text_message_input", this.$data.send_text_message_input + emoji)
    },
    show_contextmenu_of_message(e: any, messageId: string) {
      e.preventDefault();
      this.$set(this.$data, "message_context_menu_message_id", messageId);
      this.$set(this.$data.context_menu_for_messages, "show", false);
      this.$set(this.$data.context_menu_for_messages, "x", e.clientX);
      this.$set(this.$data.context_menu_for_messages, "y", e.clientY);
      this.$nextTick(() => {
        this.$set(this.$data.context_menu_for_messages, "show", true);
      });
    },
    leaving_chat_button() {
      this.$set(this.$data, "show_chat_view", false);
    },
    handle_escape_button() {
      const vm = this;
      document.addEventListener("keydown", (e) => {
        if (e.code === "Escape") {
          if (vm.$data.show_nav_drawer === true) {
            return vm.$set(vm.$data, "show_nav_drawer", false);
          } else if (vm.$data.view_image.show === true) {
            return vm.$set(vm.$data.view_image, "show", false);
          } else if (vm.$data.settings_dialog_active_section !== "home") {
            return vm.$set(vm.$data, "settings_dialog_active_section", "home");
          } else if (vm.$data.show_settings_dialog === true) {
            return vm.$set(vm.$data, "show_settings_dialog", false);
          } else if (vm.$data.show_chat_view === true) {
            vm.$set(vm.$data.active_chat, "chat_id", null);
            vm.$set(vm.$data.active_chat, "username", null);
            vm.$set(vm.$data.active_chat, "full_name", null);
            vm.$set(vm.$data.active_chat, "messages", null);
            vm.$set(vm.$data.active_chat, "profile_photo", null);
            return vm.$set(vm.$data, "show_chat_view", false);
          }
        }
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handle_upload_profile_photo(e: Event) {
      // const file = e.files[0];
      // const local_path = URL.createObjectURL(file);
      // this.$set(this.$data.crop_profile_photo, "src", local_path);
      // this.$set(this.$data.crop_profile_photo, "show", true);
    },
    upload_cropped_profile_photo() {
      // this.$set(this.$data.crop_profile_photo, "button_loading_state", true);
      // this.$set(this.$data.crop_profile_photo, "show", false);

      // const canvas = this.$data.crop_profile_photo.canvas;
      // if (canvas) {
      //   const croppedImage = canvas.toDataURL("image/png");
      //   const imageFile = window.dataURLtoFile(croppedImage, "profile_photo");
      //   if (imageFile) {
      //     if (vm.username && vm.$store.state.auth.auth.auth_token) {
      //       const request_body = new FormData();
      //       request_body.append("photo", imageFile);

      //       this.$set(this.$data, "photo_uploading_state", true);

      //       this.$axios
      //         .$post("/api/profile_photos/upload_photo", request_body, {
      //           headers: {
      //             username: vm.username,
      //             auth_token: vm.$store.state.auth.auth.auth_token,
      //           },
      //         })
      //         .then((response) => {
      //           if (response.message == "profile photo uploaded") {
      //             this.$store.commit(
      //               "auth/addProfilePhoto",
      //               response.profile_photo_filename
      //             );
      //             this.$set(
      //               this.$data,
      //               "user_default_avatar",
      //               this.gimme_profile_photo_link_addr({
      //                 filename: response.profile_photo_filename,
      //               })
      //             );
      //           }
      //         })
      //         .catch((error) => {
      //           console.log(error);
      //           this.error_occurred();
      //         })
      //         .finally(() => {
      //           this.$set(
      //             this.$data.crop_profile_photo,
      //             "button_loading_state",
      //             false
      //           );
      //           this.$set(this.$data, "photo_uploading_state", false);
      //         });
      //     } else {
      //       console.log(
      //         "username or auth_token not found on sending photo as message"
      //       );
      //     }
      //   } else {
      //     console.log("no profile photo to upload");
      //   }
      // } else
      //   console.log(
      //     "uploading profile photo failed! :: cropped image canvas is empty"
      //   );
    },
    watch_profile_photos_change() {
      // if (this.$store.state.auth.user_info) {
      //   this.$store.watch(
      //     (state) => state.auth.user_info,
      //     (value) => {
      //       if (
      //         value &&
      //         value.profile_photos &&
      //         value.profile_photos.length > 0
      //       ) {
      //         this.$set(
      //           this.$data,
      //           "user_default_avatar",
      //           this.gimme_profile_photo_link_addr(value.profile_photos[0])
      //         );
      //       }
      //     }
      //   );
      // }
    },
    watch_user_info_changes() {
      if (this.$store.state.auth.user_info) {
        this.$store.watch(
          (state) => state.auth.user_info,
          (value) => {
            try {
              if (value && value[0].filename) {
                this.$set(this.$data, "user_info", value);
              }
            } catch {}
          }
        );
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    crop_profile_photo_onchange({ coordinates, canvas }: IImageCropperCallback) {
      this.$set(this.$data.crop_profile_photo, "canvas", canvas);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    crop_media_to_send_onchange({ coordinates, canvas }: IImageCropperCallback) {
      this.$set(this.$data.crop_media_to_send, "canvas", canvas);
    },
    delete_message() {
      // const message_id = this.$data.message_context_menu_message_id;
      // const chat_id = this.$data.active_chat.chat_id;
      // if (message_id && chat_id) {
      //   ws.send(
      //     JSON.stringify({
      //       event: "delete_message",
      //       chat_id,
      //       message_id,
      //     })
      //   );
      // }
    },
    logout() {
      this.$router.push({ path: "/" + this.$i18n.locale + "/logout" });
    },
    error_occurred() {
      this.$set(this.$data, "show_error_snakbar", true);
    },
  },
});
</script>

<style lang="scss">
.theme--dark.v-icon.icon {
  color: #707579;
}
.avatar {
  cursor: pointer;
  --size: 80px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  overflow: hidden;
  &.avatar_xlarge {
    --size: 110px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
