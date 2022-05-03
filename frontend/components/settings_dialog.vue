<template>
  <v-dialog v-model="show_settings_dialog" max-width="450" scrollable>
    <div class="pt-2">
      <div v-if="settings_dialog_active_section == 'home'">
        <div class="d-flex justify-space-between align-center mb-2">
          <h3 class="text-h6 ml-4">{{ $t('settings') }}</h3>
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
            v-if="avatar"
            class="avatar"
          >
            <img :src="avatar" />
            <div v-if="photo_uploading" class="photo_uploading">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
          </div>

          <template v-else>
            <ColoredAvatar v-if="userName" :value="userName[0]" />
            <ColoredAvatar v-else :value="''" />
          </template>

          <div class="ml-4">
            <span class="text-white font-weight-medium d-block w-100">
              <template v-if="userData.full_name || userData.username">
                {{ userData.full_name || userData.username }}
              </template>
            </span>
            <span
              v-if="userData.last_seen"
              class="text-theme_color d-block w-100"
              >{{ userData.last_seen }}</span
            >
            <span v-else class="text-grey d-block w-100">{{
              $t('last_seen_recently')
            }}</span>
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
              <v-list-item-title>{{ $t('edit_profile') }}</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon class="icon">mdi-bell-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ $t('notifications') }}</v-list-item-title>
            </v-list-item>

            <v-list-item
              v-if="$i18n.locale == 'fa'"
              :to="switchLocalePath('en')"
            >
              <v-list-item-icon>
                <v-icon class="icon">mdi-keyboard-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <div class="d-flex justify-space-between">
                  <div>{{ $t('language') }}</div>
                  <div class="mr-2">
                    <span class="text-theme_color">English</span>
                  </div>
                </div>
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              v-if="$i18n.locale == 'en'"
              :to="switchLocalePath('fa')"
            >
              <v-list-item-icon>
                <v-icon class="icon">mdi-keyboard-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <div class="d-flex justify-space-between">
                  <div>{{ $t('language') }}</div>
                  <div class="mr-2">
                    <span class="text-theme_color">فارسی</span>
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
              <v-list-item-title>{{ $t('about_chatapp') }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div v-if="settings_dialog_active_section == 'edit_profile'">
        <v-dialog v-model="settings_dialog_edit_full_name" max-width="400">
          <div>
            <h3 style="font-size: 17px" class="mb-2 pb-0 pl-4 pt-2">
              {{ $t('edit_your_name') }}
            </h3>
            <div class="px-5 pt-0">
              <v-text-field
                v-model="update_full_name_input"
                :label="$t('full_name')"
              ></v-text-field>
            </div>
            <v-card-actions class="pr-2">
              <v-spacer></v-spacer>
              <v-btn
                :color="$configs.theme_color"
                text
                @click="settings_dialog_edit_full_name = false"
              >
                {{ $t('cancel') }}
              </v-btn>
              <v-btn
                :color="$configs.theme_color"
                text
                @click="submit_edit_full_name"
              >
                {{ $t('save') }}
              </v-btn>
            </v-card-actions>
          </div>
        </v-dialog>
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-btn
              icon
              depressed
              large
              class="ml-3"
              @click="settings_dialog_active_section = 'home'"
            >
              <v-icon class="icon"> mdi-arrow-left </v-icon>
            </v-btn>
            <h3 class="text-h6 ml-2">
              {{ $t('edit_profile') }}
            </h3>
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
            v-if="avatar"
            class="avatar avatar_xlarge"
          >
            <img :src="avatar" />
            <div v-if="photo_uploading" class="photo_uploading">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
          </div>
          <template v-else>
            <ColoredAvatar
              v-if="userName"
              :value="userName[0]"
              :avatar_xlarge="true"
            />
            <ColoredAvatar v-else :value="''" style="xlarge" />
          </template>

          <v-btn
            class="rounded-pill mt-4"
            depressed
            :color="$configs.theme_color"
            style="overflow: hidden"
          >
            <input
              id="upload_profile_photo_input"
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              style="opacity: 0; position: absolute; width: 200px; height: 40px"
              onchange="window.upload_profile_photo(this)"
            />
            {{ $t('set_profile_photo') }}
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
                  <span class="text-white d-block w-100">{{
                    userData.full_name || userData.username
                  }}</span>
                  <span
                    class="text-grey d-block w-100 mt-1"
                    style="font-size: 14px"
                    >{{ $t('name') }}</span
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
                  <span class="text-white d-block w-100">{{ username }}</span>
                  <span
                    class="text-grey d-block w-100 mt-1"
                    style="font-size: 14px"
                    >{{ $t('username') }}</span
                  >
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <!-- RULES -->

        <div class="px-5 py-3">
          <v-text-field
            v-model="bio_input"
            placeholder="Bio"
            counter="70"
            maxlength="70"
            @input="submit_bio_change"
          ></v-text-field>
          <p class="text-grey mt-2" :dir="$i18n.locale == 'fa' ? 'rtl' : 'ltr'">
            {{ $t('any_detail_such_as') }}
            <br />
            {{ $t('detail_example') }}
          </p>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'SettingsDialog',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    active_section: {
      type: String,
      default: 'home',
    },
    user_default_avatar: {
      type: String,
      default: null,
    },
    photo_uploading_state: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show_settings_dialog: false,
      settings_dialog_active_section: 'home',
      avatar: null,
      bio_input: '',
      update_full_name_input: '',
      photo_uploading: false,
      settings_dialog_edit_full_name: false,
      userName: "",
      username: ""
    };
  },
  watch: {
    show: {
      immediate: true,
      handler(newValue) {
        this.show_settings_dialog = newValue;
        this.$set(this.$data, 'settings_dialog_active_section', 'home');
      },
    },
    show_settings_dialog: {
      immediate: true,
      handler(newValue) {
        this.$emit('update:show', newValue);
      },
    },
    active_section: {
      immediate: true,
      handler(newValue) {
        this.settings_dialog_active_section = newValue;
      },
    },
    user_default_avatar: {
      immediate: true,
      handler(newValue) {
        this.avatar = newValue;
      },
    },
    photo_uploading_state: {
      immediate: true,
      handler(newValue) {
        this.photo_uploading = newValue;
      },
    },
  },
  mounted() {
    this.$set(
      this.$data,
      'bio_input',
      this.$store.state.users.userData.bio || ''
    );
    this.$set(
      this.$data,
      'update_full_name_input',
      this.$store.state.users.userData.full_name ||
        this.$store.state.users.userData.username
    );
    this.$set(
      this.$data,
      'userName',
      this.$store.state.users.userData.full_name || this.$store.state.users.userData.userName
    );
    this.$set(
      this.$data,
      'username',
      this.$store.state.users.userData.username
    );
  },
  methods: {
    close() {
      this.$emit('update:show', false);
    },
  },
};
</script>
