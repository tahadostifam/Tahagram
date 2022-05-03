<template>
  <div>
    <div>
      <ErrorSnakbar
        :show="show_error_snakbar"
        @update:show="(newValue) => (show_error_snakbar = newValue)"
      ></ErrorSnakbar>

      <ViewImage
        :images_list="view_image.list"
        :show="view_image.show"
        :show_remove_button="view_image.show_remove_button"
        @closeButton="view_image.show = false"
        @removeButton="removeProfilePhoto"
      ></ViewImage>

      <NavDrawer
        :show="show_nav_drawer"
        :user_default_avatar="user_default_avatar"
        @logout="logout"
        @showSettingsDialog="
          show_nav_drawer = false;
          show_settings_dialog = true;
        "
        @showCreateChannelDialog="
          show_nav_drawer = false;
          show_create_channel_dialog = true;
        "
        @showCreateGroupDialog="
          show_nav_drawer = false;
          show_create_group_dialog = true;
        "
        @update:show="(new_value) => (show_nav_drawer = new_value)"
      ></NavDrawer>

      
      <SettingsDialog
        :show="show_settings_dialog"
        :user_default_avatar="user_default_avatar"
        :active_section="settings_dialog_active_section"
        :photo_uploading_state="photo_uploading_state"
        @update:show="(new_value) => (show_settings_dialog = new_value)"
      ></SettingsDialog>

      <v-dialog v-model="crop_profile_photo.show" max-width="350">
        <div class="pa-5 pb-0">
          <cropper
            :src="crop_profile_photo.src"
            :stencil-size="{
              width: 280,
              height: 280,
            }"
            @change="cropProfilePhotoOnChange"
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
            >
              SAVE
            </v-btn>
          </v-card-actions>
        </div>
      </v-dialog>

      <v-dialog v-model="cropPhotoMessage.show" max-width="350">
        <div class="pa-5 pb-0">
          <cropper
            :src="cropPhotoMessage.src"
            @change="cropPhotoMessageOnChange"
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
              @click="cropPhotoMessage.show = false"
            >
              {{ $t('cancel') }}
            </v-btn>
            <v-btn
              :color="$configs.theme_color"
              text
              :loading="cropPhotoMessage.button_loading_state"
            >
              {{ $t('send') }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-dialog>

<!-- 

      <CreateChannelDialog
        :show="show_create_channel_dialog"
        @close_button="show_create_channel_dialog = false"
        @update:show="
          (new_value) => (show_create_channel_dialog = new_value)
        "
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
        @update:show="(new_value) => (view_user_profile.show = new_value)"
        @view_member_profile="view_member_profile"
        @remove_button="remove_profile_photo"
      ></ViewUserProfile> -->
    </div>
  </div>
</template>

<script>
// import { EmojiPicker } from 'vue-emoji-picker';
// import { Cropper } from 'vue-advanced-cropper';
import parseLastSeen from '../mixins/parse_date';

export default {
  name: 'MainComponent',
  components: {
    // EmojiPicker,
    // Cropper,
  },
  mixins: [parseLastSeen],
  data() {
    return {
      // Bars :: Begin
      show_error_snakbar: false,
      show_internet_bar: false,
      updating_user_info_state: false,
      // Bars :: End
      send_text_message_input: '',
      show_chat_view: false,
      chat_is_loading: false,
      show_nav_drawer: true,
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

      cropPhotoMessage: {
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
    userName() {
      return this.$store.state.users.userData.username;
    },
  },
  mounted() {},
  methods: {
    removeProfilePhoto() {},
    cropProfilePhotoOnChange() {},
    cropPhotoMessageOnChange() {},
    logout() {},
  },
};
</script>
