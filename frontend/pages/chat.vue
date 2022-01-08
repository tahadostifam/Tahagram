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
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
          </v-list-item-avatar>
          <v-list-item-title>{{ username }}</v-list-item-title>
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

          <v-list-item>
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
          <ChatRow
            v-for="(item, index) in message_rows_list"
            :key="index"
            @click_event="show_chat(item.chat_id)"
            :chat_name="item.chat_name"
            :message_preview="item.last_message"
            :image_url="item.profile_photo"
          ></ChatRow>
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
      show_chat_view: true,
      message_rows_list: [
        {
          chat_id: "akldmaldmadmadm",
          chat_name: "Maximilian Tepes",
          last_message: "Hey Max, Whatsup?",
        },
        {
          chat_id: "asdasdadsa131313adadasdad",
          chat_name: "Taha. Dostifam",
          last_message: "How is your project going?",
        },
      ],
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
      username: undefined,
      nav_drawer_width: 350,
    };
  },
  mounted() {
    this.$set(this.$data, "username", this.$store.state.auth.auth.username);
    window.onresize = () => {
      if (window.innerWidth <= 1100)
        this.$set(this.$data, "nav_drawer_width", 300);
      else this.$set(this.$data, "nav_drawer_width", 350);
    };
    // const messages_scroll = document.querySelector(".messages-scroll");
    // messages_scroll.scrollTop = messages_scroll.scrollHeight;
  },
  methods: {
    logout() {
      this.$store.commit("auth/setRefreshToken", null);
      this.$store.commit("auth/setAuthToken", null);
      this.$store.commit("auth/setUserData", null);
      this.$store.commit("auth/setUserLoggedIn", false);

      Cookies.remove("refresh_token");
      Cookies.remove("auth_token");
      Cookies.remove("username");

      this.$router.push({ path: "/signin" });
    },
    insert(emoji) {
      this.send_message_input += emoji;
    },
    show_contextmenu_of_message(e, message_id) {
      console.log(message_id);
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
    show_chat(chat_id) {
      this.$set(this.$data, "show_chat_view", true);
    },
  },
};
</script>
