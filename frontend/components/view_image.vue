<template>
  <div id="view_image" v-if="view_image.show">
    <div class="controls">
      <div
        class="right"
        @click="view_image_move_right"
        v-if="view_image.controls.right"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </div>
      <div
        class="left"
        @click="view_image_move_left"
        v-if="view_image.controls.left"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </div>
    </div>
    <div class="close_btn" @click="$emit('close_button')">
      <v-icon>mdi-close</v-icon>
    </div>

    <div class="download_btn" @click="$emit('close_button')">
      <v-icon>mdi-download</v-icon>
    </div>

    <div class="remove_btn" @click="$emit('close_button')">
      <v-icon>mdi-delete</v-icon>
    </div>

    <div class="info_of_image">
      <span
        >Photo {{ view_image.active_item.index + 1 }} of
        {{ view_image.list.length }}</span
      >
    </div>

    <div class="image_content">
      <img :src="view_image.active_item.src" ref="view_image_content" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      view_image: {
        show: false,
        list: [],
        active_item: {
          src: null,
          index: 0,
        },
        controls: {
          right: false,
          left: false,
        },
      },
    };
  },
  props: ["images_list", "show"],
  watch: {
    images_list: {
      immediate: true,
      handler(new_value) {
        if (new_value) {
          this.view_image.list = new_value;
        }
      },
    },
    show: {
      immediate: true,
      handler(new_value) {
        if (new_value) {
          this.show_view_image_modal(this.$props.images_list);
        }
        this.view_image.show = new_value;
      },
    },
  },
  methods: {
    view_image_move_right() {
      const active_index = this.$data.view_image.active_item.index;
      const length = this.$data.view_image.list.length;

      const to_index = active_index + 1;
      if (active_index + 2 > length - 1) {
        this.$set(this.$data.view_image.controls, "right", false);
      }

      if (to_index > 0) {
        this.$set(this.$data.view_image.controls, "left", true);
      }

      if (to_index < length) {
        this.$set(this.$data.view_image.active_item, "index", to_index);
        this.$set(
          this.$data.view_image.active_item,
          "src",
          this.$data.view_image.list[to_index].src
        );
      }
    },
    view_image_move_left() {
      const active_index = this.$data.view_image.active_item.index;
      const length = this.$data.view_image.list.length;

      if (active_index == 1) {
        this.$set(this.$data.view_image.controls, "left", false);
        this.$set(this.$data.view_image.controls, "right", true);
      }

      if (active_index >= 1) {
        const to_index = active_index - 1;
        this.$set(this.$data.view_image.active_item, "index", to_index);
        this.$set(
          this.$data.view_image.active_item,
          "src",
          this.$data.view_image.list[to_index].src
        );
      }

      if (active_index <= length) {
        this.$set(this.$data.view_image.controls, "right", true);
      }
    },
    show_view_image_modal(list) {
      this.$set(this.$data.view_image.active_item, "index", 0);
      this.$set(this.$data.view_image.active_item, "src", null);

      if (list && list.length > 0) {
        const index = this.$data.view_image.active_item;
        this.$set(index, "src", list[0].src);
        if (list.length == 1) {
          this.$set(this.$data.view_image.controls, "right", false);
        }
        if (list.length > 1) {
          this.$set(this.$data.view_image.controls, "right", true);
        }
        this.$set(this.$data.view_image.controls, "left", false);
      } else {
        console.error("List of show_view_image_modal cannot be empty!");
      }
    },
  },
};
</script>
