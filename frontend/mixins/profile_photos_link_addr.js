export default {
  data() {
    return {};
  },
  methods: {
    gimme_profile_photo_link_addr(profile_photo) {
      if (profile_photo && profile_photo.filename) {
        return (
          this.$axios.defaults.baseURL +
          "/uploads/profile_photos/" +
          profile_photo.filename
        );
      }
    },
  },
};
