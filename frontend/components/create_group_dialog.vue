<template>
  <div>
    <v-dialog max-width="450" v-model="show_dialog" scrollable>
      <div>
        <div class="d-flex justify-space-between align-center">
          <h3 class="text-h6">{{ $t("new_group") }}</h3>
          <div class="mr-2">
            <v-btn
              large
              icon
              style="padding-top: 3px"
              @click="$emit('close_button')"
            >
              <v-icon class="icon"> mdi-close </v-icon>
            </v-btn>
          </div>
        </div>

        <div class="px-4">
          <v-text-field
            :label="$t('group_name')"
            :full-with="true"
            maxlength="30"
            v-model="group_name"
          ></v-text-field>

          <v-text-field
            :label="$t('group_username')"
            :full-with="true"
            maxlength="30"
            v-model="group_username"
            @keyup="keyup_username_event"
          ></v-text-field>
          <p
            v-if="chat_is_available_state != null"
            :class="{
              'text-theme_color': chat_is_available_state == true,
              'text-red': chat_is_available_state == false,
            }"
          >
            <template v-if="chat_is_available_state">Available</template>
            <template v-if="!chat_is_available_state">Not Available</template>
          </p>
        </div>

        <v-card-actions class="pr-2">
          <v-spacer></v-spacer>
          <v-btn :color="theme_color" text @click="dialog_step = 1">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            :disabled="
              group_username.trim().length == 0 ||
              chat_is_available_state == false
            "
            :loading="submit_button_loading_state"
            @click="submit_create_group"
            :color="theme_color"
            text
          >
            {{ $t("create") }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import configs from "@/assets/javascript/configs";
import slugify from "slugify";

export default {
  name: "CreateGroupDialog",
  data() {
    return {
      dialog_step: 1,
      theme_color: configs.theme_color,
      show_dialog: false,
      group_name: "",
      group_username: "",
      chat_is_available_state: null,
      submit_button_loading_state: false,
    };
  },
  methods: {
    choosing_channel_photo(e) {
      const file = e.files[0];
      const local_path = URL.createObjectURL(file);
      this.$set(this.$data.crop_profile_photo, "src", local_path);
      this.$set(this.$data.crop_profile_photo, "show", true);
    },
    crop_profile_photo_onchange({ coordinates, canvas }) {
      this.$set(this.$data.crop_profile_photo, "canvas", canvas);
    },
    set_croped_photo() {
      this.$set(this.$data.crop_profile_photo, "button_loading_state", true);
      this.$set(this.$data.crop_profile_photo, "show", false);

      const canvas = this.$data.crop_profile_photo.canvas;
      if (canvas) {
        const croppedImage = canvas.toDataURL("image/png");
        const imageFile = window.dataURLtoFile(croppedImage, "profile_photo");

        if (imageFile) {
          this.$set(this.$data, "avatar_src", URL.createObjectURL(imageFile));
        }
      } else
        console.log(
          "uploading profile photo failed! :: cropped image canvas is empty"
        );
      this.$set(this.$data.crop_profile_photo, "button_loading_state", false);
    },
    submit_create_group() {
      const username = this.$data.group_username;
      const name = this.$data.group_name;

      if (name.trim().length > 0 && username.trim().length > 0) {
        this.$set(this.$data, "submit_button_loading_state", true);
        this.$axios
          .$post(
            "/api/chats/create_group",
            {
              group_name: name,
              group_username: username,
            },
            {
              headers: {
                username: this.$store.state.auth.auth.username,
                auth_token: this.$store.state.auth.auth.auth_token,
              },
            }
          )
          .then((response) => {
            console.log(response);
            if (response.message == "group created") {
              let data_to_callback = {
                chat_id: response.chat_id,
                name: name,
                username: username,
                chat_type: "group",
              };

              this.$emit("chat_created", data_to_callback);
            } else {
              throw new Error("An error occurred on the server side");
            }
          })
          .catch((error) => {
            if (error.response.status == 401) {
              alert("unauthorized");
            } else if (
              error.response.message == "another chat exists with this username"
            ) {
              this.$set(this.$data, "chat_is_available_state", false);
            } else {
              throw new Error("An error occurred on the server side");
            }
          })
          .finally(() => {
            this.$set(this.$data, "submit_button_loading_state", false);
          });
      }
    },
    keyup_username_event() {
      const username = this.$data.group_username;
      if (username.trim().length > 0) {
        let limited_username = slugify(username, {
          lower: true,
          strict: false,
          locale: "vi",
        });
        this.$set(this.$data, "group_username", limited_username);

        // SECTION - checking username existly

        window.ws.send(
          JSON.stringify({
            event: "check_username_existly",
            username: username,
          })
        );

        window.ws.onmessage = (event) => {
          let parsedData;
          try {
            parsedData = JSON.parse(event.data);
          } catch {}
          if (parsedData) {
            if (
              parsedData.message == "chat exists" &&
              parsedData.username == username
            ) {
              this.$set(this.$data, "chat_is_available_state", false);
            } else if (
              parsedData.message == "chat not exists" &&
              parsedData.username == username
            ) {
              this.$set(this.$data, "chat_is_available_state", true);
            } else {
              this.$set(this.$data, "chat_is_available_state", null);
            }
          }
        };
      }
    },
  },
  mounted() {},
  props: ["show"],
  watch: {
    show: {
      immediate: true,
      handler(new_value) {
        this.show_dialog = new_value;
      },
    },
    show_dialog: {
      immediate: true,
      handler(new_value) {
        this.$emit("update:show", new_value);
      },
    },
  },
};
</script>
