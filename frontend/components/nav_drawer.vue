<template>
  <v-navigation-drawer
    v-model="show_nav_drawer"
    absolute
    temporary
    :width="nav_drawer_width"
  >
    <v-list nav>
      <v-list-item
        class="py-5 px-4 bg-theme rounded-0"
        id="user_info_at_nav_drawer"
      >
        <div
          class="image ml-2"
          style="position: relative; top: 3px"
          v-if="user_default_avatar"
        >
          <img
            :src="user_default_avatar"
            class="avatar"
            onload="window.lazyImage(this)"
            style="--size: 40px"
          />
        </div>

        <v-list-item-title class="ml-3">{{
          user_info.full_name
        }}</v-list-item-title>
      </v-list-item>
      <v-list-item-group>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-cloud</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("saved_messages") }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="$emit('show_create_group_dialog')">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("new_group") }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="$emit('show_create_channel_dialog')">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("new_channel") }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="$emit('show_settings_dialog')">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("settings") }}</v-list-item-title>
        </v-list-item>

        <v-list-item @click="$emit('logout')" color="red">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("logout") }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
      <div class="nav_drawer_footer">
        <span class="text-grey">ChatApp</span><br />
        <span class="text-grey" style="font-size: 12px"
          >{{ $t("version") }} 1.0</span
        >
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      show_nav_drawer: false,
      nav_drawer_width: 350,
    };
  },
  props: {
    show: {
      type: Boolean,
    },
    user_info: {},
    user_default_avatar: {
      type: String,
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(new_value) {
        this.show_nav_drawer = new_value;
      },
    },
    show_nav_drawer: {
      immediate: true,
      handler(new_value) {
        this.$emit("update:show", new_value);
      },
    },
  },
  mounted() {
    this.handle_resize();
  },
  methods: {
    handle_resize() {
      let vm = this;
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
