<template>
  <button
    :class="{'active': isActive}"
    class="bg-cl-primary brdr-1 brdr-cl-primary brdr-square h5 cl-tertiary generic-selector mr10 mb10"
    @click="$emit('change', variant)"
    :aria-label="$t('Select ' + label)"
  >
    {{ label }}
  </button>
</template>

<script>
import filterMixin from 'theme/mixins/filterMixin.ts';
import i18n from '@vue-storefront/i18n';

export default {
  mixins: [filterMixin],
  computed: {
    label () {
      return this.variant.label === '0' ? i18n.t('No') : i18n.t('Choose');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-active: color(secondary);
$color-disabled: color(secondary, $colors-border);

.generic-selector {
  height: 40px;
  padding-left: 8px;
  padding-right: 8px;
  min-width: 50px;

  &:hover,
  &:focus {
    border-width: 2px;
  }

  &.active {
    border-color: $color-active;
    border-width: 2px;
    color: $color-active;
  }

  &:disabled {
    border-color: $color-disabled;
    color: $color-disabled;
    cursor: not-allowed;

    &:hover,
    &:after {
      border-width: 1px;
    }
  }
}
</style>
