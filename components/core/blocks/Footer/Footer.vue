<template>
  <footer :class="{ 'brdr-top-1 brdr-cl-secondary': isCheckoutPage }">
    <div class="footer-links flex pt30 pb60 px40 bg-cl-secondary" v-if="!isCheckoutPage">
      <div class="container">
        <div class="row m0 center-xs between-md">
          <div class="row m0 col-lg-7 col-md-8 col-xs-12 start-md between-md between-xs no-mobile">
            <div class="start-md">
              <router-link
                class="cl-secondary pl-10 m-20"
                :to="localizedRoute('/i/about_us')"
                exact
              >
                {{ $t('About Us') }}
              </router-link>
              <router-link
                class="cl-secondary pl-10 m-20"
                :to="localizedRoute('/news')"
                exact
              >
                {{ $t('News') }}
              </router-link>
              <router-link
                class="cl-secondary pl-10 m-20"
                :to="localizedRoute('/i/contacts')"
                exact
              >
                {{ $t('Contacts') }}
              </router-link>
            </div>
          </div>
          <div class="col-lg-5 col-md-8 col-xs-12 start-md between-md between-xs m-20">
            Создание сайта <a href="https://plusmarketing.ru">plusmarketing.ru</a>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row middle-xs px15 bottom-links">
        <div class="col-xs-5 col-sm-3 cl-tertiary">
          <language-switcher v-if="multistoreEnabled" />
        </div>
        <div class="col-xs col-sm-9 end-xs">
          <ul class="pl0 links" data-testid="bottomLinks">
            <li class="footer__version-info">
              {{ getVersionInfo }}
            </li>
            <li class="inline-flex">
              <router-link
                class="cl-tertiary underline"
                to="/i/privacy"
                exact
              >
                {{ $t('Privacy policy') }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <back-to-top bottom="20px" right="20px" visibleoffset="200">
      <button
        type="button"
        class="btn-top button no-outline brdr-none cl-white bg-cl-mine-shaft :bg-cl-th-secondary py10 px10"
      >
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fill-rule="evenodd"
          clip-rule="evenodd"
        >
          <path
            d="M23.245 20l-11.245-14.374-11.219 14.374-.781-.619 12-15.381 12 15.391-.755.609z"
            fill="white"
          />
        </svg>
      </button>
    </back-to-top>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  currentStoreView,
  localizedRoute
} from '@vue-storefront/core/lib/multistore';
import CurrentPage from 'theme/mixins/currentPage';
import LanguageSwitcher from '../../LanguageSwitcher.vue';
import Newsletter from 'theme/components/core/blocks/Footer/Newsletter';
import BackToTop from 'theme/components/core/BackToTop';
import { getPathForStaticPage } from 'theme/helpers';
import config from 'config';

export default {
  mixins: [CurrentPage],
  name: 'MainFooter',
  methods: {
    goToAccount () {
      this.$bus.$emit('modal-toggle', 'modal-signup');
    },
    getLinkFor (path) {
      return localizedRoute(getPathForStaticPage(path));
    }
  },
  computed: {
    ...mapGetters({
      isLogged: 'user/isLoggedIn'
    }),
    multistoreEnabled () {
      return config.storeViews.multistore;
    },
    getVersionInfo () {
      return `v${process.env.__APPVERSION__} ${process.env.__BUILDTIME__}`;
    }
  },
  components: {
    Newsletter,
    LanguageSwitcher,
    BackToTop
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-secondary: color(secondary);

.icon {
  transition: 0.3s all;
}

.social-icon {
  width: 40px;
  height: 40px;
  &:hover,
  &:focus,
  &:active {
    .icon {
      fill: $color-secondary;
    }
  }
}
.links {
  list-style-type: none;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}

.bottom-links {
  @media (max-width: 767px) {
    padding: 0;
  }
}

.footer__version-info {
  display: flex;
  color: $color-secondary;
  font-size: 0.7rem;
  @media (min-width: 768px) {
    margin-right: 1rem;
    font-size: 0.8rem;
  }
}

.underline {
  &:hover {
    color: $color-secondary;
    &:after {
      background-color: $color-secondary;
    }
  }
}
.legal-entity-link {
  text-align: center;
  @media (min-width: 768px) {
    display: none;
  }
}

.privacy-policy-link {
  text-align: right;
  @media (min-width: 768px) {
    display: none;
  }
}

@media (max-width: 595px) {
  .no-mobile {
    display: none;
  }

  .social {
    margin-top: 0;
  }

  .footer-links {
    padding-bottom: 30px;
  }
}
</style>
