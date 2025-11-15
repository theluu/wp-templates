<template>
  <div class="header__user-info">
    <div v-if="authStore.loggedin" class="header__wallet wallet-card">
      <div class="wallet-card__text">{{ Drupal.t('Wallet') }}</div>
      <span class="wallet-card__split-line">|</span>
      <div class="wallet-card__value">{{ authStore.config.user.wallet?.balance ?? 0 }} {{ authStore.config.user.wallet?.currency ?? 'USD' }}</div>
    </div>
    <div v-if="authStore.loggedin" class="alert-card" @click="showNotification">
      <a-tooltip
        placement="bottomRight"
        :color="'#294563'"
        title="View all your notifications"
        arrow-point-at-center
      >
        <i class="fa-light fa-bell"></i>
        <template v-if="notificationCount">
          <div class="alert-card__num">{{ notificationCount }}</div>
        </template>
      </a-tooltip>
    </div>
    <div v-if="!authStore.loggedin" class="login-card">
      <RouterLink to="/login">
        <a-button type="button" class="login-card__btn"><i class="fa-light fa-arrow-right-to-bracket"></i>{{ Drupal.t('Login') }}</a-button>
      </RouterLink>
      <RouterLink to="/sign-up">
        <a-button type="button" class="login-card__btn"><i class="fa-light fa-user-plus"></i>{{ Drupal.t('Create account') }}</a-button>
      </RouterLink>
    </div>
    <div v-if="authStore.loggedin && authStore.config.user?.uid.toString() !== '0'" class="user-card">
      <div class="user-card__infos-wrap">
        <div class="user-card__user-infos">
          <img
            class="user-card__user-avatar"
            :src="authStore.config.user.avatar"
            :alt="authStore.config.user.fullName"
          />
        </div>
        <i class="fa-light fa-chevron-down"></i>
      </div>
      <div class="user-card__menu user-menu">
        <div class="user-menu__head">
          <img
            class="user-menu__avatar"
            :src="authStore.config.user.avatar"
            :alt="authStore.config.user.fullName"
          />
          <div class="user-menu__contacts">
            <h6 class="user-menu__user-name">{{ authStore.config.user.fullName }}</h6>
            <div class="user-menu__user-email">{{ authStore.config.user.email }}</div>
          </div>
        </div>
        <div class="user-menu__body">
          <div class="user-menu__link-item">
            <i class="fa-light fa-wallet"></i>
            <div class="user-menu__wallet-wrap">
              <div class="user-menu__link-text">{{ Drupal.t('My Wallet') }}</div>
              <div class="user-menu__wallet-val">{{ authStore.config.user.wallet?.balance ?? 0 }} {{ authStore.config.user.wallet?.currency ?? 'USD' }}</div>
            </div>
            <a-button class="user-menu__btn-topup">
              <RouterLink to="/top-up">{{ Drupal.t('Top up') }}</RouterLink>
            </a-button>
          </div>
          <RouterLink class="user-menu__link-item" to="/my-profile">
            <i class="fa-light fa-user"></i>
            <div class="user-menu__link-text">{{ Drupal.t('My Profile') }}</div>
            <i class="fa-light fa-chevron-right"></i>
          </RouterLink>
          <RouterLink class="user-menu__link-item" to="/my-test-history">
            <i class="fa-light fa-clock-rotate-left"></i>
            <div class="user-menu__link-text">{{ Drupal.t('My Test History') }}</div>
            <i class="fa-light fa-chevron-right"></i>
          </RouterLink>
        </div>
        <div class="user-menu__footer">
          <div class="user-menu__link-item" @click="logout">
            <i class="fa-thin fa-arrow-right-from-bracket"></i>
            <div class="user-menu__link-text">{{ Drupal.t('Log out') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/store";
import {RouterLink, useRouter} from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();
const notificationCount = computed(() => {
  const unread = authStore.config.user.notifications.unread;
  return unread > 9 ? '9+' : unread;
});
const logout = () => {
  authStore.logout()
    .then(() => {
      router.push("/");
    })
    .catch(error => {
      console.error("Logout failed:", error);
    });
};
const showNotification = () => {
  const body = document.querySelector("body");
  body.classList.toggle("showing-notification");
  authStore.markNotificationsAsRead()
    .catch(error => {
      console.error("Failed to mark notifications as read:", error);
    });
};

</script>

<style lang="scss" scoped>
  @import "@/assets/mixins.scss";
  .login-card {
    display: flex;
    align-items: center;
    gap: var(--Size-5, 8px);
    &__separator {
      color: var(--Color-Text-Secondary, #BDC5CF);
      font-size: 12px;
    }
    &__btn {
      display: flex;
      height: 38px;
      align-items: center;
      gap: var(--Size-5, 8px);
      font-size: 12px;
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: 0 15px;
      @include mobile {
        padding: 0 10px; 
        font-size: 10px;
        height: 36px;
        gap: 4px;
      }
    }
  }
</style>
