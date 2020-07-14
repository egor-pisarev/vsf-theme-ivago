<template>
  <div id="home">
    <main-slider />
    <div class="container p20" v-html="getHomeCmsPage.content" />
    <div class="container mt20">
      <lazy-hydrate :trigger-hydration="!loading" v-if="isLazyHydrateEnabled">
        <product-listing :columns="defaultColumn" :products="getHomeProducts" />
      </lazy-hydrate>
      <product-listing v-else :columns="defaultColumn" :products="getHomeProducts" />
    </div>
  </div>
</template>
<script>
// query constructor
import { isServer, onlineHelper } from "@vue-storefront/core/helpers";
import LazyHydrate from "vue-lazy-hydration";

// Theme core components
import ProductListing from "theme/components/core/ProductListing";
import HeadImage from "theme/components/core/blocks/MainSlider/HeadImage";
import MainSlider from "theme/components/core/blocks/MainSlider/MainSlider";

// Theme local components
import Onboard from "theme/components/theme/blocks/Home/Onboard";
import PromotedOffers from "theme/components/theme/blocks/PromotedOffers/PromotedOffers";
import TileLinks from "theme/components/theme/blocks/TileLinks/TileLinks";
import { Logger } from "@vue-storefront/core/lib/logger";
import { mapGetters } from "vuex";
import config from "config";
import { registerModule } from "@vue-storefront/core/lib/modules";
import { RecentlyViewedModule } from "@vue-storefront/core/modules/recently-viewed";
import onBottomScroll from "@vue-storefront/core/mixins/onBottomScroll";

export default {
  data() {
    return {
      loading: true,
      defaultColumn: 4
    };
  },
  mixins: [onBottomScroll],
  components: {
    MainSlider,
    LazyHydrate,
    ProductListing
  },
  computed: {
    ...mapGetters("user", ["isLoggedIn"]),
    ...mapGetters("homepage", ["getHomeProducts"]),
    ...mapGetters({
      getProducts: "product/getProducts",
      getCurrentSearchQuery: "category-next/getCurrentSearchQuery",
      getCategoryProducts: "category-next/getCategoryProducts",
      getCurrentCategory: "category-next/getCurrentCategory",
      getCategoryProductsTotal: "category-next/getCategoryProductsTotal",
      getAvailableFilters: "category-next/getAvailableFilters",
      getCmsPages: "cmsPage/getCmsPages"
    }),
    categories() {
      return this.getCategories;
    },
    isOnline() {
      return onlineHelper.isOnline;
    },
    isLazyHydrateEnabled() {
      return config.ssr.lazyHydrateFor.some(field =>
        ["homepage", "homepage.new_collection"].includes(field)
      );
    },
    getHomeCmsPage() {
      return this.getCmsPages.find(item => item.identifier === "home");
    }
  },

  beforeCreate() {
    registerModule(RecentlyViewedModule);
  },
  async beforeMount() {
    if (this.$store.state.__DEMO_MODE__) {
      const onboardingClaim = await this.$store.dispatch("claims/check", {
        claimCode: "onboardingAccepted"
      });
      if (!onboardingClaim) {
        // show onboarding info
        this.$bus.$emit("modal-toggle", "modal-onboard");
        this.$store.dispatch("claims/set", {
          claimCode: "onboardingAccepted",
          value: true
        });
      }
    }
  },
  mounted() {
    if (!this.isLoggedIn && localStorage.getItem("redirect"))
      this.$bus.$emit("modal-show", "modal-signup");
  },
  methods: {
    async onBottomScroll() {
      if (this.loadingProducts) return;
      this.loadingProducts = true;
      try {
        await this.$store.dispatch("homepage/loadMoreHomeProducts");
      } catch (e) {
        Logger.error("Problem with fetching more products", "category", e)();
      } finally {
        this.loadingProducts = false;
      }
    }
  },
  watch: {
    isLoggedIn() {
      const redirectObj = localStorage.getItem("redirect");
      if (redirectObj) this.$router.push(redirectObj);
      localStorage.removeItem("redirect");
    }
  },
  async asyncData({ store, route, context }) {
    // this is for SSR purposes to prefetch data
    if (context) context.output.cacheTags.add(`home`);
    Logger.info("Calling asyncData in Home Page (core)")();

    await Promise.all([
      store.dispatch("homepage/loadHomeProducts"),
      store
        .dispatch("cmsPage/list", {
          filterValues: ["home"]
        })
        .then(result => {
          Logger.info("Calling asyncData in Home Page (core)")();
          return result;
        })
      // store.dispatch('homepage/fetchNewCollection'),
      // store.dispatch('promoted/updateHeadImage'),
      // store.dispatch('promoted/updatePromotedOffers')
      // store.dispatch('category-next/loadCategoryProducts', { route, category: currentCategory, pageSize })
    ]);
  },
  beforeRouteEnter(to, from, next) {
    if (!isServer && !from.name) {
      // Loading products to cache on SSR render
      next(vm =>
        vm.$store.dispatch("homepage/fetchNewCollection").then(res => {
          vm.loading = false;
        })
      );
    } else {
      next();
    }
  },
  metaInfo() {
    return {
      title: this.$route.meta.title || this.$i18n.t("Home Page"),
      meta: this.$route.meta.description
        ? [
            {
              vmid: "description",
              name: "description",
              content: this.$route.meta.description
            }
          ]
        : []
    };
  }
};
</script>

<style lang="scss" scoped>
.new-collection {
  @media (max-width: 767px) {
    padding-top: 0;
  }
}
</style>
