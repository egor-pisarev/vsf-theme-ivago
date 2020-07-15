<template>
  <div id="category">
    <main-slider />
    <header class="bg-cl-secondary py35 pl20">
      <div class="container">
        <div class="row middle-sm">
          <div class="col-sm-12">
            <h1 class="category-title">
              {{ getHomeCmsPage.content_heading }}
            </h1>
          </div>
          <div class="col-sm-8 mb10">
            <div class="container" v-html="getHomeCmsPage.content" />
          </div>
          <div class="sorting col-sm-2 align-right mt50">
            <label class="mr10">{{ $t('Columns') }}:</label>
            <columns @change-column="columnChange" />
          </div>
          <div class="sorting col-sm-2 align-right mt50">
            <sort-by
              :has-label="true"
              @change="changeFilter"
              :value="getCurrentSearchQuery.sort"
            />
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row m0">
          <button
            class="col-xs-5 mt25 mr15 p15 mobile-filters-button bg-cl-th-accent brdr-none cl-white h5 sans-serif fs-medium-small"
            @click="openFilters"
          >
            {{ $t('Filters') }}
          </button>
          <div class="mobile-sorting col-xs-6 mt25">
            <sort-by
              @change="changeFilter"
              :value="getCurrentSearchQuery.sort"
            />
          </div>
        </div>
      </div>
    </header>
    <div class="container pb60">
      <div class="row m0 pt15">
        <div class="col-md-3 start-xs category-filters">
          <sidebar :filters="getAvailableFilters" @changeFilter="changeFilter" />
        </div>
        <div class="col-md-3 start-xs mobile-filters" v-show="mobileFilters">
          <div class="close-container absolute w-100">
            <i class="material-icons p15 close cl-accent" @click="closeFilters">close</i>
          </div>
          <sidebar class="mobile-filters-body" :filters="getAvailableFilters" @changeFilter="changeFilter" />
          <div class="relative pb20 pt15">
            <div class="brdr-top-1 brdr-cl-primary absolute divider w-100" />
          </div>
          <button-full
            class="mb20 btn__filter"
            @click.native="closeFilters"
          >
            {{ $t('Filter') }}
          </button-full>
        </div>
        <div class="col-md-9 px10 border-box products-list">
          <p class="col-xs-12 end-md m0 pb20 cl-secondary">
            {{ $t('{count} items', { count: getCategoryProductsTotal }) }}
          </p>
          <div v-if="isCategoryEmpty" class="hidden-xs">
            <h4 data-testid="noProductsInfo">
              {{ $t('No products found!') }}
            </h4>
            <p>{{ $t('Please change Your search criteria and try again. If still not finding anything relevant, please visit the Home page and try out some of our bestsellers!') }}</p>
          </div>
          <lazy-hydrate :trigger-hydration="!loading" v-if="isLazyHydrateEnabled">
            <product-listing :columns="defaultColumn" :products="getCategoryProducts" />
          </lazy-hydrate>
          <product-listing v-else :columns="defaultColumn" :products="getCategoryProducts" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import Sidebar from '../components/core/blocks/Category/Sidebar.vue'
import ProductListing from '../components/core/ProductListing.vue'
import Breadcrumbs from '../components/core/Breadcrumbs.vue'
import SortBy from '../components/core/SortBy.vue'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import { getSearchOptionsFromRouteParams } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'
import config from 'config'
import Columns from '../components/core/Columns.vue'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { mapGetters } from 'vuex'
import onBottomScroll from '@vue-storefront/core/mixins/onBottomScroll'
import rootStore from '@vue-storefront/core/store';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks'
import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore'
import { htmlDecode } from '@vue-storefront/core/filters'
import MainSlider from 'theme/components/core/blocks/MainSlider/MainSlider';

const THEME_PAGE_SIZE = 50

const ROOT_CATEGORY_ID = config.entities.category.categoriesRootCategorylId

const homeRoute = { path: '/odezhda', query: {} }

const composeInitialPageState = async (store, route, forceLoad = false) => {
  try {
    const filters = {
      id: ROOT_CATEGORY_ID
    }
    const currentCategory = await store.dispatch('category-next/loadCategory', { filters })

    await Promise.all([
      store.dispatch('category-next/loadCategoryProducts', { route, category: currentCategory, pageSize: THEME_PAGE_SIZE }),
      // store.dispatch('category-next/changeRouterFilterParameters', route.query),
      store.dispatch('category-next/loadCategoryFilters', currentCategory)
    ])

    const breadCrumbsLoader = store.dispatch('category-next/loadCategoryBreadcrumbs', { category: currentCategory, currentRouteName: currentCategory.name, omitCurrent: true })
    if (isServer) await breadCrumbsLoader
    catalogHooksExecutors.categoryPageVisited(currentCategory)
  } catch (e) {
    console.log(e)
    Logger.error('Problem with setting Category initial data!', 'category', e)()
  }
}

