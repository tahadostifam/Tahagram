<template>
  <div>
    <div id="view_image" v-if="view_image.show">
      <div class="controls">
        <div
          class="right"
          @click="view_image_move_right"
          v-if="view_image.controls.right"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </div>
        <div
          class="left"
          @click="view_image_move_left"
          v-if="view_image.controls.left"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </div>
      </div>
      <div class="close_btn" @click="view_image.show = false">
        <v-icon>mdi-close</v-icon>
      </div>

      <div class="info_of_image">
        <span
          >Photo {{ view_image.active_item.index + 1 }} of
          {{ view_image.list.length }}</span
        >
      </div>

      <div class="image_content" >
        <img :src="view_image.active_item.src" ref="view_image_content"/>
      </div>
    </div>

    <v-navigation-drawer
      v-model="show_nav_drawer"
      absolute
      temporary
      :width="nav_drawer_width"
    >
      <v-list nav>
        <v-list-item
          class="py-5 px-4 bg-theme rounded-0"
          id="user_info_at_nav_drawer"
        >
          <div
            class="image ml-2"
            style="position: relative; top: 3px"
            v-if="user_default_avatar"
          >
            <img
              :src="user_default_avatar"
              class="avatar"
              onload="window.lazyImage(this)"
              style="--size: 40px"
            />
          </div>

          <v-list-item-title class="ml-3">{{ user_info.full_name }}</v-list-item-title>
        </v-list-item>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-cloud</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Saved Messages</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>New Group</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>
            <v-list-item-title>New Channel</v-list-item-title>
          </v-list-item>

          <v-list-item
            @click="
              show_nav_drawer = false;
              show_settings_dialog = true;
            "
          >
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>

          <v-list-item @click="logout" color="red">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <div class="nav_drawer_footer">
          <span class="text-grey">ChatApp</span><br />
          <span class="text-grey" style="font-size: 12px">Version 1.0</span>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-dialog max-width="450" v-model="show_settings_dialog" scrollable>
      <v-card v-if="settings_dialog_active_section == 'home'">
        <div class="d-flex justify-space-between align-center">
          <v-card-title class="text-h6"> Settings </v-card-title>
          <div class="mr-2">
            <v-btn
              large
              icon
              style="padding-top: 3px"
              @click="show_settings_dialog = false"
            >
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
            <div class="photo_uploading" v-if="photo_uploading_state">
              <v-progress-circular
                indeterminate
              ></v-progress-circular>
            </div>
          </div>

          <template v-else>
            <ColoredAvatar v-if="user_info.full_name" :value="user_info.full_name[0]" />
            <ColoredAvatar v-else :value="''" />
          </template>

          <div class="ml-4">
            <span class="text-white font-weight-medium d-block w-100">
              <template v-if="user_info.full_name">
                {{ user_info.full_name }}
              </template>
            </span>
            <span class="text-grey d-block w-100"
              >last seen today at 5:15 PM</span
            >
          </div>
        </div>

        <v-divider></v-divider>

        <v-list nav tile dense>
          <v-list-item-group>
            <v-list-item
              @click="settings_dialog_active_section = 'edit_profile'"
            >
              <v-list-item-icon>
                <v-icon class="icon">mdi-information-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Edit Profile</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon class="icon">mdi-bell-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Notification</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon class="icon">mdi-keyboard-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <div class="d-flex justify-space-between">
                  <div>Language</div>
                  <div class="mr-2">
                    <span class="text-theme_color">English</span>
                  </div>
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <v-divider></v-divider>

        <v-list nav tile dense>
          <v-list-item-group>
            <v-list-item href="https://github.com/tahadostifam/ChatApp">
              <v-list-item-icon>
                <v-icon class="icon">mdi-help-circle-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>About ChatApp</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      <v-card v-if="settings_dialog_active_section == 'edit_profile'">
        <v-dialog max-width="400" v-model="settings_dialog_edit_full_name">
          <v-card>
            <v-card-title style="font-size: 17px" class="mb-0 pb-0 pl-4 pt-2">
              Edit your name
            </v-card-title>
            <div class="px-5 pt-0">
              <v-text-field v-model="update_full_name_input" label="Full name"></v-text-field>
            </div>
            <v-card-actions class="pr-2">
              <v-spacer></v-spacer>
              <v-btn
                :color="theme_color"
                text
                @click="settings_dialog_edit_full_name = false"
              >
                CANCEL
              </v-btn>
              <v-btn @click="submit_edit_full_name" :color="theme_color" text> SAVE </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-btn
              icon
              depressed
              large
              class="ml-4"
              @click="settings_dialog_active_section = 'home'"
            >
              <v-icon class="icon"> mdi-arrow-left </v-icon>
            </v-btn>
            <v-card-title class="text-h6"> Edit Profile </v-card-title>
          </div>
          <div class="mr-2">
            <v-btn
              large
              icon
              style="padding-top: 1px"
              @click="show_settings_dialog = false"
            >
              <v-icon class="icon"> mdi-close </v-icon>
            </v-btn>
          </div>
        </div>

        <div class="d-flex align-center justify-center px-4 pb-5 flex-column">
          <div
            class="avatar avatar_xlarge"
            v-if="user_default_avatar"
            @click="preview_self_profile"
          >
            <img :src="user_default_avatar" />
            <div class="photo_uploading" v-if="photo_uploading_state">
              <v-progress-circular
                indeterminate
              ></v-progress-circular>
            </div>
          </div>
          <template v-else>
            <ColoredAvatar
              v-if="user_info.full_name"
              :value="user_info.full_name[0]"
              :avatar_xlarge="true"
            />
            <ColoredAvatar v-else :value="''" style="xlarge" />
          </template>

          <v-btn
            class="rounded-pill mt-4"
            depressed
            :color="theme_color"
            style="overflow: hidden"
          >
            <input
              type="file"
              id="upload_profile_photo_input"
              style="opacity: 0; position: absolute; width: 200px; height: 40px"
              onchange="window.upload_profile_photo(this)"
            />
            SET PROFILE PHOTO
          </v-btn>
        </div>

        <v-divider></v-divider>

        <!-- RULES -->
        <v-list nav>
          <v-list-item-group>
            <v-list-item @click="settings_dialog_edit_full_name = true">
              <v-list-item-icon class="pl-3">
                <v-icon class="icon">mdi-account-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <div class="d-flex flex-column text-left">
                  <span class="text-white d-block w-100">{{user_info.full_name}}</span>
                  <span
                    class="text-grey d-block w-100 mt-1"
                    style="font-size: 14px"
                    >Name</span
                  >
                </div>
              </v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
              <v-list-item-icon class="pl-3">
                <v-icon class="icon">mdi-at</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <div class="d-flex flex-column text-left">
                  <span class="text-white d-block w-100">{{username}}</span>
                  <span
                    class="text-grey d-block w-100 mt-1"
                    style="font-size: 14px"
                    >Username</span
                  >
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <!-- RULES -->

        <div class="px-5 py-3">
          <v-text-field
            placeholder="Bio"
            counter="70"
            maxlength="70"
            v-model="bio_input"
            @input="submit_bio_change"
          ></v-text-field>
          <p class="text-grey">
            Any details such as age, occupation or city.
            <br />
            Example: 15y.o. full-stack developer from Iran.
          </p>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog max-width="350" v-model="crop_profile_photo.show">
      <v-card class="pa-5 pb-0">
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
          <v-btn :color="theme_color" text @click="upload_croped_profile_photo" :loading="crop_profile_photo.button_loading_state">
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ViewUserProfile :show.sync="view_user_profile_photo.show" :user_default_avatar="gimme_profile_photo_link_addr(active_chat.profile_photo)" :active_chat="active_chat" v-on:update:show="view_user_profile_photo.show = false"></ViewUserProfile>

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
                class="custom_input"
                placeholder="Search"
                v-model="search_chat_input"
                @input="search_chat_submit"
              />
            </div>
          </div>
        </div>

        <div class="chats">
          <div class="internet_bar" v-if="$nuxt.isOffline || show_internet_bar">
            <v-progress-circular
                class="d-inline-block mr-4"
                indeterminate
              ></v-progress-circular>
            Connecting...
          </div>

          <template v-if="search_chat_input.trim().length == 0">
            <template v-if="chats_list && chats_list.length > 0">
              <ChatRow
                v-for="(item, index) in chats_list"
                :key="index"
                @click_event="show_chat(item.chat_id, 'chats_list')"
                :chat_name="item.full_name"
                :active_chat="item.chat_id == active_chat.chat_id"
                :image_url="gimme_profile_photo_link_addr(item.profile_photo)"
              ></ChatRow>
            </template>
            <ThereIsNothing v-else />
          </template>
          <template v-else-if="search_chat_result">
            <span class="chat_row_badge">Global search</span>
            <ChatRow
                v-for="(item, index) in search_chat_result"
                :key="index"
                @click_event="show_chat(item._id, 'search_chat_result')"
                :chat_name="item.full_name"
                :image_url="gimme_profile_photo_link_addr(item.profile_photo)"
            ></ChatRow>
            <template v-if="search_chat_in_local_result">
              <span class="chat_row_badge mt-5">Local search</span>
              <ChatRow
                  v-for="(item, index) in search_chat_in_local_result"
                  :key="index + item.username"
                  @click_event="show_chat(item._id, 'search_chat_in_local')"
                  :chat_name="item.full_name"
                  :image_url="gimme_profile_photo_link_addr(item.profile_photo)"
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
                <!-- ANCHOR -->
                <div
                  @click="show_user_profile"
                  class="d-flex align-center text-decoration-none mr-5"
                  style="width: 100%"
                >
                  <div class="image" v-if="active_chat.profile_photo && active_chat.profile_photo.filename">
                    <img
                      :src="gimme_profile_photo_link_addr(active_chat.profile_photo)"
                      class="avatar"
                      onload="window.lazyImage(this)"
                    />
                  </div>

                  <div>
                    <span class="d-block font-weight-bold ml-3 text-white"
                      >{{active_chat.full_name}}</span
                    >
                    <span
                      class="d-block text-sm-caption font-weight-bold ml-3 text--secondary"
                      >online</span
                    >
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
              <!-- FIXME @scroll="on_chat_scroll_event(this)" -->
              <div class="messages_list" v-if="active_chat.messages && active_chat.messages.length > 0 && active_chat.username && active_chat.full_name">
                <!-- Context Menu For Messages -->

                <v-menu
                  v-model="context_menu_for_messages.show"
                  :position-x="context_menu_for_messages.x"
                  :position-y="context_menu_for_messages.y"
                  absolute
                  offset-y
                >
                  <v-list style="width: 200px">
                    <v-list-item v-ripple>
                      <v-list-item-title>Reply</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-ripple>
                      <v-list-item-title>Copy</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-ripple>
                      <v-list-item-title>Forward</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-ripple>
                      <v-list-item-title>Select</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-ripple @click="delete_message"> 
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
                    :sender="select_message_sender_fullname()"
                    :send_time="parse_message_date(item.send_time)"
                    :text_content="item.content"
                    :edited="item.edited"
                    :my_message="item.sender_username == user_info.username"
                    :seen_state="item.seen_state"
                  ></TextMessage>
                  <!-- ANCHOR -->

                  <!-- <ImageMessage
                    v-if="item.type == 'image'"
                    :key="index"
                    message_id="item.message_id"
                    @contextmenu.native="
                      show_contextmenu_of_message($event, item.message_id)
                    "
                    :sender="item.sender"
                    :send_time="item.send_time"
                    :text_content="item.text_content"
                    :image_address="item.image_address"
                    :edited="item.edited"
                    :my_message="item.my_message"
                    :seen_state="item.seen_state"
                  ></ImageMessage> -->
                </template>
              </div>
              <div id="no_chat_selected" v-else>
                <span>No messages yet</span>
              </div>
            </div>

            <div class="send_message_section">
              <div class="send_box">
                <!-- TODO -->
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
                <v-text-field
                  id="send_message_textbox"
                  v-model="send_text_message_input"
                  aria-multiline="true"
                  class="rounded-pill"
                  solo
                  placeholder="پیام شما..."
                  v-on:keypress.enter="submit_send_text_messages()"
                  dir="rtl"
                ></v-text-field>
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
          </template>
          <div id="no_chat_selected">
            <span>Select a chat to start messaging</span>
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
import Cookies from "js-cookie";
import ViewUserProfile from '../components/view_user_profile.vue';

