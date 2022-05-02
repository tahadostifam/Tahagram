/* eslint-disable no-unused-vars */
<template>
  <div>
    <div v-if="!user_signed_in"></div>
    <div v-else>
      <Main />
    </div>
  </div>
</template>

<script>
// import { EmojiPicker } from 'vue-emoji-picker';
// import { Cropper } from 'vue-advanced-cropper';
import parseLastSeen from '../mixins/parse_date';
// import ViewUserProfile from "../components/view_user_profile.vue";

import UsersHttp from '../http/users.http';

const usersHttp = new UsersHttp();

export default {
  name: 'IndexPage',
  components: {
    // EmojiPicker,
    // Cropper,
  },
  mixins: [parseLastSeen],
  data() {
    return {
      user_signed_in: false,
      // Bars :: Begin
      show_error_snakbar: false,
      show_internet_bar: false,
      updating_user_info_state: false,
      // Bars :: End
      send_text_message_input: '',
      show_chat_view: false,
      chat_is_loading: false,
      show_nav_drawer: false,
      show_settings_dialog: false,

      // Settings Dialog :: Begin
      settings_dialog_active_section: 'home',
      settings_dialog_edit_full_name: false,
      update_full_name_input: '',
      user_default_avatar: undefined,
      crop_profile_photo: {
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
      // Settings Dialog :: End

      crop_media_to_send: {
        show: false,
        src: null,
        canvas: null,
        button_loading_state: false,
      },

      // Search Chat Section :: Begin
      search_chat_input: '',
      search_chat_result: null,
      search_chat_in_local_result: null,
      // Search Chat Section :: End

      // Context Menu of Message :: Begin
      context_menu_for_messages: {
        show: false,
        x: 0,
        y: 0,
      },
      message_context_menu_message_id: null,
      // Context Menu of Message :: End
      bio_input: '',
      active_chat: {
        chat_id: null,
        messages: null,
        username: null,
        full_name: null,
        profile_photo: null,
      },
      chats_list: null, // FIXME
      view_user_profile: {
        show: false,
      },
      show_create_channel_dialog: false,
      show_create_group_dialog: false,
      media_to_send_caption: '',
    };
  },
  computed: {
    username() {
      return this.$store.state.users.userData.username;
    },
  },
  mounted() {
    const vm = this;
    usersHttp
      .AuthenticationAction()
      .then((cb) => {
        vm.$store.commit('users/setUserData', cb);
        this.$data.user_signed_in = true;
      })
      .catch(() => {
        this.$router.push({ path: '/' + this.$i18n.locale + '/signin' });
      });
  },
  methods: {
    isMyMessage(item) {
      const chatType = this.$data.active_chat.chat_type;
      if (chatType !== 'channel') {
        return item.sender_username === this.username;
      } else if (
        this.$data.active_chat.iam_admin_of_chat ||
        this.$data.active_chat.iam_creator
      ) {
        return true;
      } else {
        return false;
      }
    },
    submit_delete_chat() {
      // TODO
    },
    // update_error_snakbar(newValue) { NOTE - will be removed
    //   this.$set(this.$data, 'show_error_snakbar', newValue)
    // },
    removeProfilePhoto(filename) {
      if (filename && filename.length > 0) {
        // TODO
      }
    },
    itsMyMessage() {
      // NOTE - We don't know what this method does now😂
      // const chats_messages = this.$store.state.auth.user_info.chats_messages
      // const chat_id = this.$data.active_chat.chat_id
      // if (
      //   chat_id &&
      //   chat_id.length > 0 &&
      //   this.$data.message_context_menu_message_id
      // ) {
      //   const chat = chats_messages.find(({ _id }) => _id == chat_id)
      //   if (chat) {
      //     const message = chat.messages_list.find(
      //       ({ message_id }) =>
      //         message_id == this.$data.message_context_menu_message_id
      //     )
      //     if (message) {
      //       if (message.sender_username == this.username) {
      //         return true
      //       } else {
      //         return false
      //       }
      //     }
      //   }
      // }
    },
    showPhotoMessageAsFullScreen(url) {
      // FIXME - pass the url in everywhere that this method called
      this.show_view_image_modal(
        [
          {
            src: url,
          },
        ],
        false
      );
    },
    showMemberProfile(username) {
      if (username === this.username) {
        this.$set(this.$data, 'show_settings_dialog', true); // NOTE - Can be better
      } else {
        this.$set(this.$data, 'search_chat_input', username);
        this.$set(this.$data.view_user_profile, 'show', false);
      }
    },
    copyMessageToClipboard() {
      const messageId = this.$data.message_context_menu_message_id;
      if (
        this.$data.active_chat.messages &&
        this.$data.active_chat.messages.length > 0 &&
        messageId
      ) {
        const message = this.$data.active_chat.messages.find(
          ({ message_id: _messageId }) => _messageId === messageId
        );
        if (message) {
          navigator.clipboard.writeText(message.content);
        }
      }
    },
    getLastMessage(chatId) {
      const chatsMessages = this.$store.state.auth.user_info.chats_messages;
      if (chatsMessages) {
        const chat = chatsMessages.find(({ _id }) => _id === chatId);
        if (chat && chat.messages_list && chat.messages_list.length > 0) {
          const message = chat.messages_list[chat.messages_list.length - 1];
          if (message) {
            const messageType = message.message_type;
            if (messageType === 'text') {
              return message.content.substr(0, 30);
            }
            if (messageType === 'photo') {
              return '📷';
            }
          }
        }
      }
      return '';
    },
    watchInternetStateChanges() {
      this.$store.watch(
        () => this.$nuxt.isOffline,
        (value) => {
          if (value === false) {
            this.update_user_info();
          }
        }
      );
    },
    async updateUserInfo() {
      // this.$set(this.$data, 'updating_user_info_state', true)
      // TODO
    },
    channelOrGroupCreated(chat) {
      // FIXME

      // window.ws.close()
      // FIXME - i cannot find a really important bug in this section
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

      this.$store.commit('auth/addChat', {
        chat_id: chat.chat_id,
        chat_type: chat.chat_type,
        full_name: chat.name,
        username: chat.username,
        profile_photo: chat.profile_photo,
      });

      this.$store.commit('auth/createNewChat', {
        _id: chat.chat_id,
        chat_type: chat.chat_type,
        messages_list: [],
      });

      if (chat.chat_type === 'channel') {
        this.$set(this.$data, 'show_create_channel_dialog', false);
      } else if (chat.chat_type === 'group') {
        this.$set(this.$data, 'show_create_group_dialog', false);
      }
      this.$set(this.$data, 'show_chat_view', true);
    },
    showCropPhotoToSend(e) {
      const file = e.files[0];
      const localPath = URL.createObjectURL(file);
      this.$set(this.$data.crop_media_to_send, 'src', localPath);
      this.$set(this.$data.crop_media_to_send, 'show', true);
    },
    uploadCroppedMedia() {
      this.$set(this.$data.crop_media_to_send, 'button_loading_state', true);
      this.$set(this.$data.crop_media_to_send, 'show', false);

      const canvas = this.$data.crop_media_to_send.canvas;
      if (canvas) {
        const croppedImage = canvas.toDataURL('image/png');
        const imageFile = window.dataURLtoFile(croppedImage, 'photo_message');
        if (imageFile && this.$data.active_chat.chat_id) {
          const requestBody = new FormData();
          requestBody.append('photo', imageFile);
          requestBody.append('chat_id', this.$data.active_chat.chat_id);
          requestBody.append('chat_type', this.$data.active_chat.chat_type);
          if (
            this.$data.media_to_send_caption &&
            this.$data.media_to_send_caption.trim().length > 0
          ) {
            requestBody.append('caption', this.$data.media_to_send_caption);
          }
          if (this.$data.active_chat.chat_type === 'private') {
            requestBody.append(
              'target_username',
              this.$data.active_chat.username
            );
          }

          // TODO - HTTP

          this.$set(
            this.$data.crop_media_to_send,
            'button_loading_state',
            false
          );
        } else {
          console.log('no photo to upload');
        }
      } else
        console.log(
          'uploading photo_message failed! :: cropped image canvas is empty'
        );
    },
    showUserProfile() {
      if (this.$data.active_chat.username) {
        // TODO
        // const dataToSend = {
        //   event: 'get_chat_full_info',
        //   chat_id: this.$data.active_chat.chat_id,
        //   chat_type: this.$data.active_chat.chat_type,
        // }
        // if (this.$data.active_chat.chat_type === 'private') {
        //   dataToSend.target_username = this.$data.active_chat.username
        // }
        // window.ws.send(JSON.stringify(data_to_send))
      }
      // this.$set(this.$data.view_user_profile, 'show', true)
    },
    sendTextMessage() {
      // TODO
      // const input = this.$data.send_text_message_input.trim()
      // this.$set(this.$data, 'send_text_message_input', '')
      // if (input != '') {
      //   const ws = window.ws
      //   if (ws) {
      //     if (this.$data.active_chat.chat_id) {
      //       switch (this.$data.active_chat.chat_type) {
      //         case 'private':
      //           ws.send(
      //             JSON.stringify({
      //               event: 'send_text_message',
      //               send_text_message_input: input,
      //               chat_id: this.$data.active_chat.chat_id,
      //               target_username: this.$data.active_chat.username,
      //               chat_type: 'private',
      //             })
      //           )
      //           break
      //         case 'channel':
      //         case 'group':
      //           ws.send(
      //             JSON.stringify({
      //               event: 'send_text_message',
      //               send_text_message_input: input,
      //               chat_id: this.$data.active_chat.chat_id,
      //               chat_type: this.$data.active_chat.chat_type,
      //             })
      //           )
      //           break
      //       }
      //     }
      //   } else {
      //     this.initilizing_socket_again().then(() => {
      //       this.submit_send_text_messages()
      //     })
      //   }
      // }
    },
    joinInChat() {
      // TODO
      // if (this.$data.active_chat.chat_type !== 'private') {
      //   this.getNonJoinedChatsMessage(this.$data.active_chat.chat_id)
      //   window.ws.send(
      //     JSON.stringify({
      //       event: 'join_to_chat',
      //       chat_id: this.$data.active_chat.chat_id,
      //     })
      //   )
      //   const chatRowExists = this.$store.state.auth.user_info.chats.find(
      //     ({ chat_id }) => chat_id === this.$data.active_chat.chat_id
      //   )
      //   if (!chatRowExists) {
      //     this.$store.commit('auth/addChat', {
      //       chat_id: this.$data.active_chat.chat_id,
      //       chat_type: this.$data.active_chat.chat_type,
      //       full_name: this.$data.active_chat.full_name,
      //       username: this.$data.active_chat.username,
      //       profile_photo: this.$data.active_chat.profile_photo,
      //       iam_amember_of_chat: true,
      //     })
      //   }
      //   const chat_exists =
      //     this.$store.state.auth.user_info.chats_messages.find(
      //       ({ _id }) => _id === this.$data.active_chat.chat_id
      //     )
      //   if (!chat_exists) {
      //     this.$store.commit('auth/createNewChat', {
      //       _id: this.$data.active_chat.chat_id,
      //       chat_type: this.$data.active_chat.chat_type,
      //       messages_list: this.$data.active_chat.messages,
      //       target_username: this.$data.active_chat.username,
      //     })
      //   }
      // }
    },
    async showChat(chatId, chatLocation) {
      this.$set(this.$data, 'chat_is_loading', true);

      const vm = this;
      let chat = null;

      function doGetChatMessages() {
        if (
          vm.$store.state.auth.user_info.chats_messages &&
          vm.$store.state.auth.user_info.chats_messages.length > 0
        ) {
          const chatsMessages = vm.$store.state.auth.user_info.chats_messages;
          if (chatsMessages && chat.sides) {
            const findResult = chatsMessages.find(
              ({ sides }) =>
                sides.user_1 === chat.username || sides.user_2 === chat.username
            );
            if (findResult && findResult.sides) {
              vm.$set(
                vm.$data.active_chat,
                'messages',
                findResult.messages_list
              );
            } else {
              vm.$set(vm.$data.active_chat, 'messages', null);
            }
          } else {
            console.log('cant find user.sides -> show_chat event');
            vm.$set(vm.$data.active_chat, 'messages', null);
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

      switch (chatLocation) {
        case 'chats_list':
          chat = this.user_info.chats.find(
            ({ chat_id: _chatId }) => _chatId === chatId
          );
          if (chat && chat.chat_type === 'private') {
            const msgsList = await this.fetch_chat_messages_list(chatId);
            this.$set(this.$data.active_chat, 'messages', msgsList);
          } else {
            const msgsList = await this.fetch_chat_messages_list(chatId);
            this.$set(this.$data.active_chat, 'messages', msgsList);
          }
          this.set_the_active_chat(chat);
          break;
        case 'search_chat_result':
          chat = this.$data.search_chat_result.find(
            ({ _id }) => _id === chatId
          );
          if (chat.chat_type === 'private') {
            doGetChatMessages();
          } else {
            this.getNonJoinedChatsMessage(chatId);
            this.set_the_active_chat(chat);
          }
          break;
        case 'search_chat_in_local':
          chat = this.$data.search_chat_in_local_result.find(
            ({ _id }) => _id === chatId
          );
          if (chat.chat_type === 'private') {
            doGetChatMessages();
          } else {
            this.getNonJoinedChatsMessage(chatId);
            this.set_the_active_chat(chat);
          }
          break;
      }

      if (chat && chat.username && chat.chat_type === 'private') {
        // TODO
        // window.ws.send(
        //   JSON.stringify({
        //     event: 'get_last_seen',
        //     username: chat.username,
        //   })
        // )
      }

      if (chat.chat_type !== 'private') {
        this.$set(this.$data.active_chat, 'members_length', chat.members);
      }

      this.$set(this.$data, 'search_chat_input', '');

      this.$set(this.$data, 'show_chat_view', true);
      this.$set(this.$data, 'chat_is_loading', false);
    },
    getNonJoinedChatsMessage(chatId) {
      // TODO
      // ws.send(
      //   JSON.stringify({
      //     event: 'get_chat_messages',
      //     chat_id,
      //   })
      // )
      // vm.$set(vm.$data, 'chat_is_loading', true)
    },
    set_the_active_chat(chat) {
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

      if (chat.chat_type !== 'private') {
        if (chat.iam_admin_of_chat) {
          this.$set(
            this.$data.active_chat,
            'iam_admin_of_chat',
            chat.iam_admin_of_chat
          );
        } else {
          this.$set(this.$data.active_chat, 'iam_admin_of_chat', false);
        }
        if (chat.iam_amember_of_chat) {
          this.$set(
            this.$data.active_chat,
            'iam_amember_of_chat',
            chat.iam_amember_of_chat
          );
        } else {
          this.$set(this.$data.active_chat, 'iam_amember_of_chat', false);
        }
      }
    },
    fetchChatMessagesList(chatId) {
      // NOTE
      // this method will be work when user clicked on the a chat
      // when its happened... we should going to user_chats_messages and finding the messages for that chat
      const chatsMessages = this.$store.state.auth.user_info.chats_messages;
      if (chatsMessages) {
        const findResult = chatsMessages.find(({ _id }) => _id === chatId);
        if (findResult) {
          return findResult.messages_list;
        }
      }
      return null;
    },
    getMessageSenderFullName(messageId) {
      if (this.$data.active_chat.chat_type === 'private') {
        return null;
      } else if (this.$data.active_chat.chat_type === 'channel') {
        return null;
      } else {
        const messageId = this.$store.state.auth.user_info.chats_messages;
        if (
          messageId &&
          messageId.length > 0 &&
          this.$data.active_chat.chat_id
        ) {
          const chat = messageId.find(
            ({ _id }) => _id === this.$data.active_chat.chat_id
          );
          if (chat) {
            const message = chat.messages_list.find(
              ({ message_id: _messageId }) => _messageId === messageId
            );
            if (message) {
              return message.sender_username;
            } else {
              console.error(
                'cannot find message in chat.vue->getMessageSenderFullName()'
              );
            }
          } else {
            console.error('chat not found on chat.vue->getMessageSenderFullName()');
          }
        }
      }
    },
    userHaveProfilePhoto() {
      // TODO
      // if (
      //   this.$store.state.auth.user_info.profile_photos &&
      //   this.$store.state.auth.user_info.profile_photos.length > 0
      // ) {
      //   const profilePhoto =
      //     this.$store.state.auth.user_info.profile_photos[0];
      //   if (profilePhoto && profilePhoto.filename) {
      //     const firstPhotoFileName = profilePhoto.filename;
      //     this.$set(
      //       this.$data,
      //       'user_default_avatar',
      //       this.$axios.defaults.baseURL +
      //         '/uploads/profile_photos/' +
      //         first_photo_filename
      //     );
      //   }
      // }
    },
    watchSearchChatInputChanges() {
      this.$store.watch(
        () => this.$data.search_chat_input,
        (value) => {
          let chatsList = this.$data.chats_list;
          if (typeof chatsList === "object") {
            chatsList = Array(this.$data.chats_list);
          }
          const input = this.$data.search_chat_input;
          if (input.trim()) {
            if (chatsList) {
              const localSearchResult = chatsList.filter((item) => {
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
                'search_chat_in_local_result',
                localSearchResult
              );
            }
            // TODO
            // if (ws) {
            //   ws.send(
            //     JSON.stringify({
            //       event: 'search_in_chats',
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
    // preview_user_profile() {
    //   // NOTE - We should remove it as much as possible
    //   // const list = [];
    //   // if (this.$data.active_chat.profile_photos) {
    //   //   this.$data.active_chat.profile_photos.forEach((item) => {
    //   //     const photo_addr = this.gimme_profile_photo_link_addr(item);
    //   //     if (photo_addr) {
    //   //       list.push({
    //   //         src: photo_addr,
    //   //       });
    //   //     }
    //   //   });
    //   //   if (list.length > 0) {
    //   //     this.show_view_image_modal(list, false);
    //   //   }
    //   // } else if (this.$data.active_chat.profile_photo) {
    //   //   const photo_addr = this.gimme_profile_photo_link_addr(
    //   //     this.$data.active_chat.profile_photo
    //   //   );
    //   //   if (photo_addr) {
    //   //     this.show_view_image_modal(
    //   //       [
    //   //         {
    //   //           src: photo_addr,
    //   //         },
    //   //       ],
    //   //       false
    //   //     );
    //   //   }
    //   // }
    // },
    // preview_self_profile() {
    //   const list = [];
    //   this.$store.state.auth.user_info.profile_photos.forEach((item) => {
    //     const photo_addr = this.gimme_profile_photo_link_addr(item);
    //     if (photo_addr) {
    //       list.push({
    //         src: photo_addr,
    //         filename: item.filename,
    //       });
    //     }
    //     if (list.length > 0) {
    //       this.show_view_image_modal(list, true);
    //     }
    //   });

    //   this.show_view_image_modal(list, true);
    // },
    showViewImageModal(list, showRemoveButton) {
      this.$set(this.$data.view_image, 'list', list);
      this.$set(this.$data.view_image, 'show', true);
      this.$set(
        this.$data.view_image,
        'show_remove_button',
        showRemoveButton
      );
    },
    showMessageContextMenu(e, messageId) {
      e.preventDefault();
      this.$set(this.$data, 'message_context_menu_message_id', messageId);
      this.$set(this.$data.context_menu_for_messages, 'show', false);
      this.$set(this.$data.context_menu_for_messages, 'x', e.clientX);
      this.$set(this.$data.context_menu_for_messages, 'y', e.clientY);
      this.$nextTick(() => {
        this.$set(this.$data.context_menu_for_messages, 'show', true);
      });
    },
    leaving_chat_button() {
      this.$set(this.$data, 'show_chat_view', false);
    },
    handleKeyButtons() {
      const vm = this;
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
          if (vm.$data.show_nav_drawer === true) {
            return vm.$set(vm.$data, 'show_nav_drawer', false);
          } else if (vm.$data.view_image.show === true) {
            return vm.$set(vm.$data.view_image, 'show', false);
          } else if (vm.$data.settings_dialog_active_section !== 'home') {
            return vm.$set(vm.$data, 'settings_dialog_active_section', 'home');
          } else if (vm.$data.show_settings_dialog === true) {
            return vm.$set(vm.$data, 'show_settings_dialog', false);
          } else if (vm.$data.show_chat_view === true) {
            vm.$set(vm.$data.active_chat, 'chat_id', null);
            vm.$set(vm.$data.active_chat, 'username', null);
            vm.$set(vm.$data.active_chat, 'full_name', null);
            vm.$set(vm.$data.active_chat, 'messages', null);
            vm.$set(vm.$data.active_chat, 'profile_photo', null);
            return vm.$set(vm.$data, 'show_chat_view', false);
          }
        }
      });
    },
    uploadProfilePhoto(e) {
      const file = e.files[0];
      const localPath = URL.createObjectURL(file);
      this.$set(this.$data.crop_profile_photo, 'src', localPath);
      this.$set(this.$data.crop_profile_photo, 'show', true);
    },
    uploadCroppedProfilePhoto() {
      this.$set(this.$data.crop_profile_photo, 'button_loading_state', true);
      this.$set(this.$data.crop_profile_photo, 'show', false);

      const canvas = this.$data.crop_profile_photo.canvas;
      if (canvas) {
        const croppedImage = canvas.toDataURL('image/png');
        const imageFile = window.dataURLtoFile(croppedImage, 'profile_photo');
        if (imageFile) {
          if (this.username && this.$store.state.auth.auth.auth_token) {
            const requestBody = new FormData();
            requestBody.append('photo', imageFile);

            this.$set(this.$data, 'photo_uploading_state', true);

            // TODO

          } else {
            console.log(
              'username or auth_token not found on sending photo as message'
            );
          }
        } else {
          console.log('no profile photo to upload');
        }
      } else
        console.log(
          'uploading profile photo failed! :: cropped image canvas is empty'
        );
    },
    watchProfilePhotoChanges() {
      // TODO
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
      //           'user_default_avatar',
      //           this.gimme_profile_photo_link_addr(value.profile_photos[0])
      //         );
      //       }
      //     }
      //   );
      // }
    },
    watchUserInfoChanges() {
      if (this.$store.state.users.userInfo) {
        this.$store.watch(
          (state) => state.users.userInfo,
          (value) => {
            // TODO
            // try {
            //   if (value && value[0].filename) {
            //     this.$set(this.$data, 'user_info', value);
            //   }
            // } catch {}
          }
        );
      }
    },
    cropProfilePhotoOnChange({ coordinates, canvas }) {
      this.$set(this.$data.crop_profile_photo, 'canvas', canvas);
    },
    cropPhotoMessageOnChange({ coordinates, canvas }) {
      this.$set(this.$data.crop_media_to_send, 'canvas', canvas);
    },
    deleteMessage() {
      const messageId = this.$data.message_context_menu_message_id;
      const chatId = this.$data.active_chat.chat_id;
      if (messageId && chatId) {
        // TODO
        // ws.send(
        //   JSON.stringify({
        //     event: 'delete_message',
        //     chat_id,
        //     message_id,
        //   })
        // );
      }
    },
    logout() {
      this.$router.push({ path: '/' + this.$i18n.locale + '/logout' });
    },
    error_occurred() {
      this.$set(this.$data, 'show_error_snakbar', true);
    },
  },
};
</script>
