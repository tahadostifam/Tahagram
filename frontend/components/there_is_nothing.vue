<template>
  <div class="there_is_nothing">
    <div class="center_icon">
      <img src="@/assets/images/xmas_surprise.svg" />
    </div>
    <div>
      <span class="mt-4 d-block text-grey">There is nothing</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ThereIsNothing",
};
</script>

<style lang="scss">
.center_icon {
  width: 170px;
  img {
    width: 100%;
    height: 100%;
    -webkit-user-drag: none;
  }
}
.there_is_nothing {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  padding-bottom: 30px;
}
</style>
