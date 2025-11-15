<template>
  <div class="user-dashboard">
    <div class="container">
      <a-breadcrumb>
        <a-breadcrumb-item><RouterLink to="/dashboard">Dashboard</RouterLink></a-breadcrumb-item>
        <a-breadcrumb-item>My Wallet</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="user-dashboard__body">
        <div class="user-dashboard__menu">
          <DashboardMenu />
        </div>
        <div class="user-dashboard__contents">
          <h1 class="user-dashboard__title">My Wallet</h1>
          <div class="topup-card">
            <div class="topup-card__info-col">
              <div class="topup-card__title">Balance</div>
              <div class="topup-card__balance">
                <div class="topup-card__balance-value">200,000 <span class="topup-card__currency-code">VND</span></div>
                <div class="topup-card__ex-value">~ 7.75 USD</div>
              </div>
              <div class="topup-card__caption">You know, you can top up your wallet to pay your bills super easily!</div>
              <a-button type="primary" class="topup-card__btn-topup">Top up</a-button>
            </div>
            <div class="topup-card__img-col">
              <img src="/images/misc/discount-coupon.png" alt="Top up card image" />
            </div>
          </div>
          <div class="my-test-history">
            <div class="test-history-search">
              <a-range-picker class="test-history-search__date" v-model:value="dateRange">
                <template #suffixIcon>
                  <i class="fa-light fa-calendar"></i>
                </template>
              </a-range-picker>
              <a-select
                ref="selectStatus"
                v-model:value="status"
                style="width: 120px"
                placeholder="Status"
                allow-clear
              >
                <a-select-option value="Completed">Completed</a-select-option>
                <a-select-option value="Canceled">Canceled</a-select-option>
               </a-select>
              <a-input
                class="test-history-search__input"
                v-model:value="testName"
                placeholder="Enter product"
              />
              <div v-if="isFiltered" class="test-history-search__reset" @click="resetFilters"><i class="fa-light fa-arrows-rotate-reverse"></i></div>
              <a-button type="primary" @click="applyFilter">Apply</a-button>
            </div>
            <div class="transaction-table">
              <a-table
                :columns="columns"
                :data-source="filteredData"
                :pagination="{ pageSize: 10, position: ['bottomCenter'] }"
                :loading="loading"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'name'">
                    {{ record.testname }}
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <span>
                      <a-tag
                        :class="{
                          'transaction-table__tag': true,
                          '-orange': record.status === 'Not Started',
                          '-green': record.status === 'In Progress',
                          '-aqua': record.status === 'Completed'
                        }"
                      >
                        {{ record.status }}
                      </a-tag>
                    </span>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <span>
                      <a
                        href=""
                        :class="{
                          'transaction-table__btn': true,
                          '-orange': record.action === 'Start',
                          '-green': record.action === 'Continue',
                          '-aqua': record.action === 'View'
                        }"
                      >
                        {{ record.action }}
                      </a>
                    </span>
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import DashboardMenu from '@/components/DashboardMenu.vue';
import {useAuthStore} from "@/store.js";
const authStore = useAuthStore();

const dateRange = ref([]);
const minScore = ref(null);
const maxScore = ref(null);
const status = ref(null);
const testName = ref('');
const filteredData = ref([]);
const rawData = ref([]);
const loading = ref(false);
const isFiltered = ref(false); // Biến theo dõi trạng thái lọc

