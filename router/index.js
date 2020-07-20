const Home = () => import(/* webpackChunkName: "vsf-home" */ 'theme/pages/Home.vue')
const HomeCategory = () => import(/* webpackChunkName: "vsf-home" */ 'theme/pages/HomeCategory.vue')

const PageNotFound = () => import(/* webpackChunkName: "vsf-not-found" */ 'theme/pages/PageNotFound.vue')
const ErrorPage = () => import(/* webpackChunkName: "vsf-error" */ 'theme/pages/Error.vue')
const Product = () => import(/* webpackChunkName: "vsf-product" */ 'theme/pages/Product.vue')
const Category = () => import(/* webpackChunkName: "vsf-category" */ 'theme/pages/Category.vue')
const CmsPage = () => import(/* webpackChunkName: "vsf-cms" */ 'theme/pages/CmsPage.vue')
const NewsPage = () => import(/* webpackChunkName: "vsf-cms" */ 'theme/pages/NewsPage.vue')

const Checkout = () => import(/* webpackChunkName: "vsf-checkout" */ 'theme/pages/Checkout.vue')
const Compare = () => import(/* webpackChunkName: "vsf-compare" */ 'theme/pages/Compare.vue')
const MyAccount = () => import(/* webpackChunkName: "vsf-my-account" */ 'theme/pages/MyAccount.vue')
const Static = () => import(/* webpackChunkName: "vsf-static" */ 'theme/pages/Static.vue')
const ResetPassword = () => import(/* webpackChunkName: "vsf-reset-password" */ 'theme/pages/ResetPassword.vue');
const CmsPageList = () => import(/* webpackChunkName: "vsf-reset-password" */ 'theme/pages/CmsPageList.vue');

let routes = [
  { name: 'home', path: '/', component: HomeCategory, alias: '/pwa.html' },
  { name: 'checkout', path: '/checkout', component: Checkout },
  { name: 'my-account', path: '/my-account', component: MyAccount },
  { name: 'my-shipping-details', path: '/my-account/shipping-details', component: MyAccount, props: { activeBlock: 'MyShippingDetails' } },
  { name: 'my-orders', path: '/my-account/orders', component: MyAccount, props: { activeBlock: 'MyOrders' } },
  { name: 'my-order', path: '/my-account/orders/:orderId', component: MyAccount, props: { activeBlock: 'MyOrder' } },
  { name: 'my-recently-viewed', path: '/my-account/recently-viewed', component: MyAccount, props: { activeBlock: 'MyRecentlyViewed' } },
  { name: 'compare', path: '/compare', component: Compare, props: { title: 'Compare Products' } },
  { name: 'error', path: '/error', component: ErrorPage, meta: { layout: 'minimal' } },
  { name: 'virtual-product', path: '/p/:parentSku/:slug', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'bundle-product', path: '/p/:parentSku/:slug', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'simple-product', path: '/p/:parentSku/:slug', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'downloadable-product', path: '/p/:parentSku/:slug', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'grouped-product', path: '/p/:parentSku/:slug', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'configurable-product', path: '/p/:parentSku/:slug/:childSku', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'product', path: '/p/:parentSku/:slug/:childSku', component: Product }, // :sku param can be marked as optional with ":sku?" (https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js#L16), but it requires a lot of work to adjust the rest of the site
  { name: 'category', path: '/c/:slug', component: Category },
  { name: 'news', path: '/news', component: CmsPageList },
  { name: 'news-item', path: '/news/i/:slug', component: NewsPage },
  { name: 'cms-page', path: '/i/:slug', component: CmsPage },
  { name: 'create-password', path: '/create-password', component: ResetPassword },
  { name: 'page-not-found', path: '*', component: PageNotFound }
]

export default routes
