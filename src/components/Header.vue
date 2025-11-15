<template>
  <header class="header">
    <div class="container">
      <div class="header__contents">
        <RouterLink to="/" class="header__logo-link">
          <img
            alt="IEG logo"
            class="header__logo"
            src="@/assets/InterGreat-logo.svg"
            width="125"
            height="125"
          />
        </RouterLink>

        <div class="header__lang lang-menu">
          <div class="lang-menu__current-lang">
            <img
              :src="currentFlagSrc"
              class="lang-menu__current-flag-img"
              :alt="currentLanguage.name"
            />
            <div class="lang-menu__current-country">{{ currentLanguage.code }}</div>
            <i class="fa-regular fa-chevron-up"></i>
          </div>
          <ul class="lang-menu__list">
            <li class="lang-menu__list-text">{{ Drupal.t('Select language') }}</li>
            <li
              v-for="(language, index) in languages"
              :key="index"
              :class="[
                'lang-menu__list-item',
                { '-checked': selectedLanguage === language.code },
              ]"
              @click="selectLanguage(language)"
            >
              <img
                class="lang-menu__flag-img"
                :src="language.flag"
                :alt="language.name"
              />{{ $t(`header.languages.${language.code}`) }}
            </li>
          </ul>
        </div>
        <template v-if="showUserInfo">
          <UserInfo />
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import vnFlag from "@/assets/flags/circle-flags/VN.svg";
import enFlag from "@/assets/flags/circle-flags/GB.svg";
import cnFlag from "@/assets/flags/circle-flags/CN.svg";
import { useAuthStore } from "../store";
import UserInfo from "@/components/UserInfo.vue";

const { locale } = useI18n();
const selectedLanguage = ref(locale.value);
const route = useRoute();
const router = useRouter();
const showUserInfo = ref(false);

const hiddenRoutes = ["/login", "/sign-up","/trouble-login"];

// Hàm kiểm tra route
const updateUserInfoVisibility = (path) => {
  // console.log("Checking route path:", path);
  showUserInfo.value = !hiddenRoutes.includes(path);
};

// Đợi router sẵn sàng trước khi kiểm tra route
router.isReady().then(() => {
  updateUserInfoVisibility(route.path);
});

// Theo dõi thay đổi route
watch(
  () => route.path,
  (newPath) => {
    updateUserInfoVisibility(newPath);
  }
);

const languages = [
  { code: "vi", name: "Tiếng Việt", flag: vnFlag },
  { code: "en", name: "English", flag: enFlag },
  { code: "zh", name: "中文", flag: cnFlag },
];

const currentLanguage = computed(() =>
  languages.find((language) => language.code === selectedLanguage.value)
);

const currentFlagSrc = computed(() =>
  currentLanguage.value ? currentLanguage.value.flag : ""
);

const selectLanguage = (language) => {
  selectedLanguage.value = language.code;
  locale.value = language.code; // Update the locale
};

</script>

<style scoped></style>
