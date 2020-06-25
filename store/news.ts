import { prepareQuery } from '@vue-storefront/core/modules/catalog/queries/common'
import cloneDeep from 'lodash-es/cloneDeep'
import { nonReactiveState } from '@vue-storefront/core/modules/catalog-next/store/category/index';
import { isServer } from '@vue-storefront/core/helpers';

export const newsStore = {
  namespaced: true,
  state: {
    news: [],
  },
  actions: {
    async loadNews({ commit, dispatch }, { pageSize = 10 } = {}) {
      const { items, perPage, start, total, aggregations, attributeMetadata } = await dispatch('product/findProducts', {
        query: {},
        sort: 'created_at:desc',
        size: pageSize,
        options: {
          populateRequestCacheTags: true,
          prefetchGroupProducts: false,
          setProductErrors: false,
          fallbackToDefaultWhenNoAvailable: true,
          assignProductConfiguration: false,
          separateSelectedVariant: false
        }
      }, { root: true })
      commit('SET_CMS_PAGES_LIST_STATS', { perPage, start, total })
      commit('SET_CMS_PAGES_LIST', items)
    },
    async loadMoreNews({ commit, getters, rootState, dispatch }) {
      const { perPage, start, total } = getters.homeProductsStats
      const totalValue = typeof total === 'object' ? total.value : total
      if (start >= totalValue || totalValue < perPage) return

      const searchResult = await dispatch('product/findProducts', {
        query: {},
        sort: 'created_at:desc',
        start: start + perPage,
        size: perPage,
        options: {
          populateRequestCacheTags: true,
          prefetchGroupProducts: false,
          setProductErrors: false,
          fallbackToDefaultWhenNoAvailable: true,
          assignProductConfiguration: false,
          separateSelectedVariant: false
        }
      }, { root: true })
      commit('SET_CMS_PAGES_LIST_STATS', {
        perPage: searchResult.perPage,
        start: searchResult.start,
        total: searchResult.total
      })
      commit('SET_CMS_PAGES_LIST', searchResult.items)
      return searchResult.items
    }
  },
  mutations: {
    SET_CMS_PAGES_LIST_STATS(state, stats = {}) {
      state.homeProductsStats = stats
    },
    SET_CMS_PAGES_LIST(state, list = []) {
      state.homeProducts.push(...list)
    }
  },
  getters: {
    getNewsList(state) {
      return state.newsList
    },
    getNewsListStats: state => state.newsListStats || {}
  }
}
