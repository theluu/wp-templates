<template>
  <div class="user-dashboard">
    <div class="container">
      <a-breadcrumb>
        <a-breadcrumb-item><RouterLink to="/dashboard">Dashboard</RouterLink></a-breadcrumb-item>
        <a-breadcrumb-item>My Profile</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="user-dashboard__body">
        <div class="user-dashboard__menu">
          <DashboardMenu />
        </div>
        <div class="user-dashboard__contents">
          <h1 class="user-dashboard__title">{{ Drupal.t('My Profile') }}</h1>
          <section class="profile-card">
            <img class="profile-card__avatar" :src="userAvatar" alt="">
            <h6 class="profile-card__name">{{ savedUserName }}</h6>
            <a-button class="profile-card__btn" @click="showModal">{{ Drupal.t('Change photo') }}</a-button>
            <a-modal class="upload-modal" :class="{ error: uploadError }" v-model:open="open" @ok="handleOk" :footer="null" width="705px">
              <a-upload-dragger
                v-model:fileList="fileList"
                name="file"
                :max-count="1"
                :multiple="false"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                @change="handleChange"
                @drop="handleDrop"
                accept="image/png,image/jpeg,image/jpg"
                :before-upload="beforeUpload"
              >
                <p class="ant-upload-drag-icon">
                  <inbox-outlined></inbox-outlined>
                </p>
                <img src="@/assets/images/icons/upload-icon-img.svg" alt="">
                <div class="ant-upload-text">{{ Drupal.t('Drop file to upload') }} <div>{{ Drupal.t('or') }}</div> </div>
                <a-button class="upload-modal__btn">{{ Drupal.t('Browse file') }}</a-button>
              </a-upload-dragger>
              <div class="upload-modal__note">
                <span class="upload-modal__note-star">*</span>
                {{ uploadError || 'Only following file types are supported: JPG, JPEG, PNG and the file size must be under 2MB' }}
              </div>
            </a-modal>
          </section>

          <section class="general-card">
            <h6 class="section-title general-card__title">{{ Drupal.t('General information') }}</h6>
            <div class="general-card__body">
              <div class="general-card__row-item">
                <div class="general-card__col-item">
                  <div class="general-card__item-label">{{ Drupal.t('User name') }}</div>
                </div>
                <div class="general-card__col-item">
                  <Field name="name" v-slot="{ field, errors }">
                    <a-input
                      v-bind="field"
                      :placeholder="Drupal.t('Account name')"
                      :status="errors.length ? 'error' : ''"
                      v-model:value="userName"
                      @input="onUserNameChange"
                    />
                    <div class="error-message">{{ errors[0] }}</div>
                  </Field>
                </div>
                <div class="general-card__col-item">
                  <a-button 
                    class="general-card__btn" 
                    :class="{ '-hide': !isUserNameChanged || !userName }" 
                    @click="saveUserName"
                  >{{ Drupal.t('Save') }}</a-button>
                </div>
              </div>
              <div class="general-card__row-item">
                <div class="general-card__col-item">
                  <div class="general-card__item-label">{{ Drupal.t('Email') }}</div>
                </div>
                <div class="general-card__col-item">
                  <Field name="email" v-slot="{ field, errors }">
                    <a-input
                      v-bind="field"
                      :placeholder="Drupal.t('Enter your email address')"
                      :status="errors.length ? 'error' : ''"
                      v-model:value="userEmail"
                      @input="onEmailChange"
                    />
                    <span class="error-message">{{ errors[0] }}</span>
                  </Field>
                </div>
                <div class="general-card__col-item">
                  <a-button 
                    class="general-card__btn" 
                    :class="{ '-disabled': !isEmailChanged || !userEmail }" 
                    @click="showVerifyModal('email')"
                  >{{ Drupal.t('Verify') }}</a-button>                  
                </div>
              </div>
              <div class="general-card__row-item">
                <div class="general-card__col-item">
                  <div class="general-card__item-label">Phone number</div>
                </div>
                <div class="general-card__col-item">
                  <Field name="phone" v-slot="{ field, errors, meta }">
                    <vue-tel-input
                      v-bind="{ ...field, ...bindProps }"
                      @on-input="onPhoneInput"
                      @blur="meta.setTouched"
                      :class="{ error: meta.touched && errors.length }"
                      v-model="phoneNumber"
                    ></vue-tel-input>
                    <span class="error-message" v-if="meta.touched && errors.length">{{
                      errors[0]
                    }}</span>
                  </Field>
                </div>
                <div class="general-card__col-item">
                  <a-button 
                    class="general-card__btn" 
                    :class="{ '-disabled': !isPhoneChanged || !phoneNumber }" 
                    @click="showVerifyModal('phone')"
                  >Verify</a-button>
                </div>
              </div>
              <div class="general-card__row-item">
                <div class="general-card__col-item">
                  <div class="general-card__item-label">Student ID</div>
                </div>
                <div class="general-card__col-item">
                  <Field name="userId" v-slot="{ field, errors }">
                    <a-input
                      v-bind="field"
                      :placeholder="Drupal.t('Enter your student ID')"
                      :status="errors.length ? 'error' : ''"
                      v-model:value="userId"
                      @input="onUserIdChange"
                    />
                    <span class="error-message">{{ errors[0] }}</span>
                  </Field>
                </div>
                <div class="general-card__col-item">
                  <a-button 
                    class="general-card__btn" 
                    :class="{ '-hide': !isUserIdChanged || !userId }" 
                    @click="saveUserId"
                  >Save</a-button>
                </div>
              </div>
            </div>
          </section>
          <section class="general-card -pass-word">
            <h6 class="section-title general-card__title">Change password</h6>
            <div class="general-card__body">
              <Form @submit="onPasswordSubmit" :validation-schema="changePassSchema" v-slot="{ meta }">
                <div class="general-card__row-item">
                  <div class="general-card__col-item">
                    <div class="general-card__item-label">New password</div>
                  </div>
                  <div class="general-card__col-item">
                    <Field name="password" v-slot="{ field, errors }">
                      <a-input-password
                        v-bind="field"
                        :placeholder="Drupal.t('Enter your new password')"
                        :status="errors.length ? 'error' : ''"
                      />
                      <span class="error-message">{{ errors[0] }}</span>
                    </Field>
                  </div>                
                </div>
                <div class="general-card__row-item">
                  <div class="general-card__col-item">
                    <div class="general-card__item-label">Confirm password</div>
                  </div>
                  <div class="general-card__col-item">
                    <Field name="confirmPassword" v-slot="{ field, errors }">
                      <a-input-password
                        v-bind="field"
                        :placeholder="Drupal.t('Confirm your password')"
                        :status="errors.length ? 'error' : ''"
                      />
                      <span class="error-message">{{ errors[0] }}</span>
                    </Field>
                  </div>
                </div>
                <div class="general-card__row-item">
                  <div class="general-card__col-item"></div>
                  <div class="general-card__col-item">
                    <a-button 
                      type="primary" 
                      html-type="submit" 
                      class="general-card__btn" 
                      :class="{ '-disabled': !meta.valid }"
                      :disabled="!meta.valid"
                    >Change password</a-button>
                  </div>
                </div>
              </Form>              
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
 
  <VerifyOtpModal
    ref="emailOtpModal"
    :title="Drupal.t('Verify your email')"
    :identifier="userEmail"
    :type="'email'"
    @otp-verified="(otp) => showVerifySuccessModal('email', otp)"
    @resend-otp="onResendOtpCode"
  />

  <VerifyOtpModal
    ref="phoneOtpModal"
    :title="Drupal.t('Verify your phone')"
    :identifier="phoneNumber"
    :type="'phone'"
    @otp-verified="(otp) => showVerifySuccessModal('phone', otp)"
    @resend-otp="onResendOtpCode"
  />

  <SuccessVerifyModal
    v-if="isSuccessModalVisible"
    :title="successModalTitle"
    :caption="successModalCaption"
    :button-name="successModalButton"
    @submit="onSaveFormValue"
  />

