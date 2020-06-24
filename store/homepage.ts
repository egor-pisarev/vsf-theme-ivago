import { prepareQuery } from '@vue-storefront/core/modules/catalog/queries/common'
import cloneDeep from 'lodash-es/cloneDeep'
import { nonReactiveState } from '@vue-storefront/core/modules/catalog-next/store/category/index';
import { isServer } from '@vue-storefront/core/helpers';

export const homepageStore = {
  namespaced: true,
  state: {
    new_collection: [],
    bestsellers: []
  },
  actions: {
    async fetchNewCollection({ commit, dispatch }) {
      const newProductsQuery = prepareQuery({ queryConfig: 'newProducts' })

      const { items } = await dispatch('product/findProducts', {
        query: newProductsQuery,
        size: 8,
        sort: 'created_at:desc',
        options: {
          populateRequestCacheTags: true,
          prefetchGroupProducts: false
        }
      }, { root: true })

      commit('SET_NEW_COLLECTION', items)
    },
    async loadBestsellers({ commit, dispatch }) {
      const { items } = await dispatch('product/findProducts', {
        query: prepareQuery({ queryConfig: 'bestSellers' }),
        size: 8,
        sort: 'created_at:desc',
        options: {
          populateRequestCacheTags: true,
          prefetchGroupProducts: false
        }
      }, { root: true })

      commit('SET_BESTSELLERS', items)
    },
    async loadHomeProducts({ commit, dispatch }, { pageSize = 10 } = {}) {
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
      commit('SET_HOME_PRODUCTS_STATS', { perPage, start, total })
      commit('SET_HOME_PRODUCTS', items)
    },
    async loadMoreHomeProducts({ commit, getters, rootState, dispatch }) {
      const { perPage, start, total } = getters.getHomeProductsStats
      const totalValue = typeof total === 'object' ? total.value : total
      if (start >= totalValue || totalValue < perPage) return
      const searchQuery = getters.getCurrentSearchQuery
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
      commit('SET_HOME_PRODUCTS_STATS', {
        perPage: searchResult.perPage,
        start: searchResult.start,
        total: searchResult.total
      })
      commit('ADD_HOME_PRODUCTS', searchResult.items)
      return searchResult.items
    }
  },
  mutations: {
    SET_NEW_COLLECTION(state, products) {
      state.new_collection = products || []
    },
    SET_BESTSELLERS(state, bestsellers) {
      state.bestsellers = bestsellers
    },
    SET_HOME_PRODUCTS(state, homeProducts) {
      state.homeProducts = homeProducts
    },
    SET_HOME_PRODUCTS_STATS(state, stats = {}) {
      state.homeProductsStats = stats
    },
    ADD_HOME_PRODUCTS(state, products = []) {
      state.homeProducts.push(...products)
    }
  },
  getters: {
    getEverythingNewCollection(state) {
      return state.new_collection
    },
    getBestsellers(state) {
      return state.bestsellers
    },
    getHomeProducts(state) {
      return state.homeProducts
    },
    getHomeProductsStats: state => state.homeProductsStats || {}
  }
}
