export default {
  data() {
    return {}
  },
  methods: {
    parseLastSeen(lastSeen) {
      if (lastSeen !== 'online') {
        try {
          const lastSeenNumber = parseInt(lastSeen)
          if (lastSeenNumber) {
            const date = new Date(lastSeenNumber)
            let hours = date.getHours()
            let minutes = date.getMinutes()
            const ampm = hours >= 12 ? 'pm' : 'am'
            hours = hours % 12
            hours = hours || 12
            minutes = minutes < 10 ? '0' + minutes : minutes
            const timeString =
              hours + ':' + minutes + ' ' + String(ampm).toUpperCase()

            return this.$t('last_seen_at', [timeString.trim()])
          }
        } catch {
          return this.$t('last_seen_recently')
        }
      } else {
        return this.$t('Online')
      }
    },
    parseMessageDate(sendTime) {
      const date = new Date(sendTime)

      let hours = date.getHours()
      let minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'pm' : 'am'
      hours = hours % 12
      hours = hours || 12
      minutes = minutes < 10 ? '0' + minutes : minutes
      const timeString =
        hours + ':' + minutes + ' ' + String(ampm).toUpperCase()

      return timeString
    },
  },
}
