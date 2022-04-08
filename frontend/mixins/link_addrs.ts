import Vue from "vue/types/umd";

export default Vue.extend({
  methods: {
    profilePhotoLinkAddr(profilePhoto: any) {
      if (profilePhoto && profilePhoto.filename) {
        return (
          this. $axios.defaults.baseURL +
          "/api/uploads/profile_photos/" +
          profilePhoto.filename
        );
      }
      return ""
    },
    gimme_photo_message_link_addr(fileName: any) {
      if (fileName) {
        return (
          this.$axios.defaults.baseURL +
          "/api/uploads/photo_messages/" +
          fileName
        );
      }
    },
  },
});
