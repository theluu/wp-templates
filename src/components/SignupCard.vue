<template>
  <div class="signup-card">
    
      <div class="signup-card__contents">
        <div @click="handleBackClick" class="signup-card__back-link">
          <i class="fa-light fa-chevron-left"></i>
        </div>

        <template v-if="!checkedEmail || otpChecked">
          <h2 class="signup-card__title">{{ Drupal.t('SIGN UP') }}</h2>
          <div class="signup-card__desc">{{ Drupal.t('Sign up for an account to experience') }}</div>
        </template>
        
        <template v-if="!checkedEmail">
          <Form @submit="onEmailSubmit" :validation-schema="emailSchema">
            <div v-if="!checkedEmail" class="signup-card__step-wrapper -step-1">
              <div class="signup-card__input-group">
                <Field name="email" v-slot="{ field, errors }">
                  <a-input
                    v-bind="field"
                    :placeholder="Drupal.t('Enter your email')"
                    :status="errors.length ? 'error' : ''"
                    :disabled="loading"
                  />
                  <span class="error-message">{{ errors[0] }}</span>
                </Field>
              </div>
              <a-button class="verify-card__btn" type="primary" htmlType="submit" :disabled="loading">
                {{ Drupal.t('Continue') }} <i class="fa-light fa-chevron-right"></i>
              </a-button>
            </div>
          </Form>
          <div class="signup-card__acc-link">
            {{ Drupal.t('Already have an account?') }}
            <RouterLink to="/login" class="signup-card__ex-link">{{
              Drupal.t('Login')
            }}</RouterLink>
          </div>
        </template>

        <template v-if="checkedEmail && !otpChecked">
          <Form @submit="onOtpSubmit" :validation-schema="otpSchema">
            <div class="verify-card">
              <div class="verify-card__contents">
                <h3 class="verify-card__title">{{ Drupal.t('VERIFY ACCOUNT') }}</h3>
                <div class="verify-card__caption">{{ Drupal.t('Enter the verification code sent to') }}</div>
                <div class="verify-card__email-address">{{ email }}</div>
                <Field name="userOtp" v-slot="{ field, errors }">
                  <a-input class="verify-card__otp-input" v-bind="field" placeholder="Enter OTP code" />
                  <span class="error-message">{{ errors[0] }}</span>
                </Field>
                <template v-if="!endRemainingTime">
                  <div class="verify-card__remaining-time" v-if="deadline">{{ Drupal.t('Remaining time:') }} 
                    <a-statistic-countdown
                      :value="deadline"
                      format="s"
                      suffix="s"
                      @finish="onFinish"
                    />
                  </div>
                </template>
                
                <template v-if="endRemainingTime">
                  <div class="verify-card__resend-code" @click="onResendCode"><i class="fa-light fa-arrow-rotate-right"></i><b>{{ Drupal.t('Resend code') }}</b></div>
                </template>
                <a-button class="verify-card__btn" type="primary" htmlType="submit">
                  {{ Drupal.t('VERIFY') }} <i class="fa-light fa-chevron-right"></i>
                </a-button>
              </div>
            </div>
          </Form>
        </template>
        
        <template v-if="otpChecked">
          <Form
            @submit="onFinishSubmit"
            :validation-schema="finishSchema"
            v-slot="{ meta }"
            :initial-values="{
              email: email.value || '',
              name: '',
              studentId: '',
              password: '',
              confirmPassword: '',
              agreeTerms: termChecked.value
            }"
          >
            <div class="signup-card__inputs-group">
              {{ console.log('Form values:', values, 'Meta:', meta) }}
              <template v-if="email">
                <Field name="email" v-slot="{ field, errors }">
                  <a-input
                    v-bind="field"
                    :value="email"
                    :placeholder="Drupal.t('Enter your email address')"
                    disabled
                    :status="errors.length ? 'error' : ''"
                  />
                  <span class="error-message">{{ errors[0] }}</span>
                </Field>
              </template>              
              <Field name="name" v-slot="{ field, errors }">
                <a-input
                  v-bind="field"
                  :placeholder="Drupal.t('Enter your full name')"
                  :status="errors.length ? 'error' : ''"
                />
                <span class="error-message">{{ errors[0] }}</span>
              </Field>

              <Field name="studentId" v-slot="{ field, errors }">
                <a-input
                  v-bind="field"
                  :placeholder="Drupal.t('Student ID (optional)')"
                  :status="errors.length ? 'error' : ''"
                />
                <span class="error-message">{{ errors[0] }}</span>
              </Field>

              <Field name="password" v-slot="{ field, errors }">
                <a-input-password
                  v-bind="field"
                  :placeholder="Drupal.t('Enter your password')"
                  :status="errors.length ? 'error' : ''"
                />
                <span class="error-message">{{ errors[0] }}</span>
              </Field>

              <Field name="confirmPassword" v-slot="{ field, errors }">
                <a-input-password
                  v-bind="field"
                  :placeholder="Drupal.t('Confirm your password')"
                  :status="errors.length ? 'error' : ''"
                />
                <span class="error-message">{{ errors[0] }}</span>
              </Field>
              
              <Field name="agreeTerms" v-slot="{ field, errors }" type="checkbox">
                <div class="signup-card__agree-terms">
                  <a-checkbox
                    v-model:checked="termChecked"
                    @change="field.onChange(termChecked)"
                    :status="errors.length ? 'error' : ''"
                  >
                    {{ Drupal.t('By creating an account, you agree to the') }}<br>
                    <RouterLink to="/terms" class="signup-card__ex-link">
                      {{ Drupal.t('Term of Use') }}
                    </RouterLink>
                    {{ Drupal.t('and') }}
                    <RouterLink to="/privacy" class="signup-card__ex-link">
                      {{ Drupal.t('Privacy Policy') }}
                    </RouterLink>
                  </a-checkbox>
                  <div class="error-message">{{ errors[0] }}</div>
                </div>
              </Field>

              <a-button
                class="signup-card__btn"
                type="primary"
                htmlType="submit"
              >
                {{ Drupal.t('SUBMIT & LOGIN') }}
                <i class="fa-light fa-chevron-right"></i>
              </a-button>
              
            </div>
          </Form>
        </template>
      </div>
    
    <template v-if="!checkedEmail">
      <div class="signup-card__note-box">
        <i class="fa-light fa-triangle-exclamation"></i>
        <div>{{ Drupal.t('Test your equipment here!') }}</div>
        <a href="https://frontend.ieltsonlinetests.com/php/pages/vn-ielts-test/vnieltstest__devices-check.php" class="signup-card__check-device">{{ Drupal.t('Check device') }}</a>
      </div>
    </template>
  </div>
  
  <a-modal
    class="reg-alert-modal"
    centered
    v-model:open="regAlertModalVisible"
    :footer="null"
    width="556px"
  >
    <img
      class="reg-alert-modal__img-icon"
      src="@/assets/images/icons/alert-icon.svg"
      alt=""
    >
    <h3 class="reg-alert-modal__title">{{ Drupal.t('Registration details already exist') }}</h3>
    <div class="reg-alert-modal__caption">
      <p>{{ Drupal.t('The email you used to register an account already exists.  ') }}</p>
      <p>
        {{ Drupal.t(' Please ') }}
        <RouterLink to="/login" class="reg-alert-modal__link">{{ Drupal.t('Log in') }}</RouterLink>
        {{ Drupal.t(' or ') }}
        <RouterLink to="/trouble-login" class="reg-alert-modal__link">{{ Drupal.t('Having trouble logging in?') }}</RouterLink>
        {{ Drupal.t(' to continue') }}
      </p>
    </div>
  </a-modal>
  
