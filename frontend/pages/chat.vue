<template>
    <div class="pa-0" id="main_container">
        <div class="chats_list">
            <div class="section_header border">
            <v-row class="pa-0 ma-0 align-center px-3" style="height: 100%;">

                <v-col cols="2" class="ma-0 pa-0 mr-1 ml-1">
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
                        <v-icon color="grey">
                        mdi-menu
                        </v-icon>
                    </v-btn>
                    </template>
                    <v-list style="width: 300px;">
                    <v-list-item v-ripple>
                        <v-list-item-title>Settings</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-ripple href="https://github.com/tahadostifam/ChatApp">
                        <v-list-item-title>Source Code</v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>
                </v-col>

                <v-col class="ma-0 pa-0">
                <input type="text"class="custom_input" placeholder="Search">
                </v-col>

            </v-row>
            </div>
            
            <div class="chats">
            <div class="chat_row active_chat">
                <v-row>
                <v-col cols="2" class="mr-1">
                    <div class="image">
                    <img src="https://picsum.photos/900/900" onload="window.lazyImage(this)" class="avatar">
                    </div>
                </v-col>
                <v-col class="pa-0 pl-5 pt-2">
                    <span class="d-block">Username</span>
                    <span class="d-block text--secondary">Latest Message</span>
                </v-col>
                </v-row>
            </div>
            <div class="chat_row">
                <v-row>
                <v-col cols="2" class="mr-1">
                    <div class="solid_color_avatar"></div>
                </v-col>
                <v-col class="pa-0 pl-5 pt-2">
                    <span class="d-block">Username</span>
                    <span class="d-block text--secondary">Latest Message</span>
                </v-col>
                </v-row>
            </div>
            </div>
        </div>

        <div class="chat_view">

            <div class="section_header border px-3">
            <div class="d-flex align-center justify-space-between" style="height: 100%">
                <a href="#open_chat_profile" class="d-flex align-center text-decoration-none mr-5" style="width: 100%;">
                <div class="image">
                    <img src="https://picsum.photos/900/900" class="avatar" onload="window.lazyImage(this)">
                </div>
                <div>
                    <span class="d-block font-weight-bold ml-3 text-white">Username</span>
                    <span class="d-block text-sm-caption font-weight-bold ml-3 text--secondary">10 Subscribers</span>
                </div>
                </a>
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
                        <v-icon color="grey">
                        mdi-dots-vertical
                        </v-icon>
                    </v-btn>
                    </template>
                    <v-list style="width: 220px;">
                    <v-list-item v-ripple>
                        <v-list-item-title>Mute</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-ripple>
                        <v-list-item-title class="text-red">Delete Chat</v-list-item-title>
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
                    <v-list-item-title class="text-red">Delete</v-list-item-title>
                    </v-list-item>
                </v-list>
                </v-menu>

                <div class="message_row" @contextmenu="show_contextmenu_of_message">
                <div class="message">
                    <span class="sender_name">Username</span>
                    <p class="message_content">
                    Hi Taha.br <br>
                    Whats up??
                    </p>
                    <div class="message_footer">
                    <!-- <span class="edit_state mr-1 font-italic">edited</span> -->
                    <span class="send_datetime">1 Jan, 22:05</span>
                    </div>
                </div>
                </div>

                <div class="message_row" @contextmenu="show_contextmenu_of_message">
                <div class="message">
                    <span class="sender_name">Username</span>
                    <p class="message_content">
                    Id sunt aliqua deserunt anim officia excepteur consequat nostrud eu non non officia consequat. In velit elit duis aliqua culpa cillum eu deserunt tempor voluptate esse Lorem. Nostrud velit fugiat officia esse fugiat eiusmod id proident non magna culpa. Sit do eiusmod dolore incididunt irure deserunt id officia non sunt dolor.
                    Aliqua ut amet aute et enim et amet. Elit proident culpa culpa irure dolore. In magna commodo duis eu pariatur laboris qui. Elit dolor do nisi consequat dolore exercitation elit ad ullamco dolor in do esse. Sint Lorem nisi ut nisi ea irure irure officia. Culpa ullamco dolor anim irure nisi tempor tempor consequat adipisicing. Incididunt aliqua voluptate laborum deserunt ut est ex mollit anim irure occaecat elit nulla
                    </p>
                    <div class="message_footer">
                    <!-- <span class="edit_state mr-1 font-italic">edited</span> -->
                    <span class="send_datetime">1 Jan, 22:05</span>
                    </div>
                </div>
                </div>

                <!-- <div class="message_row my_message">
                    <div class="message">
                    <p class="message_content">
                        Message From Maximilian Tepes
                    </p>
                    <div class="message_footer">
                        <span class="edit_state mr-1 font-italic">edited</span>
                        <span class="send_datetime">1 Jan, 22:05</span>
                        <v-icon class="checkmark_state d-none">mdi-check</v-icon>
                        <v-icon class="checkmark_state">mdi-check-all</v-icon>
                    </div>
                    </div>
                </div> -->

                <!-- <div class="message_row my_message type_image">
                    <div class="message"> 
                    <div class="image">
                        <img src="https://picsum.photos/900/900" onload="window.lazyImage(this)">
                    </div>
                    <div class="image not_downloaded_image">
                        <img src="https://picsum.photos/900/900" onload="window.lazyImage(this)">
                        <button @click="console.log(this)" class="download_image_message__button">
                        <v-icon>
                            mdi-download-outline
                        </v-icon>
                        </button>
                    </div>

                    <p class="message_content">
                        Message From Maximilian Tepes Message From Maximilian Tepes Message From Maximilian Tepes 
                    </p>
                    <div class="message_footer">
                        <span class="send_datetime">1 Jan, 22:05</span>
                        <v-icon class="checkmark_state">mdi-check-all</v-icon>
                    </div>
                    </div>
                </div> -->

            </div>
                
            </div>

            <div class="send_message_section">
            <div class="send_box">
                <!-- TODO -->
                <emoji-picker class="emoji_picker" @emoji="insert">
                <div slot="emoji-invoker" slot-scope="{ events: { click: clickEvent } }" @click.stop="clickEvent">
                    <v-btn
                    id="emojies_button"
                    :color="theme_color"
                    dark
                    icon
                    x-large
                    >
                        <v-icon small :color="theme_color">
                        mdi-emoticon
                        </v-icon>
                    </v-btn>
                </div>
                <div slot="emoji-picker" slot-scope="{ emojis, insert, display }">
                    <v-card
                    id="emoji_picker_card"
                    class="rounded-lg"
                    elevation="2"
                    >
                    <div class="pa-2">
                        <div>
                        <div v-for="(emojiGroup, category) in emojis" :key="category">
                            <h5 class="set_title">{{ category }}</h5>
                            <div>
                            <span
                                class="emoji_span"
                                v-for="(emoji, emojiName) in emojiGroup"
                                :key="emojiName"
                                @click="insert(emoji)"
                                :title="emojiName"
                            >{{ emoji }}</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </v-card>
                </div>
                </emoji-picker>
                <v-text-field id="send_message_textbox" v-model="send_message_input" aria-multiline="true" class="rounded-pill" solo placeholder="Message"></v-text-field>
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
</template>

<script>
import { EmojiPicker } from 'vue-emoji-picker'

export default {
    middleware: ['check_auth'],
    components: {
        EmojiPicker,
    },
    data(){
        return{
            theme_color: 'green accent-4',
            send_message_input: '',
            context_menu_for_messages: {
                show: false,
                x: 0,
                y: 0,
            }
        }
    },
    methods: {
        insert(emoji) {
          this.send_message_input += emoji
        },
        show_contextmenu_of_message(e){
            e.preventDefault()
            this.$set(this.$data.context_menu_for_messages, 'show', false)
            this.$set(this.$data.context_menu_for_messages, 'x', e.clientX)
            this.$set(this.$data.context_menu_for_messages, 'y', e.clientY)
            this.$nextTick(() => {
                this.$set(this.$data.context_menu_for_messages, 'show', true)
            })
        }
    },
}
</script>