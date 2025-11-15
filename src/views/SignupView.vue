<script setup>
import SignupCardVue from "@/components/SignupCard.vue";
</script>

<template>
  <div class="signup-page">
    <div class="container">
      <div class="signup-page__contents">
        <SignupCardVue />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/mixins.scss";
.signup-page {
  background: url("@/assets/images/misc/login-bg.webp") no-repeat top center;
  background-size: cover;
  align-items: stretch;
  display: flex;
  height: 100%;
  &__contents {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 12rem;
    margin: 0 auto;
    padding: 4rem 0 8rem;
    height: 100%;
    @include mobile {
      flex-direction: column;
      gap: 3rem;
      align-items: center;
    }
  }
  &__text-bg {
    position: absolute;
    top: 2rem;
    left: 0;
    z-index: -1;
    @include mobile {
      display: none;
    }
  }
  &__person-bg {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 9;
  }
}
</style>
