<template>
  <a href="https://wa.me/79133952306" class="whatsapp-link" target="_blank" title="WhatsApp">
    <img src="/assets/whatsapp-logo.png" />
  </a>
</template>
<style scoped lang="scss">
.whatsapp-link {
  display: block;
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 100;
  img {
    width: 100px;
    transition: width 0.3s, height 0.3s;
  }
  &:hover {
    text-decoration: none;
    img {
      width: 120px;
    }
    &:after {
      background: none;
      height: 0px;
    }
  }
}
</style>
