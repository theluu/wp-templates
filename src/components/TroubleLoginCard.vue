<template>
  <div class="trouble-card">

      <div class="trouble-card__contents">
        <a class="trouble-card__back-link" @click="handleBackClick">
          <i class="fa-light fa-chevron-left"></i>
        </a>

        <!-- step 1 -->
        <template v-if="!checkedPhone && activeKey == 1 || !checkedEmail && activeKey == 2">
          <h2 class="trouble-card__title">{{ Drupal.t('Trouble logging in?') }}</h2>
          <div class="trouble-card__desc">{{ Drupal.t('Enter your email or phone number and we’ll send you OTP code to get back into your account ') }}</div>

          <a-tabs v-model:activeKey="activeKey" @tab-click="onTabClick">
            <a-tab-pane key="1" tab="By phone">
              <div v-if="!checkedPhone">
                <Form @submit="onPhoneSubmit" :validation-schema="phoneSchema">
                  <Field name="phone" v-slot="{ field, errors, meta }">
                    <vue-tel-input
                      v-bind="{ ...field, ...bindProps }"
                      @on-input="onPhoneInput"
                      @blur="meta.setTouched"
                      :class="{ error: meta.touched && errors.length }"
                    ></vue-tel-input>
                    <span class="error-message" v-if="meta.touched && errors.length">{{ errors[0] }}</span>
                  </Field>
                  <a-button class="trouble-card__btn" type="primary" htmlType="submit" :loading="loading">
                    {{ Drupal.t('Submit') }}
                  </a-button>
                </Form>
                
              </div>
              
            </a-tab-pane>
            <a-tab-pane key="2" tab="By email" force-render>
              <Form @submit="onEmailSubmit" :validation-schema="emailSchema">
                <div v-if="!checkedEmail" class="trouble-card__step-wrapper -step-1">
                  <div class="trouble-card__input-group">
                    <Field name="email" v-slot="{ field, errors }">
                      <a-input
                        v-bind="field"
                        :placeholder="Drupal.t('Enter your email')"
                        :status="errors.length ? 'error' : ''"
                        class="trouble-card__input"
                        type="email"
                      />
                      <span class="error-message">{{ errors[0] }}</span>
                    </Field>
                  </div>
                  <a-button class="verify-card__btn" type="primary" htmlType="submit" :loading="loading">
                    {{ Drupal.t('Submit') }}
                  </a-button>
                </div>
              </Form>
            </a-tab-pane>
          </a-tabs>
          <div class="trouble-card__acc-link">
            {{ Drupal.t('Don’t have an account?') }}
            <RouterLink to="/sign-up" class="trouble-card__ex-link">{{ Drupal.t('Sign up') }}</RouterLink>
          </div>
        </template>

        <!-- step 2 -->
        <template v-if="checkedPhone && !otpChecked || checkedEmail && !otpChecked">
          <Form @submit="onOtpSubmit" :validation-schema="otpSchema">
            <div class="verify-card">
              <div class="verify-card__contents">

                <h3 class="verify-card__title">{{ Drupal.t('VERIFY ACCOUNT') }}</h3>
                <div class="verify-card__caption">{{ Drupal.t('Enter the verification code sent to') }}</div>
                <div class="verify-card__contact-target">{{ checkedPhone ? formattedPhoneNumber : userEmail }}</div>
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

        <!-- step 3 -->
        <template v-if="otpChecked">
          <h2 class="trouble-card__title">{{ Drupal.t('LOGIN INFO?') }}</h2>
          <div class="trouble-card__desc">{{ Drupal.t('Enter your information to log back in') }}</div>
          <Form
            @submit="onFinishSubmit"
            :validation-schema="finishSchema"
            v-slot="{ meta }"
            :initial-values="{
              email: userEmail.value || '',
              password: '',
              confirmPassword: '',
            }"
          >
            <div class="trouble-card__inputs-group">
              {{ console.log('Form values:', values, 'Meta:', meta) }}
              <template v-if="userEmail">
                <Field name="email" v-slot="{ field, errors }">
                  <a-input
                    class="trouble-card__input"
                    v-bind="field"
                    :value="userEmail"
                    :placeholder="Drupal.t('Enter your email address')"
                    disabled
                    :status="errors.length ? 'error' : ''"
                  />
                  <span class="error-message">{{ errors[0] }}</span>
                </Field>
              </template>
              <template v-if="phoneNumber">
                <Field name="phone" v-slot="{ field, errors }">
                  <a-input
                    class="trouble-card__input"
                    v-bind="field"
                    :value="formattedPhoneNumber"
                    :placeholder="Drupal.t('Enter your phone number')"
                    disabled
                    :status="errors.length ? 'error' : ''"
                  />
                  <span class="error-message">{{ errors[0] }}</span>
                </Field>
                <Field name="email" v-slot="{ field, errors }">
                  <a-input
                    class="trouble-card__input"
                    v-bind="field"
                    type="email"
                    :placeholder="Drupal.t('Email address')"
                    :status="errors.length ? 'error' : ''"
                  />
                  <span class="error-message">{{ errors[0] }}</span>
                </Field>
              </template>
              <Field name="password" v-slot="{ field, errors }">
                <a-input-password
                  class="trouble-card__input"
                  v-bind="field"
                  :placeholder="Drupal.t('Enter your new password')"
                  :status="errors.length ? 'error' : ''"
                />
                <span class="error-message">{{ errors[0] }}</span>
              </Field>

              <Field name="confirmPassword" v-slot="{ field, errors }">
                <a-input-password
                  class="trouble-card__input"
                  v-bind="field"
                  :placeholder="Drupal.t('Confirm your new password')"
                  :status="errors.length ? 'error' : ''"
                />
                <span class="error-message">{{ errors[0] }}</span>
              </Field>

              <a-button
                class="trouble-card__btn"
                type="primary"
                htmlType="submit"
              >
                {{ Drupal.t('SUBMIT') }}
                <i class="fa-light fa-chevron-right"></i>
              </a-button>
              
            </div>
          </Form>
        </template>
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
import { ref, computed } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store";
import { verifyOtpApi, checkEmail, checkPhone, sendOtp } from "@/api";
import AlertModal from  "@/components/modals/AlertModal.vue";
import { message } from 'ant-design-vue';