export default {
  components: {
    Cropper,
  },
  name: "chat",
  middleware: ["need_auth"],
  components: {
    EmojiPicker,
    ViewUserProfile,
  },
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
      nav_drawer_width: 350,
      show_settings_dialog: false,
      settings_dialog_active_section: "home",
      settings_dialog_edit_full_name: false,
      update_full_name_input: '',
      user_default_avatar: undefined,
      crop_profile_photo: {
        show: false,
        src: null,
        canvas: null,
        button_loading_state: false
      },
      photo_uploading_state: false,
      view_image: {
        show: false,
        list: [],
        active_item: {
          src: null,
          index: 0,
        },
        controls: {
          right: true,
          right: false,
        },
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
        profile_photo: null
      },
      chats_list: null,
      message_context_menu_message_id: null,
      show_internet_bar: false,
      view_user_profile_photo: {
        show: false
      }
    };
  },
  mounted() {  
    this.$nextTick(function () {
      window.initSocket();
    });

    this.check_if_user_had_profile_photo();
    this.handle_resize();
    this.handle_escape_button();
    this.watch_profile_photos_change();
    this.watch_user_info_changes();
    this.$set(this.$data, 'update_full_name_input', this.$store.state.auth.user_info.full_name)
    this.$set(this.$data, 'bio_input', this.$store.state.auth.user_info.bio)
    // SECTION - setting user chats
    this.$set(this.$data, 'chats_list', this.$store.state.auth.user_info.chats)
    
    window.upload_profile_photo = this.handle_upload_profile_photo;
    window.vm = this;
  },
  computed: {
    username() {
      return this.$store.state.auth.auth.username
    },
    user_info() {
      return this.$store.state.auth.user_info
    }
  },
  methods: {
    show_user_profile(){
      if (this.$data.active_chat.username) {
        window.ws.send(JSON.stringify({
          "event": "get_user_full_info",
          "target_username": this.$data.active_chat.username
        }))
      }
      
      this.$set(this.$data.view_user_profile_photo, 'show', true)
    },
    submit_send_text_messages(){
      if (this.$data.send_text_message_input.trim() != "") {
        const ws = window.ws;
        if (ws) {
          if (this.$data.active_chat.chat_id) {
            let data_to_send = {
                event: "send_text_message",
                send_text_message_input: this.$data.send_text_message_input.trim(),
                chat_id: this.$data.active_chat.chat_id,
                target_username: this.$data.active_chat.username
            }
            ws.send(JSON.stringify(data_to_send))
          }
          this.$set(this.$data, 'send_text_message_input', '');
        } else {
          this.initilizing_socket_again().then(() => {
            this.submit_send_text_messages()
          })
        }
      }
    },
    async show_chat(chat_id, chat_location) {
      this.$set(this.$data, 'chat_is_loading', true);

      const vm = this;
      let chat = null;

      function doGetChatMessages() {
         if (vm.$store.state.auth.user_info.chats_messages && vm.$store.state.auth.user_info.chats_messages.length > 0) {
          const chats_messages = vm.$store.state.auth.user_info.chats_messages
          if (chats_messages) {
            const find_result = chats_messages.find( ({ sides }) => sides.user_1 === chat.username || sides.user_2 === chat.username);
            if (find_result && find_result.sides) {
              chat = {
                chat_id: find_result._id,
                username: find_result.target_username,

                profile_photo: chat.profile_photo,
                full_name: chat.full_name,

                chat_type: chat.chat_type,
              }

              vm.set_the_active_chat(chat)
              
              vm.$set(vm.$data.active_chat, 'messages', find_result.messages_list);
            }else{
              vm.$set(vm.$data.active_chat, 'messages', null);
            }
          }
          else{
            vm.$set(vm.$data.active_chat, 'messages', null);
          }
        }

        vm.set_the_active_chat(chat)
      }

      switch (chat_location) {
        case 'chats_list':
          chat = this.$data.chats_list.find( ({chat_id: _chat_id_}) => _chat_id_ == chat_id )
          if (chat) {        
            this.set_the_active_chat(chat)
            const msgs_list = await this.fetch_chat_messages_list(chat_id);
            this.$set(this.$data.active_chat, 'messages', msgs_list);
          }
          break;
        case 'search_chat_result':
          chat = this.$data.search_chat_result.find(({ _id }) => _id == chat_id)
          doGetChatMessages();
          break;
        case 'search_chat_in_local':
          chat = this.$data.search_chat_in_local_result.find(({ _id }) => _id == chat_id)
          doGetChatMessages();
          break;
      }
      // this.$set(this.$data, 'search_chat_input', '')
      
      this.$set(this.$data, 'show_chat_view', true);
      this.$set(this.$data, 'chat_is_loading', false);
    },
    set_the_active_chat(chat){
      if (chat._id) {
        this.$set(this.$data.active_chat, 'chat_id', chat._id);
      }
      if (chat.chat_id) {
        this.$set(this.$data.active_chat, 'chat_id', chat.chat_id);
      }
      this.$set(this.$data.active_chat, 'username', chat.username);
      this.$set(this.$data.active_chat, 'full_name', chat.full_name);
      this.$set(this.$data.active_chat, 'profile_photo', chat.profile_photo);
      this.$set(this.$data.active_chat, 'chat_type', chat.chat_type);
    }, 
    fetch_chat_messages_list(chat_id){
      // NOTE
      // this method will be work when user clicked on the a chat
      // when it happend... we should going to user_chats_messages and finding the messages for that chat
      const chats_messages = this.$store.state.auth.user_info.chats_messages
      if (chats_messages) {
        const find_result = chats_messages.find( ({_id}) => _id === chat_id);
        if (find_result) {
          return find_result.messages_list // messages of chat
        }
      }
      return null
    },
    parse_message_date(send_time){
      const date = new Date(send_time)

      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      let time_string = hours + ':' + minutes + ' ' + String(ampm).toUpperCase();

      return time_string
    },
    select_message_sender_fullname(){
      if (this.$data.active_chat.chat_type == 'private') {
        return null
      }
    },
    gimme_profile_photo_link_addr(profile_photo){
      if (profile_photo && profile_photo.filename) {
        return this.$axios.defaults.baseURL +
            "/uploads/profile_photos/" + profile_photo.filename;
      }
    },
    submit_edit_full_name(){
      window.ws.send(JSON.stringify({
          event: "update_full_name",
          full_name: this.$data.update_full_name_input
      }))
      this.$set(this.$data, 'settings_dialog_edit_full_name', false)
    },
    check_if_user_had_profile_photo(){
      if (this.$store.state.auth.user_info.profile_photos.length > 0) {
      const first_photo_filename =
        this.$store.state.auth.user_info.profile_photos[0].filename;
      this.$set(
        this.$data,
        "user_default_avatar",
        this.$axios.defaults.baseURL +
          "/uploads/profile_photos/" +
          first_photo_filename
      );
      }
    },
    submit_bio_change(){
      const ws = window.ws;
        if (ws) {
            ws.send(JSON.stringify({
                event: "update_bio",
                bio: this.$data.bio_input
            }))
        } else {
          this.initilizing_socket_again().then(() => {
            this.submit_bio_change()
          })
      }
    },
    search_chat_submit() {
      let chats_list = this.$data.chats_list;
      if (typeof chats_list == Object) {
        chats_list = Array(this.$data.chats_list);
      }
      const input = this.$data.search_chat_input;
      if (input.trim()) {
        if (chats_list) {
          const local_search_result = chats_list.filter((item) => {
            if (String(item.username).includes(input) || String(item.full_name).includes(input)) {
              return true
            }
            return false
          })
          this.$set(this.$data, 'search_chat_in_local_result', local_search_result)
        }
        const ws = window.ws;
        if (ws) {
            ws.send(JSON.stringify({
                event: "search_in_chats",
                input: input
            }))
        } else {
          this.initilizing_socket_again().then(() => {
            this.search_chat_submit()
          })
        }
      }
    },
    preview_self_profile() {
      let list = [];
      this.$store.state.auth.user_info.profile_photos.forEach((item) => {
        list.push({
          src:
            this.$axios.defaults.baseURL +
            "/uploads/profile_photos/" +
            item.filename,
        });
      });
      
      this.show_view_image_modal(list);
    },
    view_image_move_right() {
      const active_index = this.$data.view_image.active_item.index;
      const length = this.$data.view_image.list.length;

      const to_index = active_index + 1;
      if (active_index + 2 > length - 1) {
        this.$set(this.$data.view_image.controls, "right", false);
      }

      if (to_index > 0) {
        this.$set(this.$data.view_image.controls, "left", true);
      }

      if (to_index < length) {
        this.$set(this.$data.view_image.active_item, "index", to_index);
        this.$set(
          this.$data.view_image.active_item,
          "src",
          this.$data.view_image.list[to_index].src
        );
      }
    },
    view_image_move_left() {
      const active_index = this.$data.view_image.active_item.index;
      const length = this.$data.view_image.list.length;

      if (active_index == 1) {
        this.$set(this.$data.view_image.controls, "left", false);
        this.$set(this.$data.view_image.controls, "right", true);
      }

      if (active_index >= 1) {
        const to_index = active_index - 1;
        this.$set(this.$data.view_image.active_item, "index", to_index);
        this.$set(
          this.$data.view_image.active_item,
          "src",
          this.$data.view_image.list[to_index].src
        );
      }
    },
    show_view_image_modal(list){
      this.$set(this.$data.view_image, "show", true);
      this.$set(this.$data.view_image.active_item, "index", 0);
      const index = this.$data.view_image.active_item;
      this.$set(this.$data.view_image, "list", list);
      this.$set(index, "src", this.$data.view_image.list[0].src);
      const length = this.$data.view_image.list.length;
      if (length == 1) {
        this.$set(this.$data.view_image.controls, "right", false);
      }
      if (length > 1) {
        this.$set(this.$data.view_image.controls, "right", true);
      }
      this.$set(this.$data.view_image.controls, "left", false);
    },
    logout() {
      this.$router.push({ path: "/logout" });
    },
    initilizing_socket_again(){
      return new Promise((resolve) => {
        setTimeout(async() => {
          console.error('socket is empty!');
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
    handle_resize() {
      let vm = this;
      function __resize() {
        if (window.innerWidth <= 1100)
          vm.$set(vm.$data, "nav_drawer_width", 300);
        else vm.$set(vm.$data, "nav_drawer_width", 350);
      }
      window.onresize = () => __resize();
      __resize();
    },
    handle_upload_profile_photo(e) {
      const file = e.files[0];
      const local_path = URL.createObjectURL(file);
      this.$set(this.$data.crop_profile_photo, "src", local_path);
      this.$set(this.$data.crop_profile_photo, "show", true);
    },
    upload_croped_profile_photo() {
      this.$set(this.$data.crop_profile_photo, 'button_loading_state', true);
      this.$set(this.$data.crop_profile_photo, "show", false);

      const canvas = this.$data.crop_profile_photo.canvas;
      if (canvas) {
        const croppedImage = canvas.toDataURL("image/png");
        const imageFile = window.dataURLtoFile(croppedImage, "profile_photo");
        if (imageFile) {
          const requestBody = new FormData();
          requestBody.append("photo", imageFile);
          
          this.$set(this.$data, 'photo_uploading_state', true);

          this.$axios
            .$post("/api/profile_photos/upload_photo", requestBody, {
              headers: {
                username: this.$store.state.auth.auth.username,
                auth_token: this.$store.state.auth.auth.auth_token,
              },
            })
            .then((response) => {
              if (response.message == "profile photo uploaded") {
                this.$store.commit(
                  "auth/addProfilePhotos",
                  response.profile_photo_filename
                );
              }
            })
            .catch((error) => {
              this.$router.push({ path: "/500" });
            }).finally(() => {
              this.$set(this.$data.crop_profile_photo, 'button_loading_state', false);
              this.$set(this.$data, 'photo_uploading_state', false);
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
          (state) => state.auth.user_info.profile_photos,
          (value) => {
            if (value && value[0].filename) {
              this.$set(
                this.$data,
                "user_default_avatar",
                this.gimme_profile_photo_link_addr(value[0])
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
            if (value && value[0].filename) {
              this.$set(
                this.$data,
                "user_info",
                value
              );
            }
          }
        );
      }
    },
    crop_profile_photo_onchange({ coordinates, canvas }) {
      this.$set(this.$data.crop_profile_photo, "canvas", canvas);
    },
    delete_message() {
      const message_id = this.$data.message_context_menu_message_id
      const chat_id = this.$data.active_chat.chat_id
      if (message_id && chat_id) {
        ws.send(JSON.stringify({
            event: "delete_message",
            chat_id: chat_id,
            message_id: message_id
        }))
      }
    },
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

// {
//   message_id: "a",
//   type: "image",
//   sender: "$ maximilian",
//   send_time: "00:00",
//   text_content: "MEOW |:",
//   edited: false,
//   my_message: false,
//   image_address: "https://picsum.photos/900/500",
// },
// {
//   message_id: "b",
//   type: "text",
//   sender: "$ maximilian",
//   send_time: "00:00",
//   text_content: "😂😂😂",
//   edited: false,
//   my_message: false,
// },
// {
//   message_id: "c",
//   type: "image",
//   send_time: "00:00",
//   text_content: "look at this, Max. <br> its very similar to you",
//   edited: false,
//   my_message: true,
//   seen_state: "sended",
//   image_address: "https://picsum.photos/900/500",
// },