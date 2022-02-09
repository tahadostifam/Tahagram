<template>
  <v-dialog max-width="450" v-model="show_settings_dialog" scrollable>
    <div class="pt-2">
      <div v-if="settings_dialog_active_section == 'home'">
        <div class="d-flex justify-space-between align-center mb-2">
          <h3 class="text-h6 ml-4">{{ $t("settings") }}</h3>
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
            v-if="avatar"
            @click="$emit('preview_self_profile')"
          >
            <img :src="avatar" />
            <div class="photo_uploading" v-if="photo_uploading">
              <v-progress-circular indeterminate></v-progress-circular>
            </div>
          </div>

          <template v-else>
            <ColoredAvatar
              v-if="user_info.full_name"
              :value="user_info.full_name[0]"
            />
            <ColoredAvatar v-else :value="''" />
          </template>

          <div class="ml-4">
            <span class="text-white font-weight-medium d-block w-100">
              <template v-if="user_info.full_name">
                {{ user_info.full_name }}
              </template>
            </span>
            <span
              class="text-theme_color d-block w-100"
              v-if="user_info.last_seen"
              >{{ user_info.last_seen }}</span
            >
            <span class="text-grey d-block w-100" v-else>{{
              $t("last_seen_recently")
            }}</span>
            <!-- TODO -->
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
              <v-list-item-title>{{ $t("edit_profile") }}</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon class="icon">mdi-bell-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ $t("notifications") }}</v-list-item-title>
            </v-list-item>

            <v-list-item
              :to="switchLocalePath('en')"
              v-if="$i18n.locale == 'fa'"
            >
              <v-list-item-icon>
                <v-icon class="icon">mdi-keyboard-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <div class="d-flex justify-space-between">
                  <div>{{ $t("language") }}</div>
                  <div class="mr-2">
                    <span class="text-theme_color">English</span>
                  </div>
                </div>
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              :to="switchLocalePath('fa')"
              v-if="$i18n.locale == 'en'"
            >
              <v-list-item-icon>
                <v-icon class="icon">mdi-keyboard-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <div class="d-flex justify-space-between">
                  <div>{{ $t("language") }}</div>
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
              <v-list-item-title>{{ $t("about_chatapp") }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div v-if="settings_dialog_active_section == 'edit_profile'">
        <v-dialog max-width="400" v-model="settings_dialog_edit_full_name">
          <div>
            <h3 style="font-size: 17px" class="mb-2 pb-0 pl-4 pt-2">
              {{ $t("edit_your_name") }}
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
                :color="theme_color"
                text
                @click="settings_dialog_edit_full_name = false"
              >
                {{ $t("cancel") }}
              </v-btn>
              <v-btn @click="submit_edit_full_name" :color="theme_color" text>
                {{ $t("save") }}
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
              {{ $t("edit_profile") }}
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
            class="avatar avatar_xlarge"
            v-if="avatar"
            @click="$emit('preview_self_profile')"
          >
            <img :src="avatar" />
            <div class="photo_uploading" v-if="photo_uploading">
              <v-progress-circular indeterminate></v-progress-circular>
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
            {{ $t("set_profile_photo") }}
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
                    user_info.full_name
                  }}</span>
                  <span
                    class="text-grey d-block w-100 mt-1"
                    style="font-size: 14px"
                    >{{ $t("name") }}</span
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
                  <span class="text-white d-block w-100">{{
                    user_info.username
                  }}</span>
                  <span
                    class="text-grey d-block w-100 mt-1"
                    style="font-size: 14px"
                    >{{ $t("username") }}</span
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
          <p
            class="text-grey mt-2"
            :dir="this.$i18n.locale == 'fa' ? 'rtl' : 'ltr'"
          >
            {{ $t("any_detail_such_as") }}
            <br />
            {{ $t("detail_example") }}
          </p>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import configs from "@/assets/javascript/configs";

export default {
  name: "SettingsDialog",
  data() {
    return {
      show_settings_dialog: false,
      settings_dialog_active_section: "home",
      avatar: null,
      theme_color: configs.theme_color,
      bio_input: "",
      update_full_name_input: "",
      photo_uploading: false,
      settings_dialog_edit_full_name: false,
    };
  },
  mounted() {
    this.$set(this.$data, "bio_input", this.$store.state.auth.user_info.bio);
    this.$set(
      this.$data,
      "update_full_name_input",
      this.$store.state.auth.user_info.full_name
    );
  },
  watch: {
    show: {
      immediate: true,
      handler(new_value) {
        this.show_settings_dialog = new_value;
        this.$set(this.$data, "settings_dialog_active_section", "home");
      },
    },
    show_settings_dialog: {
      immediate: true,
      handler(new_value) {
        this.$emit("update:show", new_value);
      },
    },
    active_section: {
      immediate: true,
      handler(new_value) {
        this.settings_dialog_active_section = new_value;
      },
    },
    user_default_avatar: {
      immediate: true,
      handler(new_value) {
        this.avatar = new_value;
      },
    },
    photo_uploading_state: {
      immediate: true,
      handler(new_value) {
        this.photo_uploading = new_value;
      },
    },
  },
  props: {
    user_info: {},
    show: {
      type: Boolean,
    },
    active_section: {
      type: String,
    },
    user_default_avatar: {
      type: String,
    },
    photo_uploading_state: {
      type: Boolean,
    },
    initilizing_socket_again: {},
  },
  methods: {
    close() {
      this.$emit("update:show", false);
    },
    submit_bio_change() {
      const ws = window.ws;
      if (ws) {
        ws.send(
          JSON.stringify({
            event: "update_bio",
            bio: this.$data.bio_input,
          })
        );
      } else {
        this.$emit("initilizing_socket_again").then(() => {
          this.submit_bio_change();
        });
      }
    },
    submit_edit_full_name() {
      window.ws.send(
        JSON.stringify({
          event: "update_full_name",
          full_name: this.$data.update_full_name_input,
        })
      );
      this.$set(this.$data, "settings_dialog_edit_full_name", false);
    },
  },
};
</script>
