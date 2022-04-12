<template>
  <div v-if="view_image.show" id="view_image">
    <div class="controls">
      <div
        v-if="view_image.controls.right"
        class="right"
        @click="view_image_move_right"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </div>
      <div
        v-if="view_image.controls.left"
        class="left"
        @click="view_image_move_left"
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
        $emit('remove_button', gimme_image_filename());
        $emit('close_button');
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

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    imagesList: {
      type: Object,
      required: true,
    },
    showRemoveButton: {
      type: Boolean,
      default: true,
    },
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
    imagesList: {
      immediate: true,
      handler(newValue: Array<any> /* FIXME -> add interface */) {        
        if (newValue) {
          // this.view_image.list = newValue;
          // if (newValue && newValue.length > 0) {
          //   const index = this.$data.view_image.active_item;
          //   this.$set(index, 'src', newValue[0].src);
          //   this.modal_right_left_rules(newValue);
          // } else {
          //   this.$emit('close_button');
          // }
        }
      },
    },
    show: {
      immediate: true,
      handler(newValue: Boolean) {
        if (newValue) {
          // this.show_view_image_modal(this.$props.images_list); FIXME
        }
        // this.view_image.show = newValue;
      },
    },
  },
  // methods: {
  //   gimme_image_filename() {
  //     return this.$data.view_image.list[this.$data.view_image.active_item.index]
  //       .filename;
  //   },
  //   view_image_move_right() {
  //     const activeIndex = this.$data.view_image.active_item.index;
  //     const length = this.$data.view_image.list.length;

  //     const toIndex = activeIndex + 1;
  //     if (activeIndex + 2 > length - 1) {
  //       this.$set(this.$data.view_image.controls, 'right', false);
  //     }

  //     if (toIndex > 0) {
  //       this.$set(this.$data.view_image.controls, 'left', true);
  //     }

  //     if (toIndex < length) {
  //       this.$set(this.$data.view_image.active_item, 'index', toIndex);
  //       this.$set(
  //         this.$data.view_image.active_item,
  //         'src',
  //         this.$data.view_image.list[toIndex].src
  //       );
  //     }
  //   },
  //   view_image_move_left() {
  //     const activeIndex = this.$data.view_image.active_item.index;
  //     const length = this.$data.view_image.list.length;

  //     if (activeIndex === 1) {
  //       this.$set(this.$data.view_image.controls, 'left', false);
  //       this.$set(this.$data.view_image.controls, 'right', true);
  //     }

  //     if (activeIndex >= 1) {
  //       const toIndex = activeIndex - 1;
  //       this.$set(this.$data.view_image.active_item, 'index', toIndex);
  //       this.$set(
  //         this.$data.view_image.active_item,
  //         'src',
  //         this.$data.view_image.list[toIndex].src
  //       );
  //     }

  //     if (activeIndex <= length) {
  //       this.$set(this.$data.view_image.controls, 'right', true);
  //     }
  //   },
  //   show_view_image_modal(list) {
  //     this.$set(this.$data.view_image.active_item, 'index', 0);
  //     this.$set(this.$data.view_image.active_item, 'src', null);
  //     this.modal_right_left_rules(list);
  //   },
  //   modal_right_left_rules(list) {
  //     if (list && list.length > 0) {
  //       const index = this.$data.view_image.active_item;
  //       this.$set(index, 'src', list[0].src);
  //       if (list.length === 1) {
  //         this.$set(this.$data.view_image.controls, 'right', false);
  //       }
  //       if (list.length > 1) {
  //         this.$set(this.$data.view_image.controls, 'right', true);
  //       }
  //       this.$set(this.$data.view_image.controls, 'left', false);
  //     } else {
  //       console.error('List of show_view_image_modal cannot be empty!');
  //     }
  //   },
  // },
});
</script>
