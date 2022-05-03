<template>
  <v-navigation-drawer
    v-model="show_nav_drawer"
    absolute
    temporary
    :width="nav_drawer_width"
  >
    <v-list nav>
      <v-list-item
        id="avatar_at_nav_drawer"
        class="py-5 px-4 bg-theme rounded-0"
      >
        <div
          v-if="user_default_avatar"
          class="image ml-2"
          style="position: relative; top: 3px"
        >
          <img
            :src="user_default_avatar"
            class="avatar"
            onload="window.lazyImage(this)"
            style="--size: 40px"
          />
        </div>

        <v-list-item-title class="ml-3" style="font-weight: 600">{{
          userName
        }}</v-list-item-title>
      </v-list-item>
      <v-list-item-group>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-cloud</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("saved_messages") }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="$emit('showCreateGroupDialog')">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("new_group") }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="$emit('showCreateChannelDialog')">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("new_channel") }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="$emit('showSettingsDialog')">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("settings") }}</v-list-item-title>
        </v-list-item>

        <v-list-item color="red" @click="$emit('logout')">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("logout") }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
      <div class="nav_drawer_footer">
        <span class="text-grey">Tahagram</span><br />
        <span class="text-grey" style="font-size: 12px"
          >{{ $t("version") }} 1.0</span
        >
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },
    // eslint-disable-next-line vue/prop-name-casing
    user_default_avatar: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      show_nav_drawer: false,
      nav_drawer_width: 350,
    };
  },
  computed: {
    userName() {
      return this.$store.state.users.userData.full_name || this.$store.state.users.userData.username;
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(newValue) {
        this.show_nav_drawer = newValue;
      },
    },
    show_nav_drawer: {
      immediate: true,
      handler(newValue) {
        this.$emit("update:show", newValue);
      },
    },
  },
  mounted() {
    this.handleScreenResize();
  },
  methods: {
    handleScreenResize() {
      const vm = this;
      function __resize() {
        if (window.innerWidth <= 1100)
          vm.$set(vm.$data, "nav_drawer_width", 300);
        else vm.$set(vm.$data, "nav_drawer_width", 350);
      }
      window.onresize = () => __resize();
      __resize();
    },
  },
};
</script>
