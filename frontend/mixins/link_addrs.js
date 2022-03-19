export default {
  data() {
    return {};
  },
  methods: {
    gimme_profile_photo_link_addr(profile_photo) {
      if (profile_photo && profile_photo.filename) {
        return (
          this.$axios.defaults.baseURL +
          "/api/uploads/profile_photos/" +
          profile_photo.filename
        );
      }
    },
    gimme_photo_message_link_addr(filename) {
      if (filename) {
        return (
          this.$axios.defaults.baseURL +
          "/api/uploads/photo_messages/" +
          filename
        );
      }
    },
  },
};