const onFinish = () => {
  console.log('finished!');
  endRemainingTime.value = true;
};
const deadline = ref(null);

const router = useRouter();
const checkedEmail = ref(false);
const userEmail = ref("");
const dialCode = ref(""); // Lưu mã vùng (ví dụ: +84)
const authStore = useAuthStore();
const activeKey = ref('1');
const phoneNumber = ref("");
const checkedPhone = ref(false);
const endRemainingTime = ref(false);
const otpChecked = ref(false);
const alertModalVisible = ref(false);
const loading = ref(false);

const goToSignUp = () => {
  alertModalVisible.value = false;
  router.push("/sign-up");
}; 

const onTabClick = (key) => {
  if (otpChecked.value) {
    otpChecked.value = false;
    endRemainingTime.value = false;
    deadline.value = null;
  }
  // Reset other states
  checkedPhone.value = false;
  checkedEmail.value = false;
  phoneNumber.value = "";
  userEmail.value = "";
  dialCode.value = "";
  alertModalVisible.value = false; // Reset modal
};

// Định dạng số điện thoại hiển thị với mã vùng
const formattedPhoneNumber = computed(() => {
  if (dialCode.value && phoneNumber.value) {
    return `${dialCode.value}-${phoneNumber.value}`;
  }
  return phoneNumber.value || "";
});

// Chuẩn hóa số điện thoại: chỉ giữ các ký tự số
const normalizePhone = (phone) => {
  return phone.replace(/\D/g, '');
};

