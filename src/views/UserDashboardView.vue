<template>
  <div class="page-wrap">
    <section class="enter-code">
      <div class="container enter-code__container">
        <div class="enter-code__col-left">
          <div class="enter-code__title">{{ Drupal.t('Enter your code here to start now!') }}</div>
          <div class="enter-code__desc">{{ Drupal.t('You will receive the exam code from your school or organization prior to each test') }}</div>
        </div>
        <div class="enter-code__colright">
          <a-input class="iot-input enter-code__input" v-model:value.lazy="value" placeholder="Enter your exam code" />
          <a-button class="iot-grbt enter-code__next-btn" @click="handleAddTest">{{ Drupal.t('NEXT') }}</a-button>
        </div>
      </div>
      
    </section>
    <div class="container">
      <section v-if="authStore.loggedin" class="all-collection">
        <h2 class="section-title all-collection__title">{{ Drupal.t('My Test') }}</h2>
        <div class="section-caption all-collection__cap">{{ Drupal.t('The list of your IELTS exams after entering the test code') }}</div>
        <div class="all-collection__items-wrapper">
          <div class="all-collection__search">
            <div
              class="all-collection__exp-more"
              :class="{ active: showAllMyTests }"
              @click="toggleMyTests"
            >
              {{ showAllMyTests ? 'Collapse' : 'Explore more' }}<i class="fa-light fa-arrow-down"></i>
            </div>
            <a-input class="all-collection__search-input"
              v-model:value="myTestInputSearchValue"
              placeholder="Search"
              @search="onMyTestSearch"
              allow-clear
            />
          </div>
          <a-tabs class="all-collection__tabs" v-model:activeKey="myTestActiveKey">
            
            <!-- Tab All -->
            <a-tab-pane key="1" force-render>
              <template #tab>
                <span>All <a-badge :count="filteredMyTestItems.length" /></span>
              </template>              
              <template v-if="displayedMyTestItems.length > 0">
                <div class="all-collection__items-grid">
                  <CollectionItem 
                  v-for="item in displayedMyTestItems" 
                  :key="item.id" 
                  :item="item"
                  @openModal="handleOpenModal"
                  />
                </div>
              </template>
              <NoTestsFound v-else />
            </a-tab-pane>

            <!-- Tab Inprogress -->
            <a-tab-pane key="2" force-render>
              <template #tab>
                <span>Inprogress <a-badge :count="myTestInprogressItems.length" /></span>
              </template>
              <template v-if="myTestInprogressItems.length > 0">
                <div class="all-collection__items-grid">
                  <CollectionItem 
                  v-for="item in myTestInprogressItems" 
                  :key="item.id" 
                  :item="item"
                  @openModal="handleOpenModal"
                  />
                </div>
              </template>
              <NoTestsFound v-else />
            </a-tab-pane>

            <!-- Tab Completed -->
            <a-tab-pane key="3" force-render>
              <template #tab>
                <span>Completed <a-badge :count="myTestCompletedItems.length" /></span>
              </template>
              <template v-if="myTestCompletedItems.length > 0">
                <div class="all-collection__items-grid">
                  <CollectionItem 
                  v-for="item in myTestCompletedItems" 
                  :key="item.id" 
                  :item="item" 
                  @openModal="handleOpenModal"
                  />
                </div>
              </template>
              <NoTestsFound v-else />
            </a-tab-pane>

            <!-- Tab Expired -->
            <a-tab-pane key="4" force-render>
              <template #tab>
                <span>Expired <a-badge :count="myTestExpiredItems.length" /></span>
              </template>
              <template v-if="myTestExpiredItems.length > 0">
                <div class="all-collection__items-grid">
                  <CollectionItem 
                  v-for="item in myTestExpiredItems" 
                  :key="item.id" 
                  :item="item" 
                  @openModal="handleOpenModal"
                  />
                </div>
              </template>
              <NoTestsFound v-else />
            </a-tab-pane>
          </a-tabs>
        </div>      
      </section>

      <section class="all-collection">
        <h2 class="section-title all-collection__title">{{ Drupal.t('All Collections') }}</h2>
        <div class="section-caption all-collection__cap">{{ Drupal.t('You also can explore more about our IELTS Collections here') }}</div>
        <div class="all-collection__items-wrapper">
          <div class="all-collection__search">
            <div
              class="all-collection__exp-more"
              :class="{ active: showAllCollections }"
              @click="toggleCollections"
            >
              {{ showAllCollections ? 'Collapse' : 'Explore more' }}<i class="fa-light fa-arrow-down"></i>
            </div>
            <a-input class="all-collection__search-input"
              v-model:value="inputSearchValue"
              placeholder="Search"
              @search="onSearch"
              allow-clear
            />
          </div>
          <a-tabs class="all-collection__tabs" v-model:activeKey="activeKey">
            
            <!-- Tab All -->
            <a-tab-pane key="1" force-render>
              <template #tab>
                <span>All <a-badge :count="filteredCollectionItems.length" /></span>
              </template>
              <template v-if="displayedCollectionItems.length > 0">
                <div class="all-collection__items-grid">
                  <CollectionItem 
                  v-for="item in displayedCollectionItems" 
                  :key="item.id" 
                  :item="item" 
                  @openModal="handleOpenModal"
                  />
                </div>
              </template>
              <NoTestsFound v-else />
            </a-tab-pane>

            <!-- Tab Academic Test -->
            <a-tab-pane key="2" force-render>
              <template #tab>
                <span>Academic Test <a-badge :count="academicItems.length" /></span>
              </template>
              <template v-if="academicItems.length > 0">
                <div class="all-collection__items-grid">
                  <CollectionItem 
                  v-for="item in academicItems" 
                  :key="item.id" 
                  :item="item" 
                  @openModal="handleOpenModal"
                  />
                </div>
              </template>
              <NoTestsFound v-else />
            </a-tab-pane>

            <!-- Tab General Training Test -->
            <a-tab-pane key="3" force-render>
              <template #tab>
                <span>General Training Test  <a-badge :count="generalItems.length" /></span>
              </template>
              <template v-if="generalItems.length > 0">
                <div class="all-collection__items-grid">
                  <CollectionItem v-for="item in generalItems" :key="item.id" :item="item" />
                </div>
              </template>
              <NoTestsFound v-else />
            </a-tab-pane>
          </a-tabs>
        </div>      
      </section>
    </div>
  </div>
  <a-modal
    class="modal-start-test"
    v-model:open="modalTakeTestVisible"
    centered
    @ok="handleStartTest"
    cancelText="QUIT"
    okText="Start"
    width="457px"
  >
    <div class="modal-start-test__body">
      <div class="modal-start-test__text-block -top">{{ Drupal.t('Are you ready?') }}</div>
      <div class="modal-start-test__text-block -bottom"><span>{{ Drupal.t('Let\'s start the test now!') }}</span></div>
      <div class="modal-start-test__desc">{{ Drupal.t('Click \'Start\' to take the test now, or you can find it under \'My Tests\' and take it whenever you want.') }}</div>
    </div>
  </a-modal>
  
  <a-modal
    class="modal-get-consultation"
    v-model:open="modalConsultationVisible"
    centered
    @ok="handleStartTest"
    cancelText="QUIT"
    okText="Start"
    width="625px"
    :footer="null"
  >
    <div class="modal-get-consultation__body">
      <h3 class="modal-get-consultation__title">{{ Drupal.t('Get a free consultation?') }}</h3>
      <div class="modal-get-consultation__contents">
        <div class="modal-get-consultation__col-left">
          <Form @submit="handleConsultationSubmit" :validation-schema="consultationSchema">
            <div class="modal-get-consultation__item">
              <label for="userContactName" class="modal-get-consultation__label">{{ Drupal.t('Full name') }}<span class="red">*</span></label>          
              <Field name="userContactName" v-slot="{ field, errors }">
                <a-input
                  id="userContactName"
                  class="modal-get-consultation__input"
                  v-bind="field"
                  :placeholder="Drupal.t('Enter your full name')"
                  :status="errors.length ? 'error' : ''"
                />
                <span class="error-message">{{ errors[0] }}</span>
              </Field>
            </div>
            <div class="modal-get-consultation__item">
              <label for="userContactPhone" class="modal-get-consultation__label">{{ Drupal.t('Phone number') }}<span class="red">*</span></label>
            
              <Field name="userContactPhone" v-slot="{ field, errors, meta }">
                <vue-tel-input
                  class="modal-get-consultation__input"
                  :autoFormat="false"
                  v-bind="{ ...field, ...bindProps }"
                  @on-input="onPhoneInput"
                  @blur="meta.setTouched"
                  :class="{ error: meta.touched && errors.length }"
                ></vue-tel-input>
                <span class="error-message" v-if="meta.touched && errors.length">{{ errors[0] }}</span>
              </Field>
            </div>
            <div class="modal-get-consultation__item">
              <label for="userContactEmail" class="modal-get-consultation__label">{{ Drupal.t('Email') }}</label>
              <Field name="userContactEmail" v-slot="{ field, errors }">
                <a-input
                  id="userContactEmail"
                  class="modal-get-consultation__input"
                  v-bind="field"
                  :placeholder="Drupal.t('ex: abc@gmail.com')"
                  :status="errors.length ? 'error' : ''"
                />
                <span class="error-message">{{ errors[0] }}</span>
              </Field>
            </div>
            <a-button
              class="modal-get-consultation__submit-btn"
              type="primary"
              html-type="submit"
              :loading="isSubmitting"
              >{{ Drupal.t('Submit') }}</a-button>
            
          </Form>
        </div>
        <div class="modal-get-consultation__or">{{ Drupal.t('Or') }}</div>
        <div class="modal-get-consultation__col-right">
          <div class="modal-get-consultation__qr qr-card">
            <div class="qr-card__image-wrapper">
              <img :src="qrImages[currentQrType]" alt="QR Code" class="qr-card__image" />
            </div>            
            <div class="qr-card__desc">{{ Drupal.t('Scan the QR code to chat with our consultation team') }}</div>
            <div class="qr-card__qr-options">
              <div
                class="qr-card__qr-option"
                :class="{ '-active': currentQrType === 'zalo' }"
                @click="handleQrOptionClick('zalo')"
              >
                <img src="@/assets/images/icons/zalo-icon.svg" alt="Zalo Icon" class="qr-card__qr-icon" />
              </div>
              <div
                class="qr-card__qr-option"
                :class="{ '-active': currentQrType === 'whatsapp' }"
                @click="handleQrOptionClick('whatsapp')"
              >
                <img src="@/assets/images/icons/whats-app-icon.svg" alt="Whats app Icon" class="qr-card__qr-icon" />
              </div>
              <div
                class="qr-card__qr-option"
                :class="{ '-active': currentQrType === 'wechat' }"
                @click="handleQrOptionClick('wechat')"
              >
                <img src="@/assets/images/icons/wechat-icon.svg" alt="Wechat Icon" class="qr-card__qr-icon" />
              </div>
            </div>
          </div>
        </div>        
      </div>
    </div>
  </a-modal>

  <a-modal
    v-model:open="modalHaveCodeVisible"
    :footer="null"
    width="494px"
    centered
    class="modal-have-excode"
  >
    <div class="modal-content">
      <img src="@/assets/images/icons/question-icon.svg" alt="" class="modal-have-excode__icon" />
      <h3 class="modal-have-excode__title">Have you received your exam code?</h3>
      <p class="modal-have-excode__desc">
        {{ Drupal.t('You need to enter a exam code to start the test. If you don\'t have one yet, please contact your school or organization to receive additional exam code.') }}
      </p>
      <a-button
        type="primary"
        class="modal-have-excode__btn"
        @click="handleGotIt"
      >
        GOT IT
      </a-button>
      <div class="modal-have-excode__help">
        {{ Drupal.t('Still need help?') }} <a @click="handleContactUs" href="#">{{ Drupal.t('Contact us') }}</a>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';
  import { watch, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import CollectionItem from '@/components/CollectionItem.vue';
  import NoTestsFound from '@/components/NoTestsFound.vue';
  import {useAuthStore} from "@/store.js";
  import { message } from 'ant-design-vue';
  import { Field, Form } from "vee-validate";
  import * as yup from 'yup';
  
  const authStore = useAuthStore();
  const router = useRouter();

  // Khởi tạo các biến reactive
  const inputSearchValue = ref('');
  const activeKey = ref('1'); // Tab mặc định là "All"
  const myTestInputSearchValue = ref('');
  const myTestActiveKey = ref('1'); // Tab mặc định là "All"
  const value = ref('');
  const modalTakeTestVisible = ref(false);
  const modalConsultationVisible = ref(false);
  const collectionItems = ref([]);
  const filteredCollectionItems = ref([]); // Biến lưu trữ danh sách đã lọc
  const myTestItems = ref([]);
  const filteredMyTestItems = ref([]); // Biến lưu trữ danh sách đã lọc
  // Biến để lưu urlTest từ CollectionItem
  const currentUrlTest = ref('');
  const modalHaveCodeVisible = ref(false);
  const userHaveAgent = authStore.config.user.agent || false; // Biến để kiểm tra người dùng có agent hay không
  console.log('User have agent:', userHaveAgent);

  // Xử lý khi nhấn "GOT IT"
  const handleGotIt = () => {
    modalHaveCodeVisible.value = false;
    // Thêm logic điều hướng hoặc xử lý tiếp theo nếu cần
    router.push('/dashboard');
  };

  // Xử lý khi nhấn "Contact us"
  const handleContactUs = () => {
    modalHaveCodeVisible.value = false;
    modalConsultationVisible.value = true;
  };

  // Biến để quản lý loại QR code hiện tại
  const currentQrType = ref('zalo');

  // Biến reactive để lưu trữ URL hình ảnh QR code từ API
  const qrImages = ref({
    zalo: '/public/images/misc/no-image.webp',
    whatsapp: '/public/images/misc/no-image.webp',
    wechat: '/public/images/misc/no-image.webp',
  });

  // Hàm lấy URL hình ảnh QR code từ API
  const fetchQrImages = async () => {
    try {
      const endpoint = authStore.config?.endpoint?.qrImages;
      if (endpoint) {
        const response = await axios.get(endpoint);
        if (response.data.success) {
          qrImages.value = response.data.data;
        } else {
          console.error('Failed to fetch QR images:', response.data.error);
          // Giữ giá trị mặc định (no-image.webp) nếu API trả về lỗi
        }
      } else {
        console.warn('QR images endpoint not defined');
      }
    } catch (error) {
      console.error('Error fetching QR images:', error);
      // Giữ giá trị mặc định (no-image.webp) nếu có lỗi
    }
  };

  // Gọi hàm fetchQrImages khi component được mount
  fetchQrImages();

  // Hàm xử lý khi click vào qr option
  const handleQrOptionClick = (type) => {
    currentQrType.value = type;
  };

  // Schema validate cho form tư vấn
  const consultationSchema = yup.object({
    userContactName: yup.string().required('Please enter your full name'),
    userContactPhone: yup
      .string()
      .required('Please enter your phone number')
      .matches(/^\+?\d{9,}$/, 'Your phone number is not valid'),
  });

  // Biến để kiểm soát trạng thái gửi form
  const isSubmitting = ref(false);

  // Hàm xử lý submit form tư vấn
  const handleConsultationSubmit = async (values, { resetForm }) => {
    isSubmitting.value = true;
    try {
      // Giả lập gửi dữ liệu tới server
      await axios.post(authStore.config.endpoint.consultation, values);
      message.success('Send consultation information successfully!');
      resetForm();
      modalConsultationVisible.value = false;
    } catch (error) {
      message.error('Submit consultation failed. Please try again later.');
      console.error('Error submitting consultation:', error);
    } finally {
      isSubmitting.value = false;
    }
  };

  // Cấu hình vue-tel-input
  const bindProps = {
    mode: 'international',
    preferredCountries: ['VN', 'GB', 'CN'],
    validCharactersOnly: true,
    dropdownOptions: {
      showDialCodeInSelection: true,
      showFlags: true,
      showDialCodeInList: true,
    },
    inputOptions: {
      showDialCode: false,
      type: 'tel',
      placeholder: 'Enter your phone number',
      autocomplete: 'tel-national',
      id: 'userContactPhone',
    },
    defaultCountry: 'VN',
  };

  // Xử lý input số điện thoại
  const onPhoneInput = (number, phoneObject) => {
    if (phoneObject) {
      console.log('Phone input:', { number, phoneObject });
    }
  };

  // Fetch dữ liệu từ file JSON bằng Axios
  const fetchData = async () => {
    try {
      const endpoint = authStore.config?.endpoint || {};
      const response = await axios.get(endpoint.collections); // Đường dẫn tới file JSON trong public
      collectionItems.value = response.data.data || [];
      filteredCollectionItems.value = collectionItems.value; // Khởi tạo danh sách đã lọc
      // Get my-test items
      if (authStore.loggedin && endpoint.my_test) {
        const myTestResponse = await axios.get(endpoint.my_test); // Đường dẫn tới file JSON trong public
        myTestItems.value = myTestResponse.data.data || [];
        filteredMyTestItems.value = myTestItems.value; // Khởi tạo danh sách đã lọc
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Gọi hàm fetchData khi component được mount
  fetchData();

  // Hàm xử lý thêm bài test mới
  const handleAddTest = async () => {
    if (!value.value) {
      message.error('Please enter a test code.');
      return;
    }

    try {
      const response = await axios.post(authStore.config.endpoint.validateCode, { code: value.value });
      if (response.data.success) {
        const { my_test, collections } = response.data.data;
        // Thêm các item mới vào đầu danh sách hiện tại
        myTestItems.value = [...my_test.data, ...myTestItems.value];
        filteredMyTestItems.value = [...my_test.data, ...filteredMyTestItems.value];
        message.success('Test code is valid. You can now take the test.');
        value.value = ''; // Reset input
        modalTakeTestVisible.value = true; // Mở modal
        currentUrlTest.value = my_test.data[0]?.urlTest || ''; // Cập nhật urlTest
      } else {
        message.error(response.data.error || 'Test code is invalid.');
      }
    } catch (error) {
      message.error('Test code validation failed. Please try again later.');
      console.error('Error validating code:', error);
    }
  };

// Computed properties để hiển thị danh sách

  // Biến để kiểm soát trạng thái hiển thị
  const showAllCollections = ref(false);
  const showAllMyTests = ref(false);

  // Computed properties để giới hạn số lượng items hiển thị
  const displayedCollectionItems = computed(() => {
    if (showAllCollections.value) {
      return filteredCollectionItems.value;
    }
    return filteredCollectionItems.value.slice(0, 5);
  });

  const displayedMyTestItems = computed(() => {
    if (showAllMyTests.value) {
      return filteredMyTestItems.value;
    }
    return filteredMyTestItems.value.slice(0, 5);
  });

  // Hàm toggle trạng thái hiển thị
  const toggleCollections = () => {
    showAllCollections.value = !showAllCollections.value;
  };

  const toggleMyTests = () => {
    showAllMyTests.value = !showAllMyTests.value;
  };

  // Computed properties để lấy dữ liệu theo trạng thái
  const academicItems = computed(() => {
    return filteredCollectionItems.value.filter(item => item.type === 'academic');
  });

  const generalItems = computed(() => {
    return filteredCollectionItems.value.filter(item => item.type === 'general');
  });

  const myTestInprogressItems = computed(() => {
    return filteredMyTestItems.value.filter(item => item.status === 'inprogress');
  });

  const myTestCompletedItems = computed(() => {
    return filteredMyTestItems.value.filter(item => item.status === 'completed' || item.status === 'completed-noscore' || item.status === 'evaluating');
  });

  const myTestExpiredItems = computed(() => {
    return filteredMyTestItems.value.filter(item => item.status === 'expired');
  });

  // Hàm xử lý tìm kiếm cho all-collection
  const onSearch = (value) => {
    if (!value) {
      filteredCollectionItems.value = collectionItems.value; // Reset về danh sách gốc
      return;
    }
    filteredCollectionItems.value = collectionItems.value.filter(item =>
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(value.toLowerCase()))
    );
  };

  // Hàm xử lý tìm kiếm cho my-test
  const onMyTestSearch = (value) => {
    if (!value) {
      filteredMyTestItems.value = myTestItems.value; // Reset về danh sách gốc
      return;
    }
    filteredMyTestItems.value = myTestItems.value.filter(item =>
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(value.toLowerCase()))
    );
  };

  // Hàm xử lý mở modal từ CollectionItem
  const handleOpenModal = ({ urlTest }) => {
    if (userHaveAgent) {
      modalHaveCodeVisible.value = true; // Hiển thị modal tư vấn nếu người dùng có agent
      return;
    } else {
      modalConsultationVisible.value = true; // Hiển thị modal yêu cầu mã bài test nếu không có agent
      return;
    }
  };

  // Hàm xử lý khi nhấn nút Start trong modal
  const handleStartTest = () => {
    if (currentUrlTest.value) {
      // Nếu urlTest là URL tuyệt đối, sử dụng window.location.href để điều hướng
      if (currentUrlTest.value.startsWith('http://') || currentUrlTest.value.startsWith('https://')) {
        window.location.href = currentUrlTest.value;
      } else {
        // Nếu urlTest là đường dẫn tương đối, sử dụng router.push
        router.push(currentUrlTest.value);
      }
    } else {
      message.error('Không có URL bài test được cung cấp!');
      console.log('No urlTest provided');
    }
  };

  // Watchers
  watch(inputSearchValue, (newValue) => {
    onSearch(newValue); // Tự động gọi search khi input thay đổi
  });

  watch(myTestInputSearchValue, (newValue) => {
    onMyTestSearch(newValue); // Tự động gọi search khi input thay đổi
  });

  watch(value, () => {
    console.log(value.value);
  });

</script>

<style lang="scss">
  @import "@/assets/mixins.scss";
  .ant-tooltip {
    .ant-tooltip-inner {
      background: var(--icon-illustration-stroke, #294563);
      text-align: center;
      font-family: Nunito;
    }
    .ant-tooltip-arrow:before {
      background: var(--icon-illustration-stroke, #294563);
    }
  }
  .modal-have-excode {
    .ant-modal-content {
      border-radius: 20px;
      padding: 4rem;
      @include mobile {
        padding: 2rem; 
      }
    }
    .modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    &__title {
      font-size: 22px;
      font-weight: bold;
      color: $primary-500;
      text-align: center;
      margin-bottom: 16px;
      margin: 0;
    }
    &__desc {
      color: var(--Text-Body-2, #505050);
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      margin: 0;
    }
    &__btn {
      min-width: 90px;
    }
    &__help {
      font-size: 12px;
      color: var(--Text-Body-2, #9A9A9A);
      text-align: center;
      font-style: italic;
      a {
        color: #32B3C7;
        text-decoration: underline;
        &:hover {
          color: darken($primary-500, 10%);
        }
      }
    }
  }
  .modal-start-test {    
    .ant-modal-content {
      background: linear-gradient( to bottom, #97D6E2 0%, #fff 80%);
      border-radius: 20px;
      padding: 4rem;
      @include mobile {
        padding: 2rem; 
      }
    }
    .ant-modal-footer {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 2.4rem;
      @include mobile {
        margin-top: 1.2rem;
      }
      .ant-btn {
        padding: 0 24px;
      }
      .ant-btn-default {
        background: #fff;
        color: $primary-500;
        border: 1px solid $primary-500;
      }
    }
    &__text-block  {
      display: flex;
      padding: 16px 26px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border-radius: 20px;
      background: linear-gradient(92deg, #02317E 1.4%, var(--icon-illustration-listening, #32B3C7) 233.97%);
      width: fit-content;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      color: #fff;
      position: relative;
      margin-left: 4rem;
      @include mobile {
        margin-left: 2rem;
        font-size: 20px;
      }
      &.-top {
        &:after {
          content: '';
          width: 64.483px;
          height: 77.787px;
          background: url(@/assets/images/icons/trophy-winner.svg) center no-repeat;
          background-size: contain;
          position: absolute;
          right: -4.4rem;
          top: 1.9rem;
          z-index: 9;
        }
        &:before {
          content: '';
          width: 10.088px;
          height: 11.171px;
          background: url(@/assets/images/icons/triangle-blule.svg) center no-repeat;
          background-size: contain;
          position: absolute;
          left: 4rem;
          top: calc(100% - 1px);
          z-index: 9;
        }
      }
      &.-bottom {
        background: #fff;
        &:after {
          content: '';
          width: 64.483px;
          height: 77.787px;
          background: url(@/assets/images/icons/local-star.svg) center no-repeat;
          background-size: contain;
          position: absolute;
          left: -4.4rem;
          top: 1.9rem;
          z-index: 9;
          @include mobile {
            width: 54.483px;
            height: 57.787px;
            left: -3.4rem;
          }
        }
        &:before {
          content: '';
          width: 15.521px;
          height: 11.971px;
          background: url(@/assets/images/icons/triangle-white.svg) center no-repeat;
          background-size: contain;
          position: absolute;
          right: 5.8rem;
          top: calc(100% - 1px);
          z-index: 9;
        }
        span {
          background: linear-gradient(270deg, var(--icon-illustration-listening, #32B3C7) 0%, #02317E 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }
      }
    }
    &__desc {
      text-align: center;
      color: var(--Text-Body-2, #505050);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      margin-top: 3.7rem;
    }
  }
  
  .all-collection {
    .ant-tabs-top >.ant-tabs-nav::before {
      border: none;
    }
    .ant-tabs-nav {
      margin: 1.2rem 0 4rem;
    }
    &__tabs {
      .ant-badge .ant-badge-count {
        background: #E6E9F3;
        color: #02317E;
        font-weight: 700;
      }
      .ant-tabs-tab  {
        padding: 10px 20px;
        color: $primary-500;
      }
      .ant-tabs-tab+.ant-tabs-tab {
        margin: 0;
      }      
    }
    &__search {
      .all-collection__search-input {
        display: flex;
        gap: 4px;
        align-items: center;
        &:before {
          content: '\e902';
          font-family: 'iaticon' !important;
          speak: never;
          font-style: normal;
          font-weight: normal;
          font-variant: normal;
          text-transform: none;
          line-height: 1;

          /* Better Font Rendering =========== */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          visibility: visible;
          width: initial;
          font-size: 16px;
          color: #294563;
        }
      }
    }
    .ant-input {
      border: none;
      box-shadow: none;
      height: 44px;
    }
    .ant-input-group-addon {
      background: none;
    }
    .ant-btn {
      background: none;
      box-shadow: none;
      border: none;
      outline: none;
      -webkit-tap-highlight-color: transparent;
      font-size: 22px;
      color: $primary-500;
    }
  }

  .modal-get-consultation {
    .ant-modal-content {
      border-radius: 20px;
      padding: 4rem;
      @include mobile {
        padding: 2rem; 
      }
    }
    .ant-modal-footer {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 2.4rem;
      @include mobile {
        margin-top: 1.2rem;
      }
      .ant-btn {
        padding: 0 24px;
      }
      .ant-btn-default {
        background: #fff;
        color: $primary-500;
        border: 1px solid $primary-500;
      }
    }
    .ant-modal-close-x {
      color: $primary-500;
      font-size: 24px;
    }
    &__or {
      position: relative;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      color: #294563;
      @include mobile {
        justify-content: center; 
      }
      &::after, &::before {
        content: '';
        flex: 1;
        width: 1px;
        height: calc(50% - 10%);
        background-color: #BDC5CF;
        position: absolute;
        left: 50%;
        bottom: 0%;
        transform: translate(0,0);
        @include mobile {
          width: 42%;
          height: 1px;
          right: 0;
          left: initial;
          top: 50%;
          transform: none; 
        }
      }
      &::before {
        top: 0;
        @include mobile {
          left: 0;
          top: 50%;
          height: 1px;  
        }
      }
    }
    &__item {
      &+ .modal-get-consultation__item {
        margin-top: 2rem;
      }
    }
    &__title {
      font-size: 22px;
      font-weight: bold;
      color: $primary-500;
      text-align: center;
      margin: 0 0 16px;
    }
    &__contents {
      display: flex;
      gap: 2rem;
      @include mobile {
        flex-direction: column;  
      }
    }
    &__col-right {
      width: 40%;
      @include mobile {
        width: 100%;   
      }
    }
    &__col-left {
      width: 60%;
      @include mobile {
        width: 100%;  
      }      
    }
    &__item {
      text-align: left;
    }
    &__label {
      font-size: 14px;
      color: #294563;
      margin-bottom: 2px;
      display: flex;
      .red {
        color: #DD1804;
      }
    }
    &__input {
      border-radius: 9999px;
      border: 1px solid var(--Primary-primary-200, #BDC5CF);
      background-color: #fff;
      height: 40px;
    }
    &__submit-btn {
      margin: 2.4rem auto 0;
      width: 100%;
      height: 40px;
    }
    .qr-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      border-radius: 16px;
      color: var(--Text-Body-2, #505050);
      height: 100%;
      justify-content: center;
      &__image-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        overflow: hidden;
        height: auto;
        padding: 8px;
        background: var(--iat_blue-800_primary, #02317E);
        box-shadow: 0px 4px 30px 0px rgba(2, 49, 126, 0.05);
      }
      &__image {
        border-radius: 6px;
        width: 100%;
        height: auto;        
        max-width: 154px;
      }
      &__desc {
        color: var(--Text-Body-2, #505050);
        text-align: center;
        font-size: 14px;
        font-style: italic;
        font-weight: 400;
      }
      &__qr-options {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      &__qr-option {
        width: 40px;
        height: 40px;
        padding: 4px;
        border-radius: 16px;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        aspect-ratio: 1/1;
        @include transition();
        &:hover {
          background: #E6E9F3;
        }
        &.-active {
          background: #E6E9F3;
        }
      }
      &__qr-icon {
        width: 100%;
        height: 100%;
        object-fit: contain
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import "@/assets/mixins.scss";

  .enter-code {
    background-color: #F4F7FF;
    &__container {
      display: flex;
      padding: 1.6rem;
      gap: 3rem;
      @include mobile {
        flex-direction: column; 
      }
    }
      
    &__col-left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      @include mobile {
        width: 100%; 
      }
    }
    &__title {
      font-size: 16px;
      font-weight: bold;
      margin: 0;
      color: $primary-500;
    }
     &__desc {
      font-style: italic;
      font-weight: 400;
      color: $primary-500;
    }
    &__input {
      height: 44px;
    }
    &__next-btn {
      height: 44px;
    }   
    &__next-btn {
      min-width: 116px;
    }
    &__colright {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 495px;
      margin: 0 0 0 auto;
      gap: 16px;
      @include mobile {
        width: 100%; 
      }
    }
  }

  .all-collection { 
    .fa-arrow-down {
      width: 32px;
      height: 32px;
      background: #D6F0F4;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #32B3C7;
      border-radius: 50%;
    }
    &__exp-more {
      display: flex;
      gap: 8px;
      margin-bottom: 2rem;
      justify-content: flex-end;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: $primary-500;
      cursor: pointer;
      width: fit-content;
      justify-self: flex-end;
      &.active {
        .fa-arrow-down {
          transform: rotate(180deg);
        }
      }
    }
    &__items-wrapper {
      position: relative;
    }
    &__search {
      position: absolute;
      right: 0;
      bottom: calc(100% - 4rem);
      z-index: 9;
      width: 27%;
      @include mobile {
        position: relative; 
        width: 100%;
      }
    }
    &__search-input {
      border-radius: 100px;
      border: 1px solid var(--Primary-primary-200, #9DA9B7);
      background: #FFF;
      overflow: hidden;
      height: 40px;
      .ant-input {
        border: none;
      }
    }
    &__items-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 2rem;
      @include tablet {
        grid-template-columns: repeat(2, 1fr);
      }
      @include mobile {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
    }
  }

</style>