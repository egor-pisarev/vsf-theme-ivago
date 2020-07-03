<template>
  <a
    class="bg-cl-transparent brdr-none inline-flex"
    :aria-label="$t('Call phone')"
    data-testid="phoneButton"
    :href="`tel:${number}`"
  >
    <i class="material-icons phone-icon">phone</i>
    <span class="hidden-xs">
      <slot />
    </span>
  </a>
</template>

<script>
export default {
  props: ["number"]
};
</script>
<style lang="scss" scoped>
@media (min-width: 767px) {
  .phone-icon {
    font-size: 16px;
    padding: 1px;
  }
}
</style>