// Xử lý input số điện thoại từ vue-tel-input
const onPhoneInput = (number, phoneObject) => {
  console.log('Raw input:', number, phoneObject);

  // Giới hạn độ dài số điện thoại
  if (number.length > 13) {
    number = number.slice(0, 13);
    message.warning('Your phone number is too long, it has been truncated to 13 characters.');
  }

  phoneNumber.value = number || '';
  dialCode.value = phoneObject.countryCallingCode ? `+${phoneObject.countryCallingCode}` : '';
  
  // Reset alertModalVisible khi người dùng thay đổi số điện thoại
  alertModalVisible.value = false;

  console.log('Phone input:', {
    phoneNumber: phoneNumber.value,
    dialCode: dialCode.value,
    phoneObject,
  });
};

const handleBackClick = () => {
  if (!checkedPhone.value && activeKey.value == '1' || !checkedEmail.value && activeKey.value == '2') {
    // Step 1: Quay về trang login
    router.push("/login");
  } else if ((checkedPhone.value && !otpChecked.value) || (checkedEmail.value && !otpChecked.value)) {
    // Step 2: Quay về step 1
    checkedPhone.value = false;
    checkedEmail.value = false;
    phoneNumber.value = "";
    userEmail.value = "";
    dialCode.value = "";
    endRemainingTime.value = false;
    deadline.value = null;
    alertModalVisible.value = false; // Reset modal
  } else if (otpChecked.value) {
    // Step 3: Quay về step 2
    otpChecked.value = false;
    endRemainingTime.value = true;
    deadline.value = null;
    alertModalVisible.value = false; // Reset modal
  }
};

// Schema for phone form
const emailSchema = yup.object({
  email: yup
    .string()
    .required("Please enter your email!")
    .email("Please enter a valid email address!"),
});

// Schema for phone form
const phoneSchema = yup.object({
  phone: yup
    .string()
    .required("Please enter your phone number!")
    .matches(/^\+?\d[\d\s-]*$/, "Phone number can only contain numbers, spaces, or hyphens!")
    .test('valid-length', 'Phone number must be between 1 and 13 digits!', function (value) {
      const normalized = normalizePhone(value || '');
      return normalized.length >= 1 && normalized.length <= 13;
    }),
});

// Step 3 schema (Thêm schema để xác thực OTP)
const otpSchema = yup.object({
  userOtp: yup
    .string()
    .required("OTP code is required") // Thông báo lỗi khi không nhập OTP
    .min(1, "OTP code is required"), // Đảm bảo OTP không rỗng
});

