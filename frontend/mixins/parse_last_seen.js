export default {
  data() {
    return {};
  },
  methods: {
    get_last_seen(last_seen) {
      if (last_seen != "online") {
        try {
          const last_seen_number = parseInt(last_seen);
          if (last_seen_number) {
            const date = new Date(last_seen_number);
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            let time_string =
              hours + ":" + minutes + " " + String(ampm).toUpperCase();

            return this.$t("last_seen_at", [time_string.trim()]);
          }
        } catch {
          return this.$t("last_seen_recently");
        }
      } else {
        return this.$t("online");
      }
    },
  },
};
