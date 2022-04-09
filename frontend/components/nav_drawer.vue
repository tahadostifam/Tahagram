<template>
  <v-navigation-drawer
    v-model="show_nav_drawer"
    absolute
    temporary
    :width="nav_drawer_width"
  >
    <v-list nav>
      <v-list-item
        id="user_info_at_nav_drawer"
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

        <v-list-item color="red" @click="$emit('logout')">
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

<script lang="ts">
export default {
  props: {
    show: {
      type: Boolean,
    },
    userInfo: {
      type: Object, // FIXME
      required: true
    },
  },
  data() {
    return {
      show_nav_drawer: false,
      nav_drawer_width: 350,
    };
  },
  watch: {
    show: {
      immediate: true,
      handler(newValue: Boolean) {
        this.show_nav_drawer = newValue;
      },
    },
    show_nav_drawer: {
      immediate: true,
      handler(newValue: Boolean) {
        this.$emit("update:show", newValue);
      },
    },
  },
  mounted() {
    this.handleResize();
  },
  methods: {
    handleResize() {
      window.onresize = () => this.handleResize();
      this.handleResize();
    },
    doResizeHandler() {
        if (window.innerWidth <= 1100)
          this.$set(this.$data, "nav_drawer_width", 300);
        else this.$set(this.$data, "nav_drawer_width", 350);
    },
  },
};
</script>
