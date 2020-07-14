<template>
  <div class="minimal-layout">
    <div id="viewport" class="w-100 relative">
      <minimal-header />
      <slot />
      <footer />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MinimalHeader from 'theme/components/core/blocks/Header/MinimalHeader.vue'
import Footer from 'theme/components/core/blocks/Footer/Footer.vue'

import Head from 'theme/head'

export default {
  data () {
    return {
      ordersData: []
    }
  },
  computed: {
    ...mapState({
      overlayActive: state => state.ui.overlay
    })
  },
  methods: {
  },
  beforeMount () {
  },
  beforeDestroy () {
  },
  metaInfo: Head,
  components: {
    MinimalHeader,
    Footer
  }
}
</script>

<style lang="scss" src="theme/css/main.scss">

</style>
