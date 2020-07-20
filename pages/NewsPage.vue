<template>
  <div id="cms-page">
    <header class="bg-cl-secondary py35 pl20">
      <div class="container">
        <div class="row middle-sm">
          <h1 class="col-sm-9 category-title mb10">
            {{ cmsPageContent.title }}
          </h1>
        </div>
      </div>
    </header>
    <div class="container pt45 pb70">
      <div class="row pl20 pt0">
        <div class="static-content h4 lh35 col-sm-9">
          <div class="container pb60" v-html="cmsPageContent.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CmsPage from '@vue-storefront/core/pages/CmsPage'
import i18n from '@vue-storefront/i18n'

export default {
  computed: {
    cmsPageContent () {
      return this.$store.state.cmsPage.current
    },
    activeComponent () {
      const matchedNav = this.navigation.find(nav => nav.link.includes(this.$route.path))
      return matchedNav ? matchedNav.component : null
    }
  },
  mixins: [CmsPage]
}
</script>
