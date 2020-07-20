<template>
  <div id="cms-page">
    <header class="bg-cl-secondary py35 pl20">
      <div class="container">
        <div class="row middle-sm">
          <h1 class="col-sm-9 category-title mb10">
            {{ cmsPageItem.title }}
          </h1>
        </div>
      </div>
    </header>
    <div class="container pt45 pb70">
      <div class="row pl20 pt0">
        <div class="col-sm-3">
          <nav class="static-menu serif h4 mb35">
            <ul class="m0 p0">
              <li class="mb10" v-for="element in navigation" :key="element.id">
                <router-link :to="localizedRoute(element.link)" class="cl-accent relative">
                  {{ element.title }}
                </router-link>
              </li>
            </ul>
          </nav>
        </div>
        <div class="static-content h4 lh35 col-sm-9">
          <div class="container pb60" v-html="cmsPageItem.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CmsPage from '@vue-storefront/core/pages/CmsPage'
import i18n from '@vue-storefront/i18n'
import { getPathForStaticPage } from 'theme/helpers'

export default {
  computed: {
    pageTitle () {
      return this.cmsPageItem.meta_title || this.cmsPageItem.title
    },
    pageDescription () {
      return this.cmsPageItem ? this.cmsPageItem.meta_description : ''
    },
    pageKeywords () {
      return this.cmsPageItem ? this.cmsPageItem.meta_keywords : ''
    },
    cmsPageItem () {
      return this.$store.state.cmsPage.items.find(i => i.identifier === this.$route.params.slug)
    },
    activeComponent () {
      const matchedNav = this.navigation.find(nav => nav.link.includes(this.$route.path))
      return matchedNav ? matchedNav.component : null
    }
  },
  data () {
    return {
      navigation: [
        { title: i18n.t('About us'), link: getPathForStaticPage('/about_us'), component: CmsPage },
        { title: i18n.t('Payment and delivery'), link: getPathForStaticPage('/payment-and-shipping'), component: CmsPage },
        { title: i18n.t('Privacy policy'), link: getPathForStaticPage('/privacy'), component: CmsPage },
        { title: i18n.t('Contact us'), link: getPathForStaticPage('/contacts'), component: CmsPage }
      ]
    }
  },
  mixins: [CmsPage]
}
</script>
