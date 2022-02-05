<template>
  <div class="form_top_overlay">
    <h1>ChatApp</h1>
    <h2 :dir="this.$i18n.locale == 'fa' ? 'rtl' : 'ltr'">
      {{ $t("developed_by") }}
      <a href="https://github.com/tahadostifam/ChatApp">TahaDostifam</a>
    </h2>
  </div>
</template>

<script>
export default {
  name: "FormTopOverlay",
};
</script>
