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
              onchange="window.choosing_channel_photo(this)"
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
            <v-btn @click="dialog_step = 2" :color="theme_color" text>
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
              v-model="channel_username"
            ></v-text-field>
          </div>

          <v-card-actions class="pr-2">
            <v-spacer></v-spacer>
            <v-btn :color="theme_color" text @click="dialog_step = 1">
              BACK
            </v-btn>
            <v-btn @click="sumit_create_channel" :color="theme_color" text>
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
    sumit_create_channel() {
      console.log("submit");
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
