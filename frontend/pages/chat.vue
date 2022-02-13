<template>
  <div>
    <ViewImage
      :images_list="view_image.list"
      :show="view_image.show"
      v-on:close_button="view_image.show = false"
      v-on:remove_button="remove_profile_photo"
      :show_remove_button="view_image.show_remove_button"
    ></ViewImage>

    <NavDrawer
      :show="show_nav_drawer"
      :user_info="user_info"
      :user_default_avatar="user_default_avatar"
      v-on:logout="logout"
      v-on:show_settings_dialog="
        show_nav_drawer = false;
        show_settings_dialog = true;
      "
      v-on:show_create_channel_dialog="
        show_nav_drawer = false;
        show_create_channel_dialog = true;
      "
      v-on:show_create_group_dialog="
        show_nav_drawer = false;
        show_create_group_dialog = true;
      "
      v-on:update:show="(new_value) => (show_nav_drawer = new_value)"
    ></NavDrawer>

    <SettingsDialog
      :show="show_settings_dialog"
      :user_default_avatar="user_default_avatar"
      :user_info="user_info"
      :active_section="settings_dialog_active_section"
      :photo_uploading_state="photo_uploading_state"
      v-on:initilizing_socket_again="initilizing_socket_again"
      v-on:preview_self_profile="preview_self_profile"
      v-on:update:show="(new_value) => (show_settings_dialog = new_value)"
    ></SettingsDialog>

    <v-dialog max-width="350" v-model="crop_profile_photo.show">
      <div class="pa-5 pb-0">
        <cropper
          :src="crop_profile_photo.src"
          @change="crop_profile_photo_onchange"
          :stencil-size="{
            width: 280,
            height: 280,
          }"
        />
        <v-card-actions class="pr-0">
          <v-spacer></v-spacer>
          <v-btn
            :color="theme_color"
            text
            @click="crop_profile_photo.show = false"
          >
            CANCEL
          </v-btn>
          <v-btn
            :color="theme_color"
            text
            @click="upload_croped_profile_photo"
            :loading="crop_profile_photo.button_loading_state"
          >
            SAVE
          </v-btn>
        </v-card-actions>
      </div>
    </v-dialog>

    <v-dialog max-width="350" v-model="crop_media_to_send.show">
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
            :color="theme_color"
            text
            @click="crop_media_to_send.show = false"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            :color="theme_color"
            text
            @click="upload_croped_media_to_send"
            :loading="crop_media_to_send.button_loading_state"
          >
            {{ $t("send") }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-dialog>

    <CreateChannelDialog
      :show="show_create_channel_dialog"
      v-on:close_button="show_create_channel_dialog = false"
      v-on:update:show="(new_value) => (show_create_channel_dialog = new_value)"
      v-on:chat_created="a_channel_or_group_chat_created"
    ></CreateChannelDialog>

    <CreateGroupDialog
      :show="show_create_group_dialog"
      v-on:close_button="show_create_group_dialog = false"
      v-on:update:show="(new_value) => (show_create_group_dialog = new_value)"
      v-on:chat_created="a_channel_or_group_chat_created"
    ></CreateGroupDialog>

    <ViewUserProfile
      :show.sync="view_user_profile.show"
      :user_default_avatar="
        gimme_profile_photo_link_addr(active_chat.profile_photo)
      "
      :active_chat="active_chat"
      v-on:preview_self_profile="preview_user_profile"
      v-on:update:show="(new_value) => (view_user_profile.show = new_value)"
      v-on:view_member_profile="view_member_profile"
      v-on:remove_button="remove_profile_photo"
    ></ViewUserProfile>

    <div class="pa-0" id="main_container">
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
                type="text"
                class="custom_input pr-9"
                placeholder="Search"
                v-model="search_chat_input"
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
          <div class="internet_bar" v-if="updating_user_info_state">
            <v-progress-circular
              class="d-inline-block mr-4"
              indeterminate
            ></v-progress-circular>
            Updating...
          </div>
          <div
            class="internet_bar"
            v-else-if="$nuxt.isOffline || show_internet_bar"
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
                @click_event="show_chat(item.chat_id, 'chats_list')"
                :chat_name="item.full_name"
                :active_chat="item.chat_id == active_chat.chat_id"
                :image_url="gimme_profile_photo_link_addr(item.profile_photo)"
                :last_message="gimme_last_message(item.chat_id)"
              ></ChatRow>
            </template>
            <ThereIsNothing v-else />
          </template>
          <template v-else-if="!show_internet_bar && search_chat_result">
            <span class="chat_row_badge">Global search</span>
            <ChatRow
              v-for="(item, index) in search_chat_result"
              :key="index"
              @click_event="show_chat(item._id, 'search_chat_result')"
              :chat_name="item.full_name"
              :image_url="gimme_profile_photo_link_addr(item.profile_photo)"
              :last_message="gimme_last_message(item.chat_id)"
            ></ChatRow>
            <template v-if="search_chat_in_local_result">
              <span class="chat_row_badge mt-5">Local search</span>
              <ChatRow
                v-for="(item, index) in search_chat_in_local_result"
                :key="index + item.username"
                @click_event="show_chat(item._id, 'search_chat_in_local')"
                :chat_name="item.full_name"
                :image_url="gimme_profile_photo_link_addr(item.profile_photo)"
                :last_message="gimme_last_message(item.chat_id)"
              ></ChatRow>
            </template>
          </template>
        </div>

        <div class="chat_view" v-bind:class="{ show: show_chat_view }">
          <template v-if="show_chat_view">
            <div class="section_header border px-3">
              <div
                class="d-flex align-center justify-space-between"
                style="height: 100%"
              >
                <v-btn
                  @click="leaving_chat_button"
                  icon
                  depressed
                  large
                  class="mr-3"
                  id="back_button_from_chat"
                >
                  <v-icon> mdi-arrow-left </v-icon>
                </v-btn>
                <div
                  @click="show_user_profile"
                  class="d-flex align-center text-decoration-none mr-5"
                  style="width: 100%"
                >
                  <div
                    class="image"
                    v-if="
                      active_chat.profile_photo &&
                      active_chat.profile_photo.filename
                    "
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
                      :dir="this.$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
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
                  <v-menu offset-y transition="slide-y-transition">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="gray"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        icon
                        large
                      >
                        <v-icon color="grey"> mdi-dots-vertical </v-icon>
                      </v-btn>
                    </template>
                    <v-list style="width: 220px">
                      <v-list-item v-ripple>
                        <v-list-item-title>Mute</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-ripple>
                        <v-list-item-title class="text-red"
                          >Delete Chat</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </div>

            <div class="splash_screen absolute" v-if="chat_is_loading">
              <div class="center">
                <v-progress-circular
                  class="mb-2 d-block"
                  indeterminate
                  :color="theme_color"
                ></v-progress-circular>
              </div>
            </div>

            <div class="messages-scroll">
              <div
                class="messages_list"
                v-if="
                  active_chat.messages &&
                  active_chat.messages.length > 0 &&
                  active_chat.username &&
                  active_chat.full_name
                "
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
                      v-ripple
                      v-if="
                        active_chat.chat_type == 'private' ||
                        active_chat.chat_type == 'group' ||
                        active_chat.iam_admin_of_chat == true
                      "
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
                      v-ripple
                      @click="delete_message"
                      v-if="
                        active_chat.chat_type == 'private' ||
                        active_chat.iam_admin_of_chat == true ||
                        its_my_message()
                      "
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
                    @contextmenu.native="
                      show_contextmenu_of_message($event, item.message_id)
                    "
                    :sender="select_message_sender_fullname(item.message_id)"
                    :send_time="parse_message_date(item.send_time)"
                    :text_content="item.content"
                    :edited="item.edited"
                    :my_message="item.sender_username == user_info.username"
                    :seen_state="item.seen_state"
                  ></TextMessage>
                  <ImageMessage
                    v-else-if="item.message_type == 'photo'"
                    :key="index"
                    :message_id="item.message_id"
                    @contextmenu.native="
                      show_contextmenu_of_message($event, item.message_id)
                    "
                    :sender="select_message_sender_fullname(item.message_id)"
                    :send_time="parse_message_date(item.send_time)"
                    :text_content="item.caption"
                    :image_address="
                      gimme_photo_message_link_addr(item.filename)
                    "
                    :my_message="item.sender_username == user_info.username"
                    :edited="item.edited"
                    :seen_state="item.seen_state"
                    v-on:click="
                      view_photo_message_as_full_screen(item.filename)
                    "
                  ></ImageMessage>
                  <div
                    class="text-center"
                    v-else-if="item.message_type == 'join'"
                    :key="index"
                  >
                    <span
                      class="badge_message"
                      :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
                      ><a @click="search_chat_input = item.username">{{
                        item.username
                      }}</a>
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
              class="send_message_section"
              v-if="
                active_chat.chat_type == 'private' ||
                (active_chat.chat_type == 'group' &&
                  active_chat.iam_amember_of_chat) ||
                active_chat.iam_admin_of_chat
              "
            >
              <div class="send_box">
                <v-btn
                  id="send_media_button"
                  :color="theme_color"
                  dark
                  icon
                  x-large
                  style="overflow: hidden"
                >
                  <input
                    type="file"
                    id="send_media_input"
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
                  <v-icon small :color="theme_color"> mdi-image </v-icon>
                </v-btn>

                <v-text-field
                  id="send_message_textbox"
                  v-model="send_text_message_input"
                  aria-multiline="true"
                  class="rounded-pill"
                  solo
                  :placeholder="$t('write_message')"
                  v-on:keypress.enter="submit_send_text_messages()"
                  :dir="this.$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
                ></v-text-field>

                <emoji-picker class="emoji_picker" @emoji="insert">
                  <div
                    slot="emoji-invoker"
                    slot-scope="{ events: { click: clickEvent } }"
                    @click.stop="clickEvent"
                  >
                    <v-btn
                      id="emojies_button"
                      :color="theme_color"
                      dark
                      icon
                      x-large
                    >
                      <v-icon small :color="theme_color"> mdi-emoticon </v-icon>
                    </v-btn>
                  </div>
                  <div slot="emoji-picker" slot-scope="{ emojis, insert }">
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
                                class="emoji_span"
                                v-for="(emoji, emojiName) in emojiGroup"
                                :key="emojiName"
                                @click="insert(emoji)"
                                :title="emojiName"
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
                  @click="submit_send_text_messages"
                  :color="theme_color"
                  dark
                  icon
                  x-large
                  :disabled="send_text_message_input.trim().length == 0"
                >
                  <v-icon class="pl-1" small :color="theme_color">
                    mdi-send
                  </v-icon>
                </v-btn>
              </div>
            </div>
            <v-btn
              height="65"
              depressed
              v-else-if="active_chat.iam_amember_of_chat"
              class="bottom_full_bar rounded-0"
            >
              MUTE
            </v-btn>
            <v-btn
              @click="join_into_chat"
              height="65"
              depressed
              v-else
              class="bottom_full_bar rounded-0"
            >
              JOIN
            </v-btn>
          </template>
          <div id="no_chat_selected">
            <span class="badge_message rtl">{{ $t("no_chat_selected") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EmojiPicker } from "vue-emoji-picker";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import configs from "@/assets/javascript/configs";
import ViewUserProfile from "../components/view_user_profile.vue";
import link_addrs from "~/mixins/link_addrs.js";
import parse_last_seen from "~/mixins/parse_last_seen.js";

export default {
  mixins: [link_addrs, parse_last_seen],
  data() {
    return {
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
  mounted() {
    this.$nextTick(async function () {
      await window.initSocket();
    });

    this.check_if_user_had_profile_photo();
    this.handle_escape_button();
    this.watch_profile_photos_change();
    this.watch_user_info_changes();
    this.watch_search_chat_submit();

    window.upload_profile_photo = this.handle_upload_profile_photo;
    window.select_photo_to_send = this.select_photo_to_send;
    window.vm = this;

    window.update_user_info = this.update_user_info;

    this.watch_internet_state_changes();
  },
  methods: {
    remove_profile_photo(filename) {
      if (filename && filename.length > 0) {
        this.$axios
          .$post(
            "/api/profile_photos/remove_profile_photo",
            {
              filename: filename,
            },
            {
              headers: {
                auth_token: this.$store.state.auth.auth.auth_token,
                username: this.username,
              },
            }
          )
          .then((response) => {
            if (response.message == "profile_photo removed") {
              this.$store.commit("auth/removeProfilePhoto", filename);
            }
            this.$set(
              this.$data.view_image,
              "list",
              this.$store.state.auth.user_info.profile_photos
            );
            const def_prof = this.$store.state.auth.user_info.profile_photos[0];
            this.$set(
              this.$data,
              "user_default_avatar",
              this.gimme_profile_photo_link_addr(def_prof)
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    its_my_message() {
      const chats_messages = this.$store.state.auth.user_info.chats_messages;
      const chat_id = this.$data.active_chat.chat_id;
      if (
        chat_id &&
        chat_id.length > 0 &&
        this.$data.message_context_menu_message_id
      ) {
        const chat = chats_messages.find(({ _id }) => _id == chat_id);
        if (chat) {
          const message = chat.messages_list.find(
            ({ message_id }) =>
              message_id == this.$data.message_context_menu_message_id
          );
          if (message) {
            if (message.sender_username == this.username) {
              return true;
            } else {
              return false;
            }
          }
        }
      }
    },
    view_photo_message_as_full_screen(filename) {
      const photo_addr = this.gimme_photo_message_link_addr(filename);
      this.show_view_image_modal(
        [
          {
            src: photo_addr,
          },
        ],
        false
      );
    },
    view_member_profile(username) {
      if (username == this.username) {
        this.$set(this.$data, "show_settings_dialog", true);
      } else {
        this.$set(this.$data, "search_chat_input", username);
        this.$set(this.$data.view_user_profile, "show", false);
      }
    },
    copy_message_to_clipboard() {
      const message_id = this.$data.message_context_menu_message_id;
      if (
        this.$data.active_chat.messages &&
        this.$data.active_chat.messages.length > 0 &&
        message_id
      ) {
        const message = this.$data.active_chat.messages.find(
          ({ message_id: _message_id }) => _message_id === message_id
        );
        if (message) {
          navigator.clipboard.writeText(message.content);
        }
      }
    },
    gimme_last_message(chat_id) {
      const chats_messages = this.$store.state.auth.user_info.chats_messages;
      if (chats_messages) {
        const chat = chats_messages.find(({ _id: _id }) => _id === chat_id);
        if (chat && chat.messages_list && chat.messages_list.length > 0) {
          const message = chat.messages_list[chat.messages_list.length - 1];
          if (message) {
            const message_type = message.message_type;
            if (message_type == "text") {
              return message.content.substr(0, 30);
            }
            if (message_type == "photo") {
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
          if (value == false) {
            this.update_user_info();
          }
        }
      );
    },
    async update_user_info() {
      this.$set(this.$data, "updating_user_info_state", true);
      await window.vm.$store
        .dispatch("auth/Authenticate")
        .then(
          (user_data) => {
            console.log("Updating user info...");

            console.log("logging in with saved tokens");

            window.vm.$store.commit("auth/setUserData", user_data);
            window.vm.$store.commit("auth/setChatsList", user_data.chats);

            // TODO
            // update the messages of active_chat
          },
          () => {
            console.log("login with saved tokens failed!");
          }
        )
        .catch((err) => {
          console.log(err);
          return window.vm.$router.push({ path: "/500" });
        })
        .finally(() => {
          this.$set(this.$data, "updating_user_info_state", false);
        });
    },
    a_channel_or_group_chat_created(chat) {
      window.ws.close(); // FIXME - i cannot find a really important bug in this section
      // problem deatail : users cannot send message after creating a new_channel
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
      const local_path = URL.createObjectURL(file);
      this.$set(this.$data.crop_media_to_send, "src", local_path);
      this.$set(this.$data.crop_media_to_send, "show", true);
    },
    upload_croped_media_to_send() {
      this.$set(this.$data.crop_media_to_send, "button_loading_state", true);
      this.$set(this.$data.crop_media_to_send, "show", false);

      const canvas = this.$data.crop_media_to_send.canvas;
      if (canvas) {
        const croppedImage = canvas.toDataURL("image/png");
        const imageFile = window.dataURLtoFile(croppedImage, "photo_message");
        if (imageFile && this.$data.active_chat.chat_id) {
          const request_body = new FormData();
          request_body.append("photo", imageFile);
          request_body.append("chat_id", this.$data.active_chat.chat_id);
          request_body.append("chat_type", this.$data.active_chat.chat_type);
          if (
            this.$data.media_to_send_caption &&
            this.$data.media_to_send_caption.trim().length > 0
          ) {
            request_body.append("caption", this.$data.media_to_send_caption);
          }
          if (this.$data.active_chat.chat_type == "private") {
            request_body.append(
              "target_username",
              this.$data.active_chat.username
            );
          }

          this.$axios
            .$post("/api/messages/new_photo_message", request_body, {
              headers: {
                username: this.$store.state.auth.auth.username,
                auth_token: this.$store.state.auth.auth.auth_token,
              },
            })
            .then((response) => {})
            .catch((error) => {
              console.error(error.response);
            });
          this.$set(
            this.$data.crop_media_to_send,
            "button_loading_state",
            false
          );
        } else {
          console.log("no photo to upload");
        }
      } else
        console.log(
          "uploading photo_message failed! :: cropped image canvas is empty"
        );
    },
    show_user_profile() {
      if (this.$data.active_chat.username) {
        let data_to_send = {
          event: "get_chat_full_info",
          chat_id: this.$data.active_chat.chat_id,
          chat_type: this.$data.active_chat.chat_type,
        };
        console.log(data_to_send);
        if (this.$data.active_chat.chat_type == "private") {
          data_to_send.target_username = this.$data.active_chat.username;
        }
        window.ws.send(JSON.stringify(data_to_send));
      }

      this.$set(this.$data.view_user_profile, "show", true);
    },
    submit_send_text_messages() {
      const input = this.$data.send_text_message_input.trim();
      this.$set(this.$data, "send_text_message_input", "");
      if (input != "") {
        const ws = window.ws;
        if (ws) {
          if (this.$data.active_chat.chat_id) {
            switch (this.$data.active_chat.chat_type) {
              case "private":
                ws.send(
                  JSON.stringify({
                    event: "send_text_message",
                    send_text_message_input: input,
                    chat_id: this.$data.active_chat.chat_id,
                    target_username: this.$data.active_chat.username,
                    chat_type: "private",
                  })
                );
                break;
              case "channel":
              case "group":
                ws.send(
                  JSON.stringify({
                    event: "send_text_message",
                    send_text_message_input: input,
                    chat_id: this.$data.active_chat.chat_id,
                    chat_type: this.$data.active_chat.chat_type,
                  })
                );
                break;
            }
          }
        } else {
          this.initilizing_socket_again().then(() => {
            this.submit_send_text_messages();
          });
        }
      }
    },
    join_into_chat() {
      if (this.$data.active_chat.chat_type != "private") {
        this.getNonJoinedChatsMessage(this.$data.active_chat.chat_id);

        window.ws.send(
          JSON.stringify({
            event: "join_to_chat",
            chat_id: this.$data.active_chat.chat_id,
          })
        );

        const chat_row_exists = this.$store.state.auth.user_info.chats.find(
          ({ chat_id }) => chat_id === this.$data.active_chat.chat_id
        );
        if (!chat_row_exists) {
          this.$store.commit("auth/addChat", {
            chat_id: this.$data.active_chat.chat_id,
            chat_type: this.$data.active_chat.chat_type,
            full_name: this.$data.active_chat.full_name,
            username: this.$data.active_chat.username,
            profile_photo: this.$data.active_chat.profile_photo,
            iam_amember_of_chat: true,
          });
        }

        const chat_exists =
          this.$store.state.auth.user_info.chats_messages.find(
            ({ _id }) => _id === this.$data.active_chat.chat_id
          );
        if (!chat_exists) {
          this.$store.commit("auth/createNewChat", {
            _id: this.$data.active_chat.chat_id,
            chat_type: this.$data.active_chat.chat_type,
            messages_list: this.$data.active_chat.messages,
            target_username: this.$data.active_chat.username,
          });
        }
      }
    },
    async show_chat(chat_id, chat_location) {
      this.$set(this.$data, "chat_is_loading", true);

      const vm = this;
      let chat = null;

      function doGetChatMessages() {
        if (
          vm.$store.state.auth.user_info.chats_messages &&
          vm.$store.state.auth.user_info.chats_messages.length > 0
        ) {
          const chats_messages = vm.$store.state.auth.user_info.chats_messages;
          if (chats_messages && chat.sides) {
            const find_result = chats_messages.find(
              ({ sides }) =>
                sides.user_1 === chat.username || sides.user_2 === chat.username
            );
            if (find_result && find_result.sides) {
              vm.$set(
                vm.$data.active_chat,
                "messages",
                find_result.messages_list
              );
            } else {
              vm.$set(vm.$data.active_chat, "messages", null);
            }
          } else {
            console.log("cant find user.sides -> show_chat event");
            vm.$set(vm.$data.active_chat, "messages", null);
          }
          chat = {
            chat_id: chat._id,
            username: chat.username,
            profile_photo: chat.profile_photo,
            full_name: chat.full_name,
            chat_type: chat.chat_type,
          };

          vm.set_the_active_chat(chat);
        }

        vm.set_the_active_chat(chat);
      }

      switch (chat_location) {
        case "chats_list":
          chat = this.user_info.chats.find(
            ({ chat_id: _chat_id_ }) => _chat_id_ == chat_id
          );
          if (chat && chat.chat_type == "private") {
            const msgs_list = await this.fetch_chat_messages_list(chat_id);
            this.$set(this.$data.active_chat, "messages", msgs_list);
          } else {
            const msgs_list = await this.fetch_chat_messages_list(chat_id);
            this.$set(this.$data.active_chat, "messages", msgs_list);
          }
          this.set_the_active_chat(chat);
          break;
        case "search_chat_result":
          chat = this.$data.search_chat_result.find(
            ({ _id }) => _id == chat_id
          );
          if (chat.chat_type == "private") {
            doGetChatMessages();
          } else {
            this.getNonJoinedChatsMessage(chat_id);
            this.set_the_active_chat(chat);
          }
          break;
        case "search_chat_in_local":
          chat = this.$data.search_chat_in_local_result.find(
            ({ _id }) => _id == chat_id
          );
          if (chat.chat_type == "private") {
            doGetChatMessages();
          } else {
            this.getNonJoinedChatsMessage(chat_id);
            this.set_the_active_chat(chat);
          }
          break;
      }

      if (chat && chat.username && chat.chat_type == "private") {
        window.ws.send(
          JSON.stringify({
            event: "get_last_seen",
            username: chat.username,
          })
        );
      }

      if (chat.chat_type != "private") {
        this.$set(this.$data.active_chat, "members_length", chat.members);
      }

      this.$set(this.$data, "search_chat_input", "");

      this.$set(this.$data, "show_chat_view", true);
      this.$set(this.$data, "chat_is_loading", false);
    },
    getNonJoinedChatsMessage(chat_id) {
      ws.send(
        JSON.stringify({
          event: "get_chat_messages",
          chat_id: chat_id,
        })
      );

      vm.$set(vm.$data, "chat_is_loading", true);
    },
    set_the_active_chat(chat) {
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

      if (chat.chat_type != "private") {
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
    fetch_chat_messages_list(chat_id) {
      // NOTE
      // this method will be work when user clicked on the a chat
      // when it happend... we should going to user_chats_messages and finding the messages for that chat
      const chats_messages = this.$store.state.auth.user_info.chats_messages;
      if (chats_messages) {
        const find_result = chats_messages.find(({ _id }) => _id === chat_id);
        if (find_result) {
          return find_result.messages_list; // messages of chat
        }
      }
      return null;
    },
    parse_message_date(send_time) {
      const date = new Date(send_time);

      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let time_string =
        hours + ":" + minutes + " " + String(ampm).toUpperCase();

      return time_string;
    },
    select_message_sender_fullname(message_id) {
      if (this.$data.active_chat.chat_type == "private") {
        return null;
      } else if (this.$data.active_chat.chat_type == "channel") {
        return null;
      } else {
        const chats_messages = this.$store.state.auth.user_info.chats_messages;
        if (
          chats_messages &&
          chats_messages.length > 0 &&
          this.$data.active_chat.chat_id
        ) {
          const chat = chats_messages.find(
            ({ _id }) => _id === this.$data.active_chat.chat_id
          );
          if (chat) {
            const message = chat.messages_list.find(
              ({ message_id: _message_id }) => _message_id === message_id
            );
            if (message) {
              return message.sender_username;
            } else {
              console.log(
                "cannot find message in select_message_sender_fullname function -> chat.vue"
              );
            }
          } else {
            console.log("chat not found on select_message_sender_fullname");
          }
        }
      }
    },
    check_if_user_had_profile_photo() {
      if (
        this.$store.state.auth.user_info.profile_photos &&
        this.$store.state.auth.user_info.profile_photos.length > 0
      ) {
        const profile_photo =
          this.$store.state.auth.user_info.profile_photos[0];
        if (profile_photo && profile_photo.filename) {
          const first_photo_filename = profile_photo.filename;
          this.$set(
            this.$data,
            "user_default_avatar",
            this.$axios.defaults.baseURL +
              "/uploads/profile_photos/" +
              first_photo_filename
          );
        }
      }
    },
    watch_search_chat_submit() {
      this.$store.watch(
        () => this.$data.search_chat_input,
        (value) => {
          let chats_list = this.$data.chats_list;
          if (typeof chats_list == Object) {
            chats_list = Array(this.$data.chats_list);
          }
          const input = this.$data.search_chat_input;
          if (input.trim()) {
            if (chats_list) {
              const local_search_result = chats_list.filter((item) => {
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
                local_search_result
              );
            }
            const ws = window.ws;
            if (ws) {
              ws.send(
                JSON.stringify({
                  event: "search_in_chats",
                  input: input,
                })
              );
            } else {
              this.initilizing_socket_again().then(() => {
                this.search_chat_submit();
              });
            }
          }
        }
      );
    },
    preview_user_profile() {
      let list = [];
      if (this.$data.active_chat.profile_photos) {
        this.$data.active_chat.profile_photos.forEach((item) => {
          const photo_addr = this.gimme_profile_photo_link_addr(item);
          if (photo_addr) {
            list.push({
              src: photo_addr,
            });
          }
        });
        if (list.length > 0) {
          this.show_view_image_modal(list, false);
        }
      } else if (this.$data.active_chat.profile_photo) {
        const photo_addr = this.gimme_profile_photo_link_addr(
          this.$data.active_chat.profile_photo
        );
        if (photo_addr) {
          this.show_view_image_modal(
            [
              {
                src: photo_addr,
              },
            ],
            false
          );
        }
      }
    },
    preview_self_profile() {
      let list = [];
      this.$store.state.auth.user_info.profile_photos.forEach((item) => {
        const photo_addr = this.gimme_profile_photo_link_addr(item);
        if (photo_addr) {
          list.push({
            src: photo_addr,
            filename: item.filename,
          });
        }
        if (list.length > 0) {
          this.show_view_image_modal(list, true);
        }
      });

      this.show_view_image_modal(list, true);
    },
    show_view_image_modal(list, show_remove_button) {
      this.$set(this.$data.view_image, "list", list);
      this.$set(this.$data.view_image, "show", true);
      this.$set(
        this.$data.view_image,
        "show_remove_button",
        show_remove_button
      );
    },
    initilizing_socket_again() {
      return new Promise((resolve) => {
        setTimeout(async () => {
          console.error("socket is empty!");
          await window.initSocket();
          resolve();
        }, 1000);
      });
    },
    insert(emoji) {
      this.send_text_message_input += emoji;
    },
    show_contextmenu_of_message(e, message_id) {
      e.preventDefault();
      this.$set(this.$data, "message_context_menu_message_id", message_id);
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
      let vm = this;
      document.addEventListener("keydown", (e) => {
        if (e.code == "Escape") {
          if (vm.$data.show_nav_drawer == true) {
            return vm.$set(vm.$data, "show_nav_drawer", false);
          } else if (vm.$data.view_image.show == true) {
            return vm.$set(vm.$data.view_image, "show", false);
          } else if (vm.$data.settings_dialog_active_section != "home") {
            return vm.$set(vm.$data, "settings_dialog_active_section", "home");
          } else if (vm.$data.show_settings_dialog == true) {
            return vm.$set(vm.$data, "show_settings_dialog", false);
          } else if (vm.$data.show_chat_view == true) {
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
    handle_upload_profile_photo(e) {
      const file = e.files[0];
      const local_path = URL.createObjectURL(file);
      this.$set(this.$data.crop_profile_photo, "src", local_path);
      this.$set(this.$data.crop_profile_photo, "show", true);
    },
    upload_croped_profile_photo() {
      this.$set(this.$data.crop_profile_photo, "button_loading_state", true);
      this.$set(this.$data.crop_profile_photo, "show", false);

      const canvas = this.$data.crop_profile_photo.canvas;
      if (canvas) {
        const croppedImage = canvas.toDataURL("image/png");
        const imageFile = window.dataURLtoFile(croppedImage, "profile_photo");
        if (imageFile) {
          const request_body = new FormData();
          request_body.append("photo", imageFile);

          this.$set(this.$data, "photo_uploading_state", true);

          this.$axios
            .$post("/api/profile_photos/upload_photo", request_body, {
              headers: {
                username: this.$store.state.auth.auth.username,
                auth_token: this.$store.state.auth.auth.auth_token,
              },
            })
            .then((response) => {
              if (response.message == "profile photo uploaded") {
                this.$store.commit(
                  "auth/addProfilePhoto",
                  response.profile_photo_filename
                );
                this.$set(
                  this.$data,
                  "user_default_avatar",
                  this.gimme_profile_photo_link_addr({
                    filename: response.profile_photo_filename,
                  })
                );
              }
            })
            .catch((error) => {
              this.$router.push({ path: "/500" });
            })
            .finally(() => {
              this.$set(
                this.$data.crop_profile_photo,
                "button_loading_state",
                false
              );
              this.$set(this.$data, "photo_uploading_state", false);
            });
        } else {
          console.log("no profile photo to upload");
        }
      } else
        console.log(
          "uploading profile photo failed! :: cropped image canvas is empty"
        );
    },
    watch_profile_photos_change() {
      if (this.$store.state.auth.user_info) {
        this.$store.watch(
          (state) => state.auth.user_info,
          (value) => {
            if (
              value &&
              value.profile_photos &&
              value.profile_photos.length > 0
            ) {
              this.$set(
                this.$data,
                "user_default_avatar",
                this.gimme_profile_photo_link_addr(value.profile_photos[0])
              );
            }
          }
        );
      }
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
    crop_profile_photo_onchange({ coordinates, canvas }) {
      this.$set(this.$data.crop_profile_photo, "canvas", canvas);
    },
    crop_media_to_send_onchange({ coordinates, canvas }) {
      this.$set(this.$data.crop_media_to_send, "canvas", canvas);
    },
    delete_message() {
      const message_id = this.$data.message_context_menu_message_id;
      const chat_id = this.$data.active_chat.chat_id;
      if (message_id && chat_id) {
        ws.send(
          JSON.stringify({
            event: "delete_message",
            chat_id: chat_id,
            message_id: message_id,
          })
        );
      }
    },
    logout() {
      this.$router.push({ path: "/" + this.$i18n.locale + "/logout" });
    },
  },
  computed: {
    username() {
      return this.$store.state.auth.auth.username;
    },
    user_info() {
      return this.$store.state.auth.user_info;
    },
  },
  name: "chat",
  middleware: ["need_auth"],
  components: {
    EmojiPicker,
    Cropper,
    ViewUserProfile,
  },
};
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