</template>
<script setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { message } from 'ant-design-vue';
  import DashboardMenu from '@/components/DashboardMenu.vue';
  import { Field, Form } from 'vee-validate';
  import * as yup from 'yup';
  import { useAuthStore } from '@/store';
  import VerifyOtpModal from '@/components/modals/VerifyOtpModal.vue';
  import SuccessVerifyModal from '@/components/modals/SuccessVerifyModal.vue';
  import { updateProfile, uploadAvatar, updateEmail, updatePhone, changePassword, sendOtp, verifyOtp } from '@/api';

  const authStore = useAuthStore();
  const endRemainingTime = ref(false);
  const deadline = ref(null);

  // Giá trị ban đầu
  const initialUserName = ref(authStore.config.user?.fullName || '');
  const initialUserId = ref(authStore.config.user?.uid || '');
  const initialEmail = ref(authStore.config.user?.email || '');
  const initialPhone = ref(authStore.config.user?.phone || '');
  const initialDialCode = ref(authStore.config.user?.dialCode || '');
  const initialAvatar = ref(authStore.config.user?.avatar || '');

  const userName = ref(initialUserName.value);
  const savedUserName = ref(initialUserName.value);
  const userEmail = ref(initialEmail.value);
  const userId = ref(initialUserId.value);
  const userAvatar = ref(initialAvatar.value);
  const phoneNumber = ref(initialPhone.value);
  const dialCode = ref(initialDialCode.value);
  const isInitialLoad = ref(true);
  const otpChecked = ref(false);
  const verifiedOtp = ref('');

  // Trạng thái và nội dung cho SuccessVerifyModal
  const isSuccessModalVisible = ref(false);
  const successModalTitle = ref('');
  const successModalCaption = ref('');
  const successModalButton = ref('');

  // Trạng thái thay đổi
  const isUserNameChanged = ref(false);
  const isUserIdChanged = ref(false);
  const isEmailChanged = ref(false);
  const isPhoneChanged = ref(false);

 // Modal upload avatar
  const fileList = ref([]);
  const uploadError = ref(''); // Biến để lưu thông báo upload lỗi
  const open = ref(false);

  // Refs cho VerifyOtpModal
  const emailOtpModal = ref(null);
  const phoneOtpModal = ref(null);

  // Schema xác thực email
  const emailSchema = yup.object({
    email: yup
      .string()
      .required('Please enter your email!')
      .email('Please enter a valid email address!'),
  });

  // Gửi OTP trước khi xác thực
  const requestOtp = async (type, identifier) => {
    try {
      await sendOtp({ identifier, type });
      message.success(`OTP sent to ${identifier}`);
      deadline.value = Date.now() + 1000 * 10;
      endRemainingTime.value = false;
    } catch (error) {
      message.error('Failed to send OTP');
      console.error('Error sending OTP:', error);
    }
  };

  const showVerifyModal = async (type) => {
    const identifier = type === 'email' ? userEmail.value : phoneNumber.value;

    // Kiểm tra định dạng email nếu type là 'email'
    if (type === 'email') {
      try {
        await emailSchema.validate({ email: userEmail.value });
      } catch (error) {
        message.error(error.message);
        console.error('Invalid email format:', error.message);
        return;
      }
    }
    console.log('showVerifyModal:', { type, isEmailChanged: isEmailChanged.value, userEmail: userEmail.value });

    requestOtp(type, identifier);
    if (type === 'email') {
      emailOtpModal.value.showModal();
    } else if (type === 'phone') {
      phoneOtpModal.value.showModal();
    }
  };

  const showVerifySuccessModal = (type, otp) => {
    verifiedOtp.value = otp; // Lưu OTP đã xác thực để sử dụng sau này
    if (type === 'email') {
      successModalTitle.value = Drupal.t('Successfully verified!');
      successModalCaption.value = Drupal.t('Your email has been verified, save it now!');
      successModalButton.value = Drupal.t('Save');
    } else if (type === 'phone') {
      successModalTitle.value = Drupal.t('Successfully verified!');
      successModalCaption.value = Drupal.t('Your phone number has been verified, save it now!');
      successModalButton.value = Drupal.t('Save');
    } else if (type === 'password') {
      successModalTitle.value = Drupal.t('Password changed successfully!');
      successModalCaption.value = Drupal.t('Your password has been successfully changed.<br>Please log in with your new password!');
      successModalButton.value = Drupal.t('Got it');
    }
    isSuccessModalVisible.value = true;
  };
  
  const onResendOtpCode = () => {
    const type = isEmailChanged.value ? 'email' : 'phone';
    const identifier = type === 'email' ? userEmail.value : phoneNumber.value;
    requestOtp(type, identifier);
  };  

  // Xử lý upload avatar
  const beforeUpload = (file) => {
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    const isValidFormat = allowedFormats.includes(file.type);
    const isUnder2MB = file.size / 1024 / 1024 < 2;

    if (!isValidFormat) {
      uploadError.value = 'Invalid format: Only JPG, JPEG, and PNG formats are allowed. Please try again!';
      fileList.value = [];
      return false;
    }

    if (!isUnder2MB) {
      uploadError.value = 'File size must be under 2MB!';
      fileList.value = [];
      return false;
    }

    uploadError.value = '';
    return true;
  };

  const handleChange = async (info) => {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      try {
        const formData = new FormData();
        formData.append('avatar', info.file.originFileObj);
        const response = await uploadAvatar(formData);
        userAvatar.value = response.data.avatarUrl; // Giả sử server trả về URL của avatar
        message.success(`${info.file.name} file uploaded successfully.`);
        uploadError.value = '';
      } catch (error) {
        uploadError.value = `${info.file.name} file upload failed.`;
        message.error(`${info.file.name} file upload failed.`);
      }
    } else if (status === 'error') {
      uploadError.value = `${info.file.name} file upload failed.`;
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleDrop = (e) => {
    console.log('Dropped files', e.dataTransfer.files);
  };

  const showModal = () => {
    open.value = true;
    uploadError.value = ''; // Reset lỗi khi mở modal
    fileList.value = []; // Reset fileList khi mở modal
  };

  const handleOk = (e) => {
    console.log(e);
    open.value = false;
    uploadError.value = ''; // Reset lỗi khi đóng modal
    fileList.value = []; // Reset fileList khi đóng modal để ẩn tên file lỗi
  };

  // Xử lý thay đổi User name
  const onUserNameChange = () => {
    isUserNameChanged.value = userName.value !== savedUserName.value && !!userName.value;
  };
  // Xử lý thay đổi Email
  const onEmailChange = () => {
    isEmailChanged.value = userEmail.value !== initialEmail.value && !!userEmail.value;
    console.log('Email changed:', { userEmail: userEmail.value, initialEmail: initialEmail.value, isEmailChanged: isEmailChanged.value });
  };

  // Xử lý thay đổi Student ID
  const onUserIdChange = () => {
    isUserIdChanged.value = userId.value !== initialUserId.value && !!userId.value;
  };

  // Xử lý thay đổi Phone number
  const onPhoneInput = (number, phoneObject) => {
    console.log('onPhoneInput called:', { number, phoneObject, isInitialLoad: isInitialLoad.value });
    if (phoneObject) {
      // Lấy số điện thoại đã format (giữ số 0 đầu nếu có)
      const newPhoneNumber = phoneObject.formatted || phoneObject.nationalNumber || "";
      const newDialCode = phoneObject.countryCallingCode ? `+${phoneObject.countryCallingCode}` : "";

      // Cập nhật giá trị
      phoneNumber.value = newPhoneNumber;
      dialCode.value = newDialCode;

      // Chuẩn hóa số điện thoại để so sánh (bỏ khoảng trắng và ký tự không cần thiết)
      const normalizePhone = (phone) => phone.replace(/\D/g, '');
      const normalizedNewPhone = normalizePhone(newPhoneNumber);
      const normalizedInitialPhone = normalizePhone(initialPhone.value);

      // Chỉ cập nhật isPhoneChanged nếu không phải lần khởi tạo
      if (!isInitialLoad.value) {
        isPhoneChanged.value =
          (normalizedNewPhone !== normalizedInitialPhone || dialCode.value !== initialDialCode.value) && !!newPhoneNumber;
        console.log('Phone changed check:', {
          newPhoneNumber,
          normalizedNewPhone,
          normalizedInitialPhone,
          dialCode: dialCode.value,
          isPhoneChanged: isPhoneChanged.value,
        });
      }
    }
  };

  // Đặt giá trị ban đầu sau khi component được mount
  onMounted(async () => {
    await nextTick(); // Đợi vue-tel-input khởi tạo xong
    phoneNumber.value = initialPhone.value;
    dialCode.value = initialDialCode.value;
    isInitialLoad.value = false;
    console.log('Mounted, initial values:', {
      phoneNumber: phoneNumber.value,
      dialCode: dialCode.value,
      isPhoneChanged: isPhoneChanged.value,
    });
  });

  // Lưu User name và Student ID
  const saveUserName = async () => {
    try {
      await updateProfile({ fullName: userName.value });
      savedUserName.value = userName.value;
      authStore.updateUser({ fullName: userName.value }); // Cập nhật store
      isUserNameChanged.value = false;
      message.success('Your user name has been saved successfully!');
    } catch (error) {
      message.error('Failed to save user name');
      console.error('Error saving user name:', error);
    }
  };

  const saveUserId = async () => {
    try {
      await updateProfile({ uid: userId.value });
      authStore.updateUser({ uid: userId.value }); // Cập nhật store
      isUserIdChanged.value = false;
      message.success('Your student ID has been saved successfully!');
    } catch (error) {
      message.error('Failed to save student ID');
      console.error('Error saving student ID:', error);
    }
  };

  // Lưu email hoặc phone sau khi xác thực OTP
  const onSaveFormValue = async () => {
    try {
      if (isEmailChanged.value) {
        console.log('Saving email:', { email: userEmail.value, otp: verifiedOtp.value });
        const response = await updateEmail({ email: userEmail.value, otp: verifiedOtp.value });
        authStore.updateUser({ email: userEmail.value });
        initialEmail.value = userEmail.value;
        message.success('Email đã được cập nhật thành công!');
      } else if (isPhoneChanged.value) {
        console.log('Saving phone:', { phone: phoneNumber.value, dialCode: dialCode.value, otp: verifiedOtp.value });
        const response = await updatePhone({ phone: phoneNumber.value, dialCode: dialCode.value, otp: verifiedOtp.value });
        authStore.updateUser({ phone: phoneNumber.value, dialCode: dialCode.value });
        initialPhone.value = phoneNumber.value;
        initialDialCode.value = dialCode.value;
        message.success('Số điện thoại đã được cập nhật thành công!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Không thể lưu thay đổi';
      message.error(errorMessage);
      console.error('Lỗi khi lưu thay đổi:', error);
    } finally {
      isSuccessModalVisible.value = false;
      isEmailChanged.value = false;
      isPhoneChanged.value = false;
      otpChecked.value = true;
      verifiedOtp.value = '';
    }
  };

  // Schema validate cho form đổi mật khẩu
  const changePassSchema = yup.object({
    password: yup
      .string()
      .required('Please enter a password!')
      .min(8, 'Password must be at least 8 characters!'),
    confirmPassword: yup
      .string()
      .required('Please confirm your password!')
      .oneOf([yup.ref('password'), null], 'Passwords must match!'),
  });

  // Xử lý submit form đổi mật khẩu
  const onPasswordSubmit = async (values, { resetForm }) => {
    try {
      await changePassword({
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });
      resetForm();
      showVerifySuccessModal('password');
    } catch (error) {
      message.error('Đổi mật khẩu thất bại!');
      console.error('Error changing password:', error);
    }
  };
  

  // Cấu hình vue-tel-input
  const bindProps = {
    mode: "national",
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
    defaultCountry: "VN",
    value: initialPhone.value, // Đặt giá trị ban đầu
  };
  
</script>

<style lang="scss">
  @import "@/assets/mixins.scss";
  .success-verify-modal {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    &__img-icon {
      margin: 0 auto 2rem;
    }
    .ant-modal-content {
      border-radius: 20px;
      padding: 40px;
      background: var(--iat_gradient-modal_linear, linear-gradient(179deg, #AEEDF8 -27.13%, #FFF 23.42%));
    }
    &__title {
      font-size: 20px;
      font-weight: 700;
      color: #294563;
      margin: 0 0 2rem;
    }
    &__caption {
      font-size: 14px;
      font-weight: 400;
      color: #505050;
    }
    &__btn {
      margin: 2rem auto 0;
      height: 44px;
      font-size: 16px;
      text-transform: uppercase;
      min-width: 160px;
    }
  }
  .verify-modal {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    &__img-icon {
      margin: 0 auto 2rem;
    }
    .ant-modal-content {
      border-radius: 20px;
      padding: 40px;
      background: var(--iat_gradient-modal_linear, linear-gradient(179deg, #AEEDF8 -27.13%, #FFF 23.42%));
    }
    &__title {
      font-size: 20px;
      font-weight: 700;
      color: #294563;
      margin: 0 0 2rem;
    }
    &__caption {
      font-size: 14px;
      font-weight: 400;
      color: #505050;
      margin-bottom: 4px;
    }
    &__target {
      font-size: 14px;
      font-weight: 700;
      color: #294563;
      margin-bottom: 8px;
    }
    &__input {
      width: 100%;
      height: 44px;
      border-radius: 99999px;
      border: 1px solid #EAECEF;
    }
    &__btn {
      margin: 1.6rem auto 0;
      height: 44px;
      font-size: 16px;
      text-transform: uppercase;
      min-width: 160px;
    }
    &__remaining-time {
      font-weight: 400;
      color: var(--Text-Body-2, #62626b);
      text-align: center;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 2rem 0 0;
      font-family: $font-family;
      .ant-statistic-content {
        font-size: 14px;
        font-weight: 700;
        color: #FAA859;
        span {
          font-weight: 700;
        }
        .ant-statistic-content-suffix {
          margin: 0;
        }
      }
    }
    &__resend-code {
      color: #FAA859;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      margin-top: 2rem;
    }
  }
  .ant-upload-wrapper .ant-upload-drag {
    border: 2px dashed #32B3C7;
    border-radius: 20px;
  }
  .general-card {
    .ant-input-password {
      .ant-input {
        height: 40px;
      }
    }
  }
  .upload-modal {
    .ant-btn.ant-btn-sm.ant-btn-icon-only {
      display: none;
    }
    .ant-upload-wrapper {
      width: 100%;
    }
    &.error {
      .upload-modal__note {
        color: #DD1804;
      }
      .ant-upload-drag {
        border: 2px dashed #DD1804;
      }
      .ant-upload-wrapper .ant-upload-drag:not(.ant-upload-disabled):hover {
        border-color: #DD1804;
      }      
    }    
    .ant-modal-content {
      padding: 40px;
    }
    .ant-upload-wrapper .ant-upload-drag:not(.ant-upload-disabled):hover {
      border-color: #32B3C7;
    }
    .ant-upload-text {
      color: var(--Text-Body-2, #505050);
      font-size: 14px;
      font-weight: 400;
    }
  }
  
</style>
<style lang="scss" scoped>
  @import "@/assets/mixins.scss";
  
  .upload-modal {
    &__btn {
      margin: 4px auto 0;
    }
    &__note {
      color: var(--Text-Body-3, #9A9A9A);
      font-size: 14px;
      font-style: italic;
      font-weight: 400;
      margin-top: 8px;
      span {
        color: var(--Text-Red, #DD1804);
      }
    }
  }
  .section-title {
    margin-bottom: 2rem;
  }

  .profile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    &__avatar {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border: 1px solid #2BD4EE;
      border-radius: 50%;
      margin: 0 0 12px;
    }
    &__name {
      font-size: 28px;
      font-weight: 700;
      color: #02317E;
      margin: 0 0 8px;
    }
    &__btn {
      background: var(--iat_light_blue-50, #DFF8FC);
      font-size: 14px;
      font-weight: 700;
      color: var(--iat_light_blue-600, #00B1D0);
      &:hover {
        color: var(--iat_light_blue-600, #00B1D0);
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      }
    }
  }

  .general-card {
    border-radius: var(--Space-7, 20px);
    border: 1px solid #E8E8E8;
    background: var(--Color, #FFF);
    padding: var(--Space-4, 24px) var(--Space-4, 24px) var(--Space-8, 24px) var(--Space-4, 24px);
    @include mobile {
      padding: 15px; 
    }
    &.-pass-word {
      background: url('@/assets/images/misc/profile-pass-img.svg') right 24px center no-repeat;
      background-size: contain;
      @include mobile {
        background: none; 
      }
      .general-card__row-item {
        @include mobile {
          grid-template-columns: 1fr;
        }
      }
      .general-card__btn {
        @include mobile {
          margin: 0 auto; 
        }
      }
    }
    .ant-input, .ant-input-password {
      border-radius: 99999px;
      height: 40px;
    }
    div.vue-tel-input {
      height: 40px;
      border: 1px solid var(--Primary-primary-50, #BDC5CF);
    }
    &__row-item {
      display: grid;
      grid-template-columns: 0.3fr 1fr 0.3fr;
      gap: 2rem;
      align-items: center;
      &+.general-card__row-item {
        margin-top: 2.4rem;
      }
      @include mobile {
        grid-template-columns: 70% 20%; /* Phần tử 2 chiếm 80%, phần tử 3 chiếm 20% */
        grid-template-rows: auto auto; /* Hai hàng */
        gap: 1rem;
      }
    }
    &__col-item {
      &:nth-child(1) {
        @include mobile {
          grid-column: 1 / -1; /* Phần tử 1 chiếm toàn bộ hàng 1 */
          grid-row: 1; /* Đặt ở hàng 1 */
        }
      }
      &:nth-child(2) {
        @include mobile {
          grid-column: 1; /* Phần tử 2 ở cột 1 của hàng 2 */
          grid-row: 2; /* Đặt ở hàng 2 */
        }
      }
      &:nth-child(3) {
        @include mobile {
          grid-column: 2; /* Phần tử 3 ở cột 2 của hàng 2 */
          grid-row: 2; /* Đặt ở hàng 2 */
        }
      }
    }
    &__item-label {
      color: var(--Text-Body-3, #9A9A9A);
      font-size: 14px;
    }
    &__btn {
      @include mobile {
        padding: 8px 15px; 
      }
      &.-disabled {
        opacity: 0.3;
        pointer-events: none;
      }
      &.-hide {
        display: none;
      }
    }
    &__note {
      color: var(--Text-Body-3, #9A9A9A);
      font-size: 12px;
      font-style: italic;
      font-weight: 400;
      margin-top: 4px;
    }
  }
</style>