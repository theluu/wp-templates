<template>
  <div class="user-dashboard">
    <div class="container">
      <a-breadcrumb>
        <a-breadcrumb-item><RouterLink to="/dashboard">Dashboard</RouterLink></a-breadcrumb-item>
        <a-breadcrumb-item>My Test History</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="user-dashboard__body">
        <div class="user-dashboard__menu">
          <DashboardMenu />
        </div>
        <div class="user-dashboard__contents">
          <h1 class="user-dashboard__title">My Test History</h1>
          <div class="my-test-history">
            <div class="test-history-search">
              <a-range-picker class="test-history-search__date" v-model:value="dateRange">
                <template #suffixIcon>
                  <i class="fa-light fa-calendar"></i>
                </template>
              </a-range-picker>
              <div class="test-history-search__scores">
                <a-select
                  ref="selectMinScore"
                  v-model:value="minScore"
                  style="width: 120px"
                  placeholder="Min score"
                  allow-clear
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                >
                  <a-select-option v-for="score in scoreOptions" :key="score" :value="score">{{ score }}</a-select-option>
                </a-select>
                <a-select
                  ref="selectMaxScore"
                  v-model:value="maxScore"
                  style="width: 120px"
                  placeholder="Max score"
                  allow-clear
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                >
                  <a-select-option v-for="score in scoreOptions" :key="score" :value="score">{{ score }}</a-select-option>
                </a-select>
              </div>
              <a-select
                ref="selectStatus"
                v-model:value="status"
                style="width: 120px"
                placeholder="Status"
                allow-clear
                :getPopupContainer="triggerNode => triggerNode.parentNode"
              >
                <a-select-option value="Not Started">Not Started</a-select-option>
                <a-select-option value="In Progress">In Progress</a-select-option>
                <a-select-option value="Completed">Completed</a-select-option>
              </a-select>
              <a-input
                class="test-history-search__input"
                v-model:value="testName"
                placeholder="Enter test name"
              />
              <div v-if="isFiltered" class="test-history-search__reset" @click="resetFilters">
                <i class="fa-light fa-arrows-rotate-reverse"></i>
              </div>
              <a-button type="primary" @click="applyFilters">Apply</a-button>
            </div>
            <div class="test-history-table">
              <a-table
                :columns="columns"
                :data-source="dataSource"
                :pagination="pagination"
                :loading="loading"
                :row-key="record => record.key"
                @change="handleTableChange"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'name'">
                    {{ record.testname }}
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <span>
                      <a-tag
                        :class="{
                          'test-history-table__tag': true,
                          '-orange': record.status === 'Not Started',
                          '-green': record.status === 'In Progress',
                          '-aqua': record.status === 'Completed',
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
                          'test-history-table__btn': true,
                          '-orange': record.action === 'Start',
                          '-green': record.action === 'Continue',
                          '-aqua': record.action === 'View',
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import DashboardMenu from '@/components/DashboardMenu.vue';
import { useAuthStore } from '@/store';

const authStore = useAuthStore();