</template>

<script setup>
import { ref, computed } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store";
import { checkEmail, sendOtp, verifyOtp } from "@/api";
import { message } from 'ant-design-vue';

const onFinish = () => {
  console.log('finished!');
  endRemainingTime.value = true;
};
const deadline = ref(null);
const router = useRouter();
const checkedEmail = ref(false);
const email = ref("");
const dialCode = ref(""); // Lưu mã vùng (ví dụ: +84)
const authStore = useAuthStore();
const phoneNumber = ref("");
const endRemainingTime = ref(false);
const otpChecked = ref(false);
const termChecked = ref(false);
const regAlertModalVisible = ref(false);
const loading = ref(false);

// Schema for email form
const emailSchema = yup.object({
  email: yup
    .string()
    .required("Please enter your email address!")
    .email("Please enter a valid email address!")
});

// Schema for OTP form
const otpSchema = yup.object({
  userOtp: yup
    .string()
    .required("Please enter the OTP code!")
    .min(6, "OTP code must be at least 6 characters long!")
});

// Schema for finish form
const finishSchema = yup.object({
  name: yup.string().required("Please enter your full name!"),
  studentId: yup.string().optional(),
  password: yup
    .string()
    .required("Please enter your password!")
    .min(8, "Password must be at least 8 characters long!"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password!")
    .oneOf([yup.ref("password"), null], "Passwords must match!"),
  agreeTerms: yup
    .boolean()
    .required("You must agree to the terms!")
    .oneOf([true], "You must agree to the terms!"),
});

const onEmailSubmit = async (values) => {
  email.value = values.email;
  loading.value = true;
  try {
    // Kiểm tra email có tồn tại hay không
    const response = await checkEmail(values.email);
    if (response.data.success) {
      if (response.data.exists) {
        // Email đã tồn tại, hiển thị modal reg-alert-modal
        regAlertModalVisible.value = true;
      } else {
        // Email chưa tồn tại, gửi OTP và chuyển sang bước tiếp theo
        await sendOtp({ identifier: values.email, type: 'email' });
        checkedEmail.value = true;
        deadline.value = Date.now() + 1000 * 10; // 10 giây countdown
      }
    } else {
      console.error("Check email failed:", response.data.error);
      // Hiển thị thông báo lỗi
      // Sử dụng message từ ant-design-vue để hiển thị thông báo
      message.error(response.data.error || "Check email failed. Please try again.");
    }
  } catch (err) {
    console.error("Check email failed:", err);
    message.error(err.response?.data?.error || "Check email failed. Please try again.");
  } finally {
    loading.value = false;
  }
};

const onOtpSubmit = async (values, { setErrors }) => {
  try {
    // Gọi API để xác minh OTP
    const response = await verifyOtp({
      identifier: email.value,
      otp: values.userOtp,
      type: 'email'
    });
    if (response.data.success) {
      otpChecked.value = true;
      console.log("OTP verified successfully, otpChecked:", otpChecked.value);
    } else {
      setErrors({ userOtp: "Invalid OTP code" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    setErrors({ userOtp: "OTP verification failed. Please try again." });
  }
};

const onFinishSubmit = (values) => {
  console.log("Step 3 submitted with values:", values);
  // Giả lập đăng ký và đăng nhập
  authStore.updateUser({
    email: values.email,
    fullName: values.name,
    uid: values.studentId || '',
  });
  authStore.loggedin = true;
  router.push("/");
};

const onResendCode = async () => {
  try {
    // Gửi lại OTP
    await sendOtp({ identifier: email.value, type: 'email' });
    deadline.value = Date.now() + 1000 * 10; // Reset countdown
    endRemainingTime.value = false;
    message.success("OTP has been resent successfully!");
  } catch (error) {
    console.error("Error resending OTP:", error);
    message.error("Failed to resend OTP. Please try again.");
  }
};

const handleBackClick = () => {
  if (!checkedEmail.value) {
    // Step 1: Điều hướng về /dashboard
    router.push("/dashboard");
  } else if (checkedEmail.value && !otpChecked.value) {
    // Step 2: Quay lại step 1
    checkedEmail.value = false;
    email.value = "";
    deadline.value = null;
    endRemainingTime.value = false;
  } else if (otpChecked.value) {
    // Step 3: Quay lại step 2
    otpChecked.value = false;
    endRemainingTime.value = true; // Hiển thị nút Resend code
    deadline.value = null;
  }
};

</script>

<style lang="scss">
  @import "@/assets/mixins.scss";
  .reg-alert-modal {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    .ant-modal-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .ant-modal-content {
      padding: 4rem;
      @include mobile {
        padding: 2rem;
      }
    }
    &__img-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto;
    }
    &__title {
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--Text-Headline, #294563);
      margin-top: 16px;
    }
    &__caption {
      font-size: var(--font-size-sm);
      font-weight: 400;
      color: var(--Text-Body-2, #62626b);
      margin-top: 8px;
      margin-bottom: 24px;
    }
    &__btn {
      min-width: 160px;
      height: 44px;
    }
    &__link {
      color: #32B3C7;
      font-weight: 700;
      text-decoration: underline;
      &:hover {
        opacity: 0.8;
        color: #32B3C7;
        text-decoration: underline;
      }
    }
  }

  .signup-card {
    &__agree-terms {
      margin-top: 2.4rem;
      .ant-checkbox {
        align-self: flex-start;
        top: 3px;
      }
      .error-message {
        padding-left: 24px;
      }
    }
    .ant-tabs-nav-wrap {
      display: flex;
      justify-content: center;
    }
    .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #32B3C7;
      text-shadow: 0 0 0.25px currentcolor;
    }
    .ant-tabs-top >.ant-tabs-nav::before {
      display: none;
    }
    .ant-tabs {
      >.ant-tabs-nav {
        .ant-tabs-nav-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 1.6r
        }
        .ant-tabs-tab {
          padding: 8px 20px;
          justify-content: center;
          color: #9A9A9A;
          &+.ant-tabs-tab {
            margin-left: 0;
            &:before {
              content: '|';
              position: absolute;
              left: -8px;
              top: 50%;
              transform: translateY(-50%);
              color: #EAECEF;
            }
          }
        }
      }
      .ant-tabs-ink-bar {
        background: #32B3C7;
      }
    }
    
  }

  .verify-card {
    .ant-statistic-content {
      font-size: 14px;
      font-weight: 700;
      color: #FAA859;
      .ant-statistic-content-value, .ant-statistic-content-suffix {
        font-weight: 700;
        margin: 0;
      }
    }
  }
</style>
<style lang="scss" scoped>
@import "@/assets/mixins.scss";

.verify-card {
  width: 100%;
  margin-left: auto;
  max-width: 400px;  
  &__contents {
    display: flex;
    align-self: stretch;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    position: relative;
  }
  &__title {
    color: var(--Text-Headline, #294563);
    text-align: center;
    font-size: var(--font-size-lg);
    font-weight: 700;
    margin: 0 0 0.4rem;
  }
  &__caption {
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: var(--Text-Body-2, #62626b);
    text-align: center;
    font-size: 14px;
  }
  &__email-address {
    font-size: var(--font-size-sm);
    font-weight: 700;
    color: $primary-500;
    text-align: center;
    font-size: 14px;
    margin: 0.4rem 0 1.6rem;
  }
  &__remaining-time {
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: var(--Text-Body-2, #62626b);
    text-align: center;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  &__resend-code {
    color: #FAA859;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    margin-top: 2.4rem;
  }
  &__otp-input {
    margin-bottom: 0;
    + .error-message {
      margin: 4px 0;
    }
  }
  &__btn {
    height: 48px;
    width: fit-content;
    min-width: 160px;
    margin: 1.6rem auto 0;
    font-size: var(--font-size-sm);
    background: linear-gradient(357deg, #02317E 2.05%, #2BD4EE 97.46%);
  }
}

.signup-card {
  width: 100%;
  margin: 0 auto;
  max-width: 400px;
  &__back-link {
    display: inline-flex;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    font-size: var(--font-size-sm);
    color: var(--Text-Body-1, #505050);
    text-decoration: none;
    border-radius: 100px;
    background: #FFF;
    position: absolute;
    top: 0;
    right: calc(100% + 8px);
    cursor: pointer;
  }
  &__inputs-group {
    display: grid;
    gap: 1rem;
    margin: 1.6rem 0 0;
  }
  &__contents {
    position: relative;
    display: flex;
    padding: var(--Size-12, 40px) var(--Size-9, 24px);
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    border-radius: 16px;
    background: #FFF;
    box-shadow: 0px 4px 30px 0px #F5F5F5;
    background: var(--iat_gradient-modal_linear, linear-gradient(179deg, #AEEDF8 -27.13%, #FFF 23.42%));
  }
  &__step-wrapper {
    margin-top: 1.6rem;
  }
  &__acc-link {
    margin: 1.6rem 0 0;
    text-align: center;
    color: var(--Text-Body-1, #53535b);
    .signup-card__ex-link {
      text-decoration: underline;
      font-weight: 700;
    }
  }
  &__title {
    color: var(--Text-Headline, #294563);
    text-align: center;
    font-size: var(--font-size-lg);
    font-weight: 700;
    margin: 0 0 0.4rem;
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
    margin: 0;
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
    width: fit-content;
    min-width: 160px;
    margin: 2.4rem auto 0;
    font-size: var(--font-size-sm);
    background: linear-gradient(357deg, #02317E 2.05%, #2BD4EE 97.46%);
  }
  &__note {
    margin: 8px 0 0;
    text-align: center;
    font-size: 14px;
  }
  &__ex-link {
    color: #02317E;
    font-weight: 700;
    text-decoration: underline;
    &:hover {
      text-decoration: underline;
    }
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
