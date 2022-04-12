<template>
  <div>
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
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            :color="$configs.theme_color"
            text
            :loading="crop_profile_photo.button_loading_state"
            @click="setCroppedPhoto"
          >
            {{ $t("save") }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-dialog>

    <v-dialog v-model="show_dialog" max-width="450" scrollable>
      <div>
        <div class="d-flex justify-space-between align-center">
          <v-card-title class="text-h6"> {{ $t("new_channel") }} </v-card-title>
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
              id="channel_profile_photo"
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              hidden
              @change="choosingChannelPhoto($event)"
            />
            <label
              v-if="avatar_src"
              class="avatar avatar_xlarge"
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
                v-model="channel_name"
                :label="$t('channel_name')"
                :full-with="true"
                maxlength="30"
              ></v-text-field>
            </div>
          </div>
          <div class="px-6 pb-2 pt-2">
            <v-text-field
              v-model="channel_desc"
              :label="$t('desc')"
              :full-with="true"
              counter="200"
              maxlength="200"
            ></v-text-field>
          </div>

          <v-card-actions class="pr-2">
            <v-spacer></v-spacer>
            <v-btn :color="$configs.theme_color" text @click="show_dialog = false">
              {{ $t("cancel") }}
            </v-btn>
            <v-btn
              :disabled="channel_name.trim().length == 0"
              :color="$configs.theme_color"
              text
              @click="dialog_step = 2"
            >
              {{ $t("next") }}
            </v-btn>
          </v-card-actions>
        </template>
        <template v-if="dialog_step == 2">
          <div class="px-6">
            <v-text-field
              v-model="channel_username"
              :label="$t('channel_username')"
              :full-with="true"
              maxlength="60"
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
            <v-btn :color="$configs.theme_color" text @click="dialog_step = 1">
              {{ $t("back") }}
            </v-btn>
            <v-btn
              :disabled="
                channel_username.trim().length == 0 ||
                chat_is_available_state == false
              "
              :loading="submit_button_loading_state"
              :color="$configs.theme_color"
              text
              @click="submit_create_channel"
            >
              {{ $t("create") }}
            </v-btn>
          </v-card-actions>
        </template>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IImageCropperCallback } from "../lib/interfaces";
import validateUsername from "../mixins/validate_username";

export default Vue.extend({
  name: "CreateChannelDialog",
  mixins: [validateUsername],
  props: {
    show:{
      type: String,
      required: true
    }
  },
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
  watch: {
    show: {
      immediate: true,
      handler(newValue: Boolean) {
        this.$set(this.$data, "show_dialog", newValue)
        this.clear_all_items();
      },
    },
    show_dialog: {
      immediate: true,
      handler(newValue: Boolean) {
        this.$emit("update:show", newValue);
        this.clear_all_items();
      },
    },
  },
  mounted() {
    // FIXME
    // window.choosingChannelPhoto = this.choosingChannelPhoto;
  },
  methods: {
    choosingChannelPhoto(e: any) {
      const file = e.target.files[0];
      if (file) {
        const localPath = URL.createObjectURL(file);
        if (localPath) {
          this.$set(this.$data.crop_profile_photo, "src", localPath);
          this.$set(this.$data.crop_profile_photo, "show", true);
        } else {
          console.error("localPath not found");
        }
      } else {
        console.error("profile_photo file not found");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cropProfilePhotoOnChange({ coordinates, canvas }: IImageCropperCallback) {
      this.$set(this.$data.crop_profile_photo, "canvas", canvas);
    },
    setCroppedPhoto() {
      // FIXME
      // this.$set(this.$data.crop_profile_photo, "button_loading_state", true);
      // this.$set(this.$data.crop_profile_photo, "show", false);

      // const canvas = this.$data.crop_profile_photo.canvas;
      // if (canvas) {
      //   const croppedImage = canvas.toDataURL("image/png");
      //   const imageFile = window.dataURLtoFile(croppedImage, "profile_photo");

      //   if (imageFile) {
      //     this.$set(this.$data, "avatar_src", URL.createObjectURL(imageFile));
      //   }
      // } else
      //   console.log(
      //     "uploading profile photo failed! :: cropped image canvas is empty"
      //   );
      this.$set(this.$data.crop_profile_photo, "button_loading_state", false);
    },
    submit_create_channel() {
      // const vm = this;
      // const username = this.$data.channel_username;
      // const name = this.$data.channel_name;
      // const desc = this.$data.channel_desc;
      // const canvas = this.$data.crop_profile_photo.canvas;

      // const requestBody = new FormData();

      // if (name.trim().length > 0 && username.trim().length > 0) { FIXME
      //   requestBody.append("channel_username", username);
      //   requestBody.append("channel_name", name);
      //   if (canvas) {
      //     const croppedImage = canvas.toDataURL("image/png");
      //     const imageFile = window.dataURLtoFile(croppedImage, "profile_photo");
      //     requestBody.append("profile_photo", imageFile);
      //   }
      //   if (desc) {
      //     requestBody.append("bio", desc);
      //   }

      //   this.$set(this.$data, "submit_button_loading_state", true);
      //   this.$axios
      //     .$post("/api/chats/create_channel", requestBody, {
      //       headers: {
      //         username: vm.username,
      //         auth_token: vm.$store.state.auth.auth.auth_token,
      //       },
      //     })
      //     .then((response) => {
      //       if (response.message == "channel created") {
      //         const dataToCallback = {
      //           chat_id: response.chat_id,
      //           name,
      //           username,
      //           chat_type: "channel",
      //         };
      //         if (desc) {
      //           dataToCallback.bio = desc;
      //         }

      //         if (response.profile_photo) {
      //           dataToCallback.profile_photo = {
      //             filename: response.profile_photo,
      //           };
      //         }
      //         this.$emit("chat_created", dataToCallback);
      //       } else {
      //         throw new Error("An error occurred on the server side");
      //       }
      //     })
      //     .catch((error) => {
      //       if (error.response.status == 401) {
      //         alert("unauthorized");
      //       } else if (
      //         error.response.message == "another chat exists with this username"
      //       ) {
      //         this.$set(this.$data, "chat_is_available_state", false);
      //       } else {
      //         throw new Error("An error occurred on the server side");
      //       }
      //     })
      //     .finally(() => {
      //       this.$set(this.$data, "submit_button_loading_state", false);
      //     });
      // }
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
        const limitedUsername = this.validate_username(username);
        this.$set(this.$data, "channel_username", limitedUsername);

        // SECTION - checking username existly

        // window.ws.send( FIXME
        //   JSON.stringify({
        //     event: "check_username_existly",
        //     username: username,
        //   })
        // );

        // window.ws.onmessage = (event) => {
        //   let parsedData;
        //   try {
        //     parsedData = JSON.parse(event.data);
        //   } catch {}
        //   if (parsedData) {
        //     if (
        //       parsedData.message == "chat exists" &&
        //       parsedData.username == username
        //     ) {
        //       this.$set(this.$data, "chat_is_available_state", false);
        //     } else if (
        //       parsedData.message == "chat not exists" &&
        //       parsedData.username == username
        //     ) {
        //       this.$set(this.$data, "chat_is_available_state", true);
        //     } else {
        //       this.$set(this.$data, "chat_is_available_state", null);
        //     }
        //   }
        // };
      }
    },
  },
});
</script>
