<template>
  <div id="cms-page">
    <header class="bg-cl-secondary py35 pl20">
      <div class="container">
        <div class="row middle-sm">
          <h1>{{ $t('News') }}</h1>
        </div>
      </div>
    </header>
    <div class="container">
      <article v-for="item in newsList" :key="item.id">
        <router-link class="block no-underline product-link" :to="`news/${item.identifier}`">
          <h2>{{ item.title }}</h2>
          <p>{{ item.meta_description }}</p>
        </router-link>
      </article>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Logger } from "@vue-storefront/core/lib/logger";

export default {
  computed: {
    ...mapGetters({
      getList: "cmsPage/getCmsPages"
    }),
    newsList () {
      return this.getList.filter(
        item =>
          [
            "about_us",
            "payment-and-shipping",
            "terms",
            "privacy",
            "home"
          ].indexOf(item.identifier) < 0
      )
    }
  },
  asyncData ({ store, route, context }) {
    return new Promise((resolve, reject) => {
      if (context) context.output.cacheTags.add(`cmsPage`);
      store
        .dispatch("cmsPage/list", {})
        .then(pages => {
          resolve(pages);
        })
        .catch(err => {
          Logger.error(err)();
          reject(err);
        });
    });
  }
};
</script>