// Step finish schema 
const finishSchema = yup.object({
  email: yup
    .string()
    .test('email-or-phone-required', 'Please enter your email!', function (value) {
      // Nếu phoneNumber có giá trị, email là bắt buộc
      if (phoneNumber.value) {
        return !!value && yup.string().email().isValidSync(value);
      }
      // Nếu không, email là tùy chọn
      return true;
    }),
  phone: yup
    .string()
    .test('email-or-phone-required', 'Please enter your phone number!', function (value) {
      return true;
    }),
  password: yup
    .string()
    .required("Please enter a password!")
    .min(8, "Password must be at least 8 characters!"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password!")
    .oneOf([yup.ref("password"), null], "Passwords must match!"),
});

const onEmailSubmit = async (values, { setErrors }) => {
  loading.value = true;
  alertModalVisible.value = false; // Reset trước khi kiểm tra
  try {
    console.log('Sending to checkEmail:', values.email);
    const response = await checkEmail(values.email);
    console.log('checkEmail response:', response.data);
    if (!response.data.exists) {
      alertModalVisible.value = true; // Hiển thị modal nếu email không tồn tại
      return;
    }
    userEmail.value = values.email;
    checkedEmail.value = true;
    await sendOtp({ identifier: values.email, type: 'email' });
    deadline.value = Date.now() + 1000 * 10;
    endRemainingTime.value = false;
  } catch (error) {
    console.error('Error in checkEmail:', error);
    setErrors({ email: 'An error occurred while checking the email. Please try again.' });
    message.error('An error occurred while checking the email. Please try again.');
  } finally {
    loading.value = false;
  }
};

const onPhoneSubmit = async (values, { setErrors }) => {
  loading.value = true;
  alertModalVisible.value = false; // Reset trước khi kiểm tra
  try {
    const normalizedPhone = normalizePhone(phoneNumber.value);
    console.log('Sending to checkPhone:', { phone: normalizedPhone, dialCode: dialCode.value });

    // Kiểm tra độ dài số điện thoại
    if (normalizedPhone.length < 3 || normalizedPhone.length > 13) {
      setErrors({ phone: 'Your phone number is invalid' });
      return;
    }

    const response = await checkPhone(normalizedPhone, dialCode.value);
    console.log('checkPhone response:', response.data);

    if (!response.data.exists) {
      alertModalVisible.value = true; // Hiển thị modal nếu số không tồn tại
      return;
    }

    checkedPhone.value = true;
    await sendOtp({ identifier: `${dialCode.value}${normalizedPhone}`, type: 'phone' });
    deadline.value = Date.now() + 1000 * 10;
    endRemainingTime.value = false;
  } catch (error) {
    console.error('Error in checkPhone:', error);
    setErrors({ phone: 'An error occurred while checking the phone number. Please try again.' });
    message.error('An error occurred while checking the phone number. Please try again.');
  } finally {
    loading.value = false;
  }
};

const onOtpSubmit = async (values, { setErrors }) => {
  try {
    const identifier = checkedPhone.value ? `${dialCode.value}${normalizePhone(phoneNumber.value)}` : userEmail.value;
    const response = await verifyOtpApi(values.userOtp, identifier);
    if (response.data.success) {
      otpChecked.value = true;
    } else {
      setErrors({ userOtp: "Invalid OTP code" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    setErrors({ userOtp: "An error occurred while verifying OTP" });
  }
};

const onFinishSubmit = (values) => {
  console.log("Finish step submitted with values:", values);
  authStore.login();
  router.push("/");
};

const onResendCode = async () => {
  const identifier = checkedPhone.value ? `${dialCode.value}${normalizePhone(phoneNumber.value)}` : userEmail.value;
  const type = checkedPhone.value ? 'phone' : 'email';
  await sendOtp({ identifier, type });
  deadline.value = Date.now() + 1000 * 10;
  endRemainingTime.value = false;
};

const bindProps = {
  mode: "international",
  autoFormat: false,
  preferredCountries: ["VN", "GB", "CN"],
  validCharactersOnly: true,
  dropdownOptions: {
    showDialCodeInSelection: true,
    showFlags: true,
    showDialCodeInList: true,   
  },
  inputOptions: {
    showDialCode: false,
    type: "tel",
    placeholder: "Enter your phone number",
    autocomplete: "tel-national",
  },
};
</script>

<style lang="scss">
  .trouble-card {
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
    border-radius: 16px;
    position: relative;
  }
  &__title {
    color: #02317E;
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
  &__contact-target {
    font-size: var(--font-size-sm);
    font-weight: 700;
    color: #02317E;
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
    margin-top: 2.4rem;
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
    border-radius: 9999px;
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

.trouble-card {
  width: 100%;
  margin: 0 auto;
  max-width: 400px;
  &__back-link {
    display: inline-flex;
    cursor: pointer;
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
  }
  &__acc-link {
    margin: 1.6rem 0 0;
    text-align: center;
    color: var(--Text-Body-1, #53535b);
    .trouble-card__ex-link {
      text-decoration: underline;
      font-weight: 700;
    }
  }
  &__title {
    color: var(--Text-Headline, #294563);
    text-align: center;
    font-size: 18px;
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
    & + .trouble-card__input-group {
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
    border-radius: 9999px;
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
    color: #32B3C7;
    font-weight: 700;
    text-decoration: underline;
    @include transition();
    &:hover {
      color: $primary-500;
    }
  }
}
</style>
