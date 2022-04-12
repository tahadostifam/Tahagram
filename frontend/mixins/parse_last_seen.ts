import Vue from "vue";

export default Vue.extend({
  data() {
    return {};
  },
  methods: {
    getLastSeen(lastSeen: string): string {
      if (lastSeen !== "online") {
        try {
          const lastSeenNumber = parseInt(lastSeen);
          if (lastSeenNumber) {
            const date = new Date(lastSeenNumber);
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours || 12;
            const minutesString = minutes < 10 ? "0" + minutes : minutes;
            const fullTimeString =
              hours + ":" + minutesString + " " + String(ampm).toUpperCase();
            return this.$t("last_seen_at", [fullTimeString.trim()]).toString();
          }
        } catch {
          return this.$t("last_seen_recently").toString();
        }
      } else {
        return this.$t("online").toString();
      }
      return ""
    },
  },
})
