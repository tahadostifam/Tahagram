<template>
  <div v-if="view_image.show" id="view_image">
    <div class="controls">
      <div
        v-if="view_image.controls.right"
        class="right"
        @click="MoveRight"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </div>
      <div
        v-if="view_image.controls.left"
        class="left"
        @click="MoveLeft"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </div>
    </div>
    <div class="close_btn" @click="$emit('close_button')">
      <v-icon>mdi-close</v-icon>
    </div>

    <!-- <a TODO
      class="download_btn"
      style="text-decoration: none"
      :download="view_image.active_item.src"
    >
      <v-icon>mdi-download</v-icon>
    </a> -->

    <div
      v-if="show_remove_button == true"
      class="remove_btn"
      @click="
        $emit('removeButton', getImageUrl());
        $emit('closeButton');
      "
    >
      <v-icon>mdi-delete</v-icon>
    </div>

    <div class="info_of_image">
      <span
        >Photo {{ view_image.active_item.index + 1 }} of
        {{ view_image.list.length }}</span
      >
    </div>

    <div class="image_content">
      <img ref="view_image_content" :src="view_image.active_item.src" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    images_list: {
      type: Array,
      required: true
    },
    show: {
      type: Boolean, 
      default: false
    },
    showRemoveButton: {
      type: Boolean, 
      default: false
    }
  },
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
  watch: {
    images_list: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.view_image.list = newValue;
          if (newValue && newValue.length > 0) {
            const index = this.$data.view_image.active_item;
            this.$set(index, "src", newValue[0].src);
            this.RightLeftRules(newValue);
          } else {
            this.$emit("close_button");
          }
        }
      },
    },
    show: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.showViewImageModal(this.$props.images_list);
        }
        this.view_image.show = newValue;
      },
    },
  },
  methods: {
    getImageUrl() {
      return this.$data.view_image.list[this.$data.view_image.active_item.index];
    },
    MoveRight() {
      const activeIndex = this.$data.view_image.active_item.index;
      const length = this.$data.view_image.list.length;

      const toIndex = activeIndex + 1;
      if (activeIndex + 2 > length - 1) {
        this.$set(this.$data.view_image.controls, "right", false);
      }

      if (toIndex > 0) {
        this.$set(this.$data.view_image.controls, "left", true);
      }

      if (toIndex < length) {
        this.$set(this.$data.view_image.active_item, "index", toIndex);
        this.$set(
          this.$data.view_image.active_item,
          "src",
          this.$data.view_image.list[toIndex].src
        );
      }
    },
    MoveLeft() {
      const activeIndex = this.$data.view_image.active_item.index;
      const length = this.$data.view_image.list.length;

      if (activeIndex === 1) {
        this.$set(this.$data.view_image.controls, "left", false);
        this.$set(this.$data.view_image.controls, "right", true);
      }

      if (activeIndex >= 1) {
        const toIndex = activeIndex - 1;
        this.$set(this.$data.view_image.active_item, "index", toIndex);
        this.$set(
          this.$data.view_image.active_item,
          "src",
          this.$data.view_image.list[toIndex].src
        );
      }

      if (activeIndex <= length) {
        this.$set(this.$data.view_image.controls, "right", true);
      }
    },
    showViewImageModal(list) {
      this.$set(this.$data.view_image.active_item, "index", 0);
      this.$set(this.$data.view_image.active_item, "src", null);
      this.RightLeftRules(list);
    },
    RightLeftRules(list) {
      if (list && list.length > 0) {
        const index = this.$data.view_image.active_item;
        this.$set(index, "src", list[0].src);
        if (list.length === 1) {
          this.$set(this.$data.view_image.controls, "right", false);
        }
        if (list.length > 1) {
          this.$set(this.$data.view_image.controls, "right", true);
        }
        this.$set(this.$data.view_image.controls, "left", false);
      } else {
        console.error("List of showViewImageModal cannot be empty!");
      }
    },
  },
};
</script>
