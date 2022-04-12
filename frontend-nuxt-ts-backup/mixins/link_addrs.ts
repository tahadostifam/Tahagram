import Vue from "vue";

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
    gimmePhotoMessageLinkAddr(fileName: any) {
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
