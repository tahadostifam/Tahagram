<template>
  <div>
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

          <v-list-item-title class="ml-3">{{ username }}</v-list-item-title>
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
          <!-- ANCHOR -->
          <div class="avatar" v-if="user_default_avatar">
            <img :src="user_default_avatar" />
          </div>

          <template v-else>
            <ColoredAvatar v-if="username" :value="username[0]" />
            <ColoredAvatar v-else :value="''" />
          </template>

          <div class="ml-4">
            <span class="text-white font-weight-medium d-block w-100">
              <template v-if="username">
                {{ username }}
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
              <v-list-item-title>Notficions</v-list-item-title>
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
              <v-text-field label="First name"></v-text-field>
              <v-text-field label="Last name"></v-text-field>
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
              <v-btn :color="theme_color" text> SAVE </v-btn>
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
          <!-- ANCHOR -->
          <div class="avatar avatar_xlarge" v-if="user_default_avatar">
            <img :src="user_default_avatar" />
          </div>
          <template v-else>
            <ColoredAvatar
              v-if="username"
              :value="username[0]"
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
                  <span class="text-white d-block w-100">$ maximilian</span>
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
                  <span class="text-white d-block w-100">maximilian</span>
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
          ></v-text-field>
          <p class="text-grey">
            Any details such as age, occupation or city.
            <br />
            Example: 15y.o. full-stack developer from Iran.
          </p>
        </div>
      </v-card>
    </v-dialog>

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
              <input type="text" class="custom_input" placeholder="Search" />
            </div>
          </div>
        </div>

        <div class="chats">
          <template v-if="chats_list && chats_list.length > 0">
            <ChatRow
              v-for="(item, index) in chats_list"
              :key="index"
              @click_event="show_chat(item.username)"
              :chat_name="item.full_name"
            ></ChatRow>
          </template>
          <ThereIsNothing v-else />
          <!-- :image_url="item.profile_photo" -->
        </div>

        <div class="chat_view" v-bind:class="{ show: show_chat_view }">
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
              <!-- TODO - show profile modal -->
              <a
                href="#open_chat_profile"
                class="d-flex align-center text-decoration-none mr-5"
                style="width: 100%"
              >
                <div class="image">
                  <img
                    src="https://picsum.photos/900/900"
                    class="avatar"
                    onload="window.lazyImage(this)"
                  />
                </div>
                <div>
                  <span class="d-block font-weight-bold ml-3 text-white"
                    >Username</span
                  >
                  <span
                    class="d-block text-sm-caption font-weight-bold ml-3 text--secondary"
                    >10 Subscribers</span
                  >
                </div>
              </a>
              <!-- TODO - show profile modal -->
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

          <!-- NOTE - Will be enabled just in backend -->
          <!-- <div class="splash_screen absolute">
            <div class="center">
                <v-progress-circular
                class="mb-2 d-block"
                indeterminate
                :color="theme_color"
                ></v-progress-circular>
            </div>
            </div> -->

          <div class="messages-scroll">
            <div class="messages_list">
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
                  <v-list-item v-ripple>
                    <v-list-item-title class="text-red"
                      >Delete</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>

              <template v-for="(item, index) in messages_list">
                <TextMessage
                  v-if="item.type == 'text'"
                  :key="index"
                  :message_id="item.message_id"
                  @contextmenu.native="
                    show_contextmenu_of_message($event, item.message_id)
                  "
                  :sender="item.sender"
                  :send_time="item.send_time"
                  :text_content="item.text_content"
                  :edited="item.edited"
                  :my_message="item.my_message"
                  :seen_state="item.seen_state"
                ></TextMessage>

                <ImageMessage
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
                ></ImageMessage>
              </template>
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
                v-model="send_message_input"
                aria-multiline="true"
                class="rounded-pill"
                solo
                placeholder="Message"
              ></v-text-field>
              <v-btn
                id="send_message_button"
                :color="theme_color"
                dark
                icon
                x-large
              >
                <v-icon class="pl-1" small :color="theme_color">
                  mdi-send
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EmojiPicker } from "vue-emoji-picker";
import configs from "@/assets/javascript/configs";
import Cookies from "js-cookie";

export default {
  name: "chat",
  middleware: ["need_auth"],
  components: {
    EmojiPicker,
  },
  data() {
    return {
      theme_color: configs.theme_color,
      send_message_input: "",
      context_menu_for_messages: {
        show: false,
        x: 0,
        y: 0,
      },
      show_chat_view: false,
      chats_list: [],
      messages_list: [
        {
          message_id: "a",
          type: "image",
          sender: "$ maximilian",
          send_time: "00:00",
          text_content: "MEOW |:",
          /* ----------------------------- edited: false, ----------------------------- */
          my_message: false,
          image_address: "https://picsum.photos/900/500",
        },
        {
          message_id: "b",
          type: "text",
          sender: "$ maximilian",
          send_time: "00:00",
          text_content: "😂😂😂",
          edited: false,
          my_message: false,
        },
        {
          message_id: "c",
          type: "image",
          send_time: "00:00",
          text_content: "look at this, Max. <br> its very similar to you",
          edited: false,
          my_message: true,
          seen_state: "sended",
          image_address: "https://picsum.photos/900/500",
        },
      ],
      show_nav_drawer: false,
      username: null,
      nav_drawer_width: 350,
      show_settings_dialog: true,
      settings_dialog_active_section: "home",
      settings_dialog_edit_full_name: false,
      user_default_avatar: undefined,
    };
  },
  mounted() {
    this.$set(this.$data, "username", this.$store.state.auth.auth.username);
    this.$set(this.$data, "chats_list", this.$store.state.auth.chats_list);

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

    this.handle_resize();
    this.handle_escape_button();

    window.upload_profile_photo = this.handle_upload_profile_photo;

    this.$store.watch(
      (state) => state.auth.user_info.profile_photos,
      (value) => {
        this.$set(
          this.$data,
          "user_default_avatar",
          this.$axios.defaults.baseURL +
            "/uploads/profile_photos/" +
            value[0].filename
        );
      }
    );
  },
  methods: {
    logout() {
      this.$router.push({ path: "/logout" });
    },
    insert(emoji) {
      this.send_message_input += emoji;
    },
    show_contextmenu_of_message(e, message_id) {
      e.preventDefault();
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
    show_chat(username) {
      this.$set(this.$data, "show_chat_view", true);
    },
    handle_escape_button() {
      let vm = this;
      document.addEventListener("keydown", (e) => {
        if (e.code == "Escape") {
          if (vm.$data.show_chat_view == true) {
            return vm.$set(vm.$data, "show_chat_view", false);
          }
          if (vm.$data.show_nav_drawer == true) {
            return vm.$set(vm.$data, "show_nav_drawer", false);
          }
          if (vm.$data.settings_dialog_active_section != "home") {
            return vm.$set(vm.$data, "settings_dialog_active_section", "home");
          }
          if (vm.$data.show_settings_dialog == true) {
            return vm.$set(vm.$data, "show_settings_dialog", false);
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
      if (file) {
        const requestBody = new FormData();
        requestBody.append("photo", file);
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
          });
      } else {
        console.log("no profile photo to upload");
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