export default {
  components: {
    LazyHydrate,
    ButtonFull,
    ProductListing,
    Sidebar,
    SortBy,
    Columns,
    MainSlider
  },
  mixins: [onBottomScroll],
  data () {
    return {
      mobileFilters: false,
      defaultColumn: 3,
      loadingProducts: false,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      // getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getFiltersMap: 'category-next/getFiltersMap',
      getCmsPages: 'cmsPage/getCmsPages'
    }),
    getAvailableFilters () {
      return this.getFiltersMap[ROOT_CATEGORY_ID]
    },
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products')
    },
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0
    },
    currentCategory () {
      return this.getCurrentCategory
    },
    getHomeCmsPage () {
      return this.getCmsPages.find(item => item.identifier === 'home');
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    if (context) context.output.cacheTags.add('category')
    await Promise.all([
      store.dispatch('homepage/loadHomeProducts'),
      store
        .dispatch('cmsPage/list', {
          filterValues: ['home']
        }),
      composeInitialPageState(store, route.name === 'home' ? { ...homeRoute, query: route.query, params: route.params } : route, false, route.name === 'home')
    ]);
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) next() // SSR no need to invoke SW caching here
    else if (!from.name) { // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async vm => {
        vm.loading = true
        if (to.name === 'home') {
          await composeInitialPageState(vm.$store, { ...homeRoute, query: to.query }, true, true)
          await vm.$store.dispatch('category-next/cacheProducts', { route: { ...homeRoute, query: to.query } }) // await here is because we must wait for the hydration
        } else {
          await composeInitialPageState(vm.$store, to, true)
          await vm.$store.dispatch('category-next/cacheProducts', { route: to }) // await here is because we must wait for the hydration
        }

        vm.loading = false
      })
    } else { // Pure CSR, with no initial category state
      next(async vm => {
        vm.loading = true
        vm.$store.dispatch('category-next/cacheProducts', { route: to.name === 'home' ? homeRoute : to })
        vm.loading = false
      })
    }
  },
  methods: {
    openFilters () {
      this.mobileFilters = true
    },
    closeFilters () {
      this.mobileFilters = false
    },
    async changeFilter (filterVariant) {
      this.$store.dispatch('category-next/switchSearchFilters', [filterVariant])
    },
    columnChange (column) {
      this.defaultColumn = column
    },
    async onBottomScroll () {
      if (this.loadingProducts) return
      this.loadingProducts = true
      try {
        await this.$store.dispatch('category-next/loadMoreCategoryProducts')
      } catch (e) {
        Logger.error('Problem with fetching more products', 'category', e)()
      } finally {
        this.loadingProducts = false
      }
    }
  },
  metaInfo () {
    const storeView = currentStoreView()

    const { content_heading, meta_description, meta_keyword, name, slug } = this.getHomeCmsPage

    const meta = meta_description ? [
      { vmid: 'description', name: 'description', content: htmlDecode(meta_description) }
    ] : []

    if (meta_keyword) {
      meta.push({ vmid: 'keywords', name: 'keywords', content: htmlDecode(meta_keyword) })
    }

    return {
      title: htmlDecode(content_heading || name),
      meta
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn {
    &__filter {
      min-width: 100px;
    }
  }
  .divider {
    width: calc(100vw - 8px);
    bottom: 20px;
    left: -36px;
  }
  .category-filters {
    width: 242px;
  }

  .mobile-filters {
    display: none;
    overflow: auto;
  }

  .mobile-filters-button {
    display: none;
  }

  .mobile-sorting {
    display: none;
  }

  .category-title {
    font-size: 32px;
    line-height: 35px;
  }

  .sorting {
    label {
      margin-right: 10px;
    }
  }

  @media (max-width: 64em) {
    .products-list {
      max-width: 530px;
    }
  }

  @media (max-width: 770px) {
    .category-title {
      margin: 0;
      font-size: 16px;
      line-height: 25px;
    }

    .products-list {
      width: 100%;
      max-width: none;
    }

    .mobile-filters {
      display: block;
    }

    .mobile-filters-button {
      display: block;
      height: 45px;
    }

    .sorting {
      display: none;
    }

    .mobile-sorting {
      display: block;
    }

    .category-filters {
      display: none;
    }

    .product-listing {
      justify-content: center;;
    }

    .mobile-filters {
      position: fixed;
      background-color: #F2F2F2;
      z-index: 5;
      padding: 0 40px;
      left: 0;
      width: 100vw;
      height: 100vh;
      top: 0;
      box-sizing: border-box;
    }

    .mobile-filters-body {
      padding-top: 50px;
    }
  }

  .close-container {
    left: 0;
  }

  .close {
    margin-left: auto;
  }
</style>
<style lang="scss">
.product-image {
  max-height: unset !important;
}
</style>
