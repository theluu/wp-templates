<template>
  <div class="signup-card">
    <div class="signup-card__contents">
      <h2 class="signup-card__title">{{ Drupal.t('LOG IN') }}</h2>
      <div class="signup-card__desc">{{ Drupal.t('Start your IAT journey by logging in!') }}</div>
      <div
          v-if="errorMessaage"
          class="signup-card__desc error"
          style="margin-top: 0.5rem; border-radius: 1rem; background: #FFF3E0; color: #505050; padding: 8px 16px;"
      >{{ Drupal.t(errorMessaage) }}</div>
      <Form @submit="onEmailSubmit" :validation-schema="emailSchema">
        <div v-if="!checkEmail" class="signup-card__step-wrapper -step-1">
          <div class="signup-card__input-group">
            <Field name="email" v-slot="{ field, errors }">
              <a-input
                v-bind="field"
                :disabled="loading"
                :placeholder="Drupal.t('Enter your email')"
                :status="errors.length ? 'error' : ''"
              />
              <span class="error-message">{{ errors[0] }}</span>
            </Field>
          </div>

          <div class="signup-card__input-group">
            <Field name="password" v-slot="{ field, errors }">
              <a-input-password
                v-bind="field"
                :disabled="loading"
                :placeholder="Drupal.t('Enter your password')"
                :status="errors.length ? 'error' : ''"
              />
              <span class="error-message">{{ errors[0] }}</span>
            </Field>            
          </div>

          <a-button class="signup-card__btn" type="primary" htmlType="submit" :disabled="loading">{{
            Drupal.t("Start")
          }}</a-button>
          <RouterLink class="signup-card__forgot-link" to="/trouble-login">{{ Drupal.t('Having trouble logging in?') }}</RouterLink>
          <div class="signup-card__acc-link">
            {{ Drupal.t('Don’t have an account yet?') }}
            <RouterLink to="/sign-up" class="signup-card__ex-link">{{
              Drupal.t("Sign up")
            }}</RouterLink>
          </div>
        </div>
      </Form>
    </div>

    <div class="signup-card__note-box">
      <i class="fa-light fa-triangle-exclamation"></i>
      <div>{{ Drupal.t('Test your equipment here!') }}</div>
      <a href="https://frontend.ieltsonlinetests.com/php/pages/vn-ielts-test/vnieltstest__devices-check.php" class="signup-card__check-device">{{ Drupal.t('Check device') }}</a>
    </div>
  </div>

  <AlertModal
    v-if="alertModalVisible"
    :title="Drupal.t('Account does not exist!')"
    :caption="Drupal.t('It looks like this email hasn\'t been registered yet. Sign up now and join us!')"
    :buttonName="Drupal.t('Sign up')"
    @submit="goToSignUp"
  />
</template>

<script setup>
import { ref } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/store';
import AlertModal from '@/components/modals/AlertModal.vue';
const loading = ref(false);
const errorMessaage = ref("");
const checkEmail = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const alertModalVisible = ref(false);

if (authStore.loggedin) {
  router.push("/");
}

const emailSchema = yup.object({
  email: yup
    .string()
    .required("Please enter your email!")
    .email("Please enter a valid email address!"),
  password: yup.string().required("Please enter your password!"),
});

const goToSignUp = () => {
  alertModalVisible.value = false;
  router.push("/sign-up");
};

const onEmailSubmit = async (values) => {
  errorMessaage.value = "";
  if (values.email && values.password) {
    loading.value = true;
    try {
      await authStore.login(values.email, values.password);
      loading.value = false;
      router.push("/");
    } catch (err) {
      loading.value = false;
      console.error("Login failed:", err);
      console.log("Error details:", {
        status: err.response?.status,
        message: err.message,
        responseData: err.response?.data,
      });
      if (
        err.response?.status === 404 ||
        err.response?.data?.error === 'Account does not exist'
      ) {
        alertModalVisible.value = true;
      } else {
        errorMessaage.value = err.response?.data?.error || "Đăng nhập thất bại. Vui lòng thử lại.";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/mixins.scss";
.signup-card {
  width: 100%;
  margin: 0 auto;
  max-width: 400px;
  &__contents {
    display: flex;
    padding: var(--Size-12, 40px) var(--Size-9, 24px);
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    border-radius: 16px;
    background: #FFF;
    box-shadow: 0px 4px 30px 0px #F5F5F5;
  }
  &__acc-link {
    font-size: 14px;
    margin: 16px 0 0;
    text-align: center;
    color: var(--Text-Body-1, #53535b);
    .signup-card__ex-link {
      text-decoration: underline;
    }
  }
  &__title {
    color: var(--Text-Headline, #294563);
    text-align: center;
    font-size: var(--font-size-lg);
    font-weight: 700;
  }
  &__desc {
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: var(--Text-Body-2, #62626b);
    text-align: center;
    font-size: 14px;
  }
  &__input-group {
    width: 100%;
    margin: 1.6rem 0 0;
    & + .signup-card__input-group {
      margin-top: 1.6rem;
    }
  }
  &__input-title {
    color: var(--Text-Body-1, #53535b);
    font-size: var(--font-size-sm);
    font-weight: 400;
    margin: 0 0 6px;
  }
  &__input {
    border-radius: var(--Radius-4, 8px);
  }
  &__btn {
    height: 48px;
    min-width: 160px;
    background: linear-gradient(0deg, #02317E 0%, #2BD4EE 100%);
    margin: 4rem 0 0;
    font-size: var(--font-size-sm);
    margin: 1.6rem auto;
  }
  &__note {
    margin: 8px 0 0;
  }
  &__ex-link {
    color: var(--icon-illustration-listening, #32B3C7);
    font-weight: 700;
    &:hover {
      text-decoration: underline;
    }
  }
  &__forgot-link {
    display: flex;
    justify-content: center;
    justify-self: center;
    margin-top: 16px;
    font-size: 14px;
    color: var(--Text-Blue, #32B3C7);
    text-decoration: underline;
  }
  &__note-box {
    display: flex;
    padding: 8px 16px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    border-radius: 16px;
    background: var(--iat_orange-50, #FFF3E0);
    color: var(--Text-Body-2, #505050);
    gap: 8px;
    margin-top: 1.6rem;
    @include mobile {
      flex-direction: column;
      font-size: 14px;
      padding: 16px;
    }
  }
  &__check-device {
    display: flex;
    height: 36px;
    padding: 4px 12px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    border-radius: 1000px;
    background: var(--Text-Yellow, #FAA859);
    color: #fff;
    white-space: nowrap;
    margin-left: 1rem;
  }
  .fa-triangle-exclamation {
    font-size: 24px;
    color: #FAA859;
  }
}
</style>
