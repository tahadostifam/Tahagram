<template>
  <div>
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
          <v-btn
            :color="theme_color"
            text
            @click="set_croped_photo"
            :loading="crop_profile_photo.button_loading_state"
          >
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="450" v-model="show_dialog" scrollable>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title class="text-h6"> New Channel </v-card-title>
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
        <template v-if="dialog_step == 1">
          <div class="d-flex align-center px-4">
            <input
              type="file"
              hidden
              id="channel_profile_photo"
              @change="choosing_channel_photo($event)"
            />
            <label
              class="avatar avatar_xlarge"
              v-if="avatar_src"
              for="channel_profile_photo"
            >
              <img :src="avatar_src" />
            </label>

            <template v-else>
              <label
                for="channel_profile_photo"
                class="solid_color_avatar avatar_xlarge"
                style="cursor: pointer"
              >
                <v-icon x-large>mdi-camera</v-icon>
              </label>
            </template>

            <div class="ml-5 d-block" style="width: calc(100% - 155px)">
              <v-text-field
                label="Channel name"
                :full-with="true"
                maxlength="30"
                v-model="channel_name"
              ></v-text-field>
            </div>
          </div>
          <div class="px-6 pb-2 pt-2">
            <v-text-field
              label="Description"
              :full-with="true"
              counter="200"
              maxlength="200"
              v-model="channel_desc"
            ></v-text-field>
          </div>

          <v-card-actions class="pr-2">
            <v-spacer></v-spacer>
            <v-btn :color="theme_color" text @click="show_dialog = false">
              CANCEL
            </v-btn>
            <v-btn
              :disabled="channel_name.trim().length == 0"
              @click="dialog_step = 2"
              :color="theme_color"
              text
            >
              NEXT
            </v-btn>
          </v-card-actions>
        </template>
        <template v-if="dialog_step == 2">
          <div class="px-6">
            <v-text-field
              label="Channel username"
              :full-with="true"
              maxlength="60"
              @keyup="keyup_username_event"
              v-model="channel_username"
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
              BACK
            </v-btn>
            <v-btn
              :disabled="
                channel_username.trim().length == 0 ||
                chat_is_available_state == false
              "
              :loading="submit_button_loading_state"
              @click="submit_create_channel"
              :color="theme_color"
              text
            >
              CREATE
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import configs from "@/assets/javascript/configs";
import slugify from "slugify";

export default {
  name: "CreateChannelDialog",
  data() {
    return {
      dialog_step: 1,
      theme_color: configs.theme_color,
      show_dialog: false,
      avatar_src: null,
      channel_name: "",
      channel_desc: "",
      channel_username: "",
      crop_profile_photo: {
        show: false,
        src: null,
        canvas: null,
        button_loading_state: false,
      },
      submit_button_loading_state: false,
      chat_is_available_state: null,
    };
  },
  methods: {
    choosing_channel_photo(e) {
      const file = e.target.files[0];
      if (file) {
        const local_path = URL.createObjectURL(file);
        if (local_path) {
          this.$set(this.$data.crop_profile_photo, "src", local_path);
          this.$set(this.$data.crop_profile_photo, "show", true);
        } else {
          console.error("local_path not found");
        }
      } else {
        console.error("profile_photo file not found");
      }
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
    submit_create_channel() {
      const username = this.$data.channel_username;
      const name = this.$data.channel_name;
      const desc = this.$data.channel_desc;
      const canvas = this.$data.crop_profile_photo.canvas;

      const request_body = new FormData();

      if (name.trim().length > 0 && username.trim().length > 0) {
        request_body.append("channel_username", username);
        request_body.append("channel_name", name);
        if (canvas) {
          const croppedImage = canvas.toDataURL("image/png");
          const imageFile = window.dataURLtoFile(croppedImage, "profile_photo");
          request_body.append("profile_photo", imageFile);
        }
        if (desc) {
          request_body.append("bio", desc);
        }

        this.$set(this.$data, "submit_button_loading_state", true);
        this.$axios
          .$post("/api/chats/create_channel", request_body, {
            headers: {
              username: this.$store.state.auth.auth.username,
              auth_token: this.$store.state.auth.auth.auth_token,
            },
          })
          .then((response) => {
            if (response.message == "channel created") {
              let data_to_callback = {
                chat_id: response.chat_id,
                name: name,
                username: username,
                chat_type: "channel",
              };
              if (desc) {
                data_to_callback["bio"] = desc;
              }

              if (response.profile_photo) {
                data_to_callback["profile_photo"] = {
                  filename: response.profile_photo,
                };
              }
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
    clear_all_items() {
      this.$set(this.$data, "channel_username", "");
      this.$set(this.$data, "channel_name", "");
      this.$set(this.$data, "channel_desc", "");
      this.$set(this.$data, "avatar_src", "");
      this.$set(this.$data, "dialog_step", 1);
      this.$set(this.$data, "crop_profile_photo", {
        show: false,
        src: null,
        canvas: null,
        button_loading_state: false,
      });
    },
    keyup_username_event() {
      const username = this.$data.channel_username;
      if (username.trim().length > 0) {
        let limited_username = slugify(username, {
          lower: true,
          strict: false,
          locale: "vi",
        });
        this.$set(this.$data, "channel_username", limited_username);

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
  mounted() {
    window.choosing_channel_photo = this.choosing_channel_photo;
  },
  props: ["show"],
  watch: {
    show: {
      immediate: true,
      handler(new_value) {
        this.show_dialog = new_value;
        this.clear_all_items();
      },
    },
    show_dialog: {
      immediate: true,
      handler(new_value) {
        this.$emit("update:show", new_value);
        this.clear_all_items();
      },
    },
  },
};
</script>