const scoreOptions = ['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];
const dateRange = ref([]);
const minScore = ref(null);
const maxScore = ref(null);
const status = ref(null);
const testName = ref('');
const dataSource = ref([]);
const loading = ref(false);
const isFiltered = ref(false);

// Phân trang
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const columns = [
  { title: 'Test name', dataIndex: 'testname', key: 'name' },
  { title: 'Test code', dataIndex: 'testcode', key: 'testcode' },
  { title: 'Test date', dataIndex: 'testdate', key: 'testdate' },
  { title: 'Score', dataIndex: 'score', key: 'score' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Action', dataIndex: 'action', key: 'action' },
];

// Tính toán pagination cho a-table
const pagination = computed(() => ({
  current: Number(currentPage.value), // Đảm bảo current là Number
  pageSize: Number(pageSize.value), // Đảm bảo pageSize là Number
  total: Number(total.value),
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
  position: ['bottomCenter'],
}));

// Hàm gọi API để lấy dữ liệu
const fetchData = async (page = 1, results = pageSize.value) => {
  try {
    loading.value = true;
    const endpoint = authStore.config?.endpoint?.my_test_history;
    if (!endpoint) {
      throw new Error('Endpoint not defined');
    }

    // Tạo params cho yêu cầu API
    const params = {
      results,
      page,
      minScore: minScore.value,
      maxScore: maxScore.value,
      status: status.value,
      testName: testName.value.trim(),
      startDate: dateRange.value?.length === 2 ? dayjs(dateRange.value[0]).format('YYYY-MM-DD') : null,
      endDate: dateRange.value?.length === 2 ? dayjs(dateRange.value[1]).format('YYYY-MM-DD') : null,
    };

    console.log('Fetching data with params:', params);

    const response = await axios.get(endpoint, { params });
    if (response.data.success) {
      dataSource.value = response.data.data || [];
      total.value = Number(response.data.total) || 0;
      currentPage.value = Number(page); // Đảm bảo page là Number
      pageSize.value = Number(results); // Đảm bảo results là Number

      // Cập nhật trạng thái lọc
      isFiltered.value =
        minScore.value ||
        maxScore.value ||
        status.value ||
        testName.value.trim() ||
        dateRange.value?.length === 2;

      console.log('Data received:', response.data);
    } else {
      throw new Error(response.data.error || 'Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    dataSource.value = [];
    total.value = 0;
    message.error('Không thể tải dữ liệu lịch sử bài kiểm tra');
  } finally {
    loading.value = false;
  }
};

// Hàm xử lý khi nhấn nút Apply
const applyFilters = () => {
  currentPage.value = 1; // Reset về trang 1 khi áp dụng bộ lọc
  fetchData(1, pageSize.value);
};

// Xử lý sự kiện thay đổi bảng (phân trang, thay đổi kích thước trang)
const handleTableChange = (pagination, filters, sorter) => {
  console.log('handleTableChange called with:', { pagination, filters, sorter });
  const newPage = Number(pagination.current) || 1;
  const newPageSize = Number(pagination.pageSize) || 10;
  currentPage.value = newPage;
  pageSize.value = newPageSize;
  fetchData(newPage, newPageSize);
};

// Reset bộ lọc
const resetFilters = () => {
  dateRange.value = [];
  minScore.value = null;
  maxScore.value = null;
  status.value = null;
  testName.value = '';
  isFiltered.value = false;
  currentPage.value = 1;
  fetchData(1, pageSize.value);
};

// Tải dữ liệu khi component được mount
onMounted(() => {
  fetchData(1, pageSize.value);
});
</script>

<style lang="scss">
.test-history-table {
  .ant-table-wrapper .ant-table-thead >tr>th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    border-right: none !important;
  }
  .ant-table-wrapper .ant-table-thead {
    >tr>th {
      background: #DFF8FC;
      color: var(--Text-Headline, #294563);
      border: none;
    }
  }
  .ant-table-tbody {
    >tr {
      &:nth-child(even) {
        background: #F5F5F5;
      }
      >td {
        border: none !important;
      }
    }
  }
}
.test-history-search {
  .ant-select {
    .ant-select-selector {
      height: 40px;
    }
  }
  .test-history-search__scores {
    position: relative;
    &::after {
      content: '\e905';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
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
      color: rgba(0, 0, 0, 0.25);
      font-size: 12px;
    }
    .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
      padding: 0;
    }
    .ant-select-selector {
      height: 40px;
      border: none;
      outline: none !important;
      box-shadow: none !important;
    }
    .ant-select-selection-search-input {
      height: 100%;
    }
    .ant-select-arrow {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/assets/mixins.scss";

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
  &__scores {
    border-radius: 100px;
    border: 1px solid var(--Primary-primary-100, #BDC5CF);
    background: #FFF;
    display: flex;

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
    max-width: 200px;
  }
  &__date {
    border-radius: 9999px;
  }
  &__input {
    height: 40px;
    border-radius: 9999px;
    background: url('@/assets/images/icons/search.svg') no-repeat right 16px center;
    background-size: 20px;
  }
  .ant-picker {
    height: 40px;
  }
}

.test-history-table {
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
    background: var(--iat_orange-600, #FB8B08);
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