const columns = [
  { title: 'ID', dataIndex: 'transId', key: 'transId' },
  { title: 'Transaction date', dataIndex: 'transactionDate', key: 'transactionDate' },
  { title: 'Product', dataIndex: 'product', key: 'product' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  { title: 'Balance', dataIndex: 'balance', key: 'balance' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const applyFilter = () => {
  let result = [...rawData.value];

  // Kiểm tra xem có bộ lọc nào được áp dụng không
  isFiltered.value =
    minScore.value ||
    maxScore.value ||
    status.value ||
    testName.value.trim() ||
    dateRange.value?.length === 2;

  // Filter by min score
  if (minScore.value) {
    result = result.filter(item => parseFloat(item.score) >= parseFloat(minScore.value));
  }

  // Filter by max score
  if (maxScore.value) {
    result = result.filter(item => parseFloat(item.score) <= parseFloat(maxScore.value));
  }

  // Filter by status
  if (status.value) {
    result = result.filter(item => item.status === status.value);
  }

  // Filter by test name
  if (testName.value.trim()) {
    result = result.filter(item =>
      item.product?.toLowerCase().includes(testName.value.trim().toLowerCase())
    );
  }

  // Filter by date range
  if (dateRange.value?.length === 2) {
    const [startDate, endDate] = dateRange.value;
    result = result.filter(item => {
      const transactionDate = dayjs(item.transactionDate);
      return (
        transactionDate.isValid() &&
        transactionDate.isAfter(dayjs(startDate).startOf('day')) &&
        transactionDate.isBefore(dayjs(endDate).endOf('day'))
      );
    });
  }

  filteredData.value = result;
};

const resetFilters = () => {
  dateRange.value = []; // Đặt lại khoảng ngày
  minScore.value = null; // Đặt lại điểm tối thiểu
  maxScore.value = null; // Đặt lại điểm tối đa
  status.value = null; // Đặt lại trạng thái
  testName.value = ''; // Đặt lại tên bài kiểm tra
  filteredData.value = [...rawData.value]; // Khôi phục dữ liệu gốc
  isFiltered.value = false; // Đặt lại trạng thái lọc
};

onMounted(async () => {
  try {
    loading.value = true;
    const endpoint = authStore.config?.endpoint || {};
    let response = await axios.get(endpoint.transaction_history);
    console.log('API Data:', response.data);

    if (Array.isArray(response.data)) {
      rawData.value = response.data;
      filteredData.value = response.data; // Initialize filteredData with raw data
    } else {
      console.warn('Data is not an array:', response.data);
      rawData.value = [];
      filteredData.value = [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    rawData.value = [];
    filteredData.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss">
   .test-history-search {
    .ant-select {
      .ant-select-selector {
        height: 40px;
      }
    }
   }
</style>

<style lang="scss" scoped>
  @import "@/assets/mixins.scss";
  .topup-card {
    display: flex;    
    background: #FFF;
    box-shadow: 0px 4px 30px 0px rgba(2, 49, 126, 0.05);
    align-items: center;
    border-radius: 20px;
    border: 1px solid var(--progress-bar-bar-circle, #EAECEF);
    background: #FFF;
    overflow: hidden;
    @include mobile {
      flex-direction: column; 
    }
    &__info-col {
      flex: 1;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      text-align: center;
    }
    &__title {
      font-size: 16px;
      color: #294563;
      font-family: $font-family-heading;
    }
    &__balance {
      font-family: $font-family-heading;
    }
    &__balance-value {
      font-size: 60px;
      font-style: normal;
      font-weight: 700;
      color: #02317E;
    }
    &__currency-code {
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
    }
    &__ex-value {
      font-size: 20px;
      color: #294563;
    }
    &__caption {
      font-size: 14px;
      color: #9A9A9A;
      margin-bottom: 12px;
    }
    &__btn-topup {
      width: fit-content;
      align-self: center;
      font-size: 16px;
      min-width: 152px;
    }
    &__img-col {
      flex-shrink: 0;
      img {
        max-width: 100%;
        height: auto;
      }
    }
  }

 .test-history-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 8px;
  .fa-calendar {
    font-size: 16px;
    color: #9DA9B7;
  }
  &__reset {
    display: flex;
    width: 40px;
    height: 40px;
    padding: 8px;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    border: 1px solid #BDC5CF;
    flex-shrink: 0;
    font-size: 18px;
    color: #294563;
    cursor: pointer;
  }
  &__scores {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &__date {
    border-radius: 9999px;
  }
  &__input {
    height: 40px;
    border-radius: 9999px;
    background: url('@/assets/images/icons/search.svg') no-repeat right 16px center;
    background-size: 16px 16px;
  }
  .ant-picker {
    height: 40px;
  }
 }
 .transaction-table {
  &__tag {
    display: flex;
    height: 28px;
    padding: 4px 12px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 100px;
    color: #fff;
    width: fit-content;
    border: none;
    background: var(--iat_orange-600, #BDC5CF);
    &.-orange {
      background: var(--iat_orange-600, #FB8B08);
    }
    &.-green {
      background: var(--iat_green-600, #249D44);
    }
    &.-aqua {
      background: var(--iat_aqua-600, #00B1D0);
    }
  }
  &__btn {
    padding: 4px 8px;
    font-weight: 700;
    border-radius: 4px;
    color: #fff;
    text-decoration: underline;
    &.-orange {
      color: #FB8B08;
    }
    &.-green {
      color: #249D44;
    }
    &.-aqua {
      color: #00B1D0;
    }
  }
 }
</style>