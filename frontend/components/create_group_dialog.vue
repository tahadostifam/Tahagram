<template>
  <div>
    <v-dialog max-width="450" v-model="show_dialog" scrollable>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title class="text-h6"> New Group </v-card-title>
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
            label="Group name"
            :full-with="true"
            maxlength="30"
            v-model="group_name"
          ></v-text-field>

          <v-text-field
            label="Group username"
            :full-with="true"
            maxlength="30"
            v-model="group_username"
          ></v-text-field>
        </div>

        <v-card-actions class="pr-2">
          <v-spacer></v-spacer>
          <v-btn :color="theme_color" text @click="show_dialog = false">
            CANCEL
          </v-btn>
          <v-btn @click="sumit_create_group" :color="theme_color" text>
            CREATE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import configs from "@/assets/javascript/configs";

export default {
  name: "CreateGroupDialog",
  data() {
    return {
      dialog_step: 1,
      theme_color: configs.theme_color,
      show_dialog: false,
      group_name: "",
      group_username: "",
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
    sumit_create_group() {
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
