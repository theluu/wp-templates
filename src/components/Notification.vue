<template>
  <div class="notification">
    <div class="notification__header">
      <h6 class="notification__title">Notification</h6>
      <div class="notification__buttons">
        <RouterLink to="/notification"><i class="fa-light fa-arrow-up-right-and-arrow-down-left-from-center"></i></RouterLink>
        <i class="fa-light fa-xmark" @click="showNotification"></i>        
      </div>      
    </div>
    <div class="notification__body">
      <!-- Sử dụng v-for để lặp qua notifications -->
      <div 
        v-for="notification in notifications" 
        :key="notification.id" 
        class="notification__item" 
        :class="{ '-unread': notification.isUnread }"
      >
        <div class="notification__item-body">
          <span :class="`notification__item-icon -${notification.type}`"></span>
          <div class="notification__item-mess">
            <h5 class="notification__item-name" v-html="notification.title"></h5>
            <div v-if="notification.message" class="notification__item-cap">
              {{ notification.message }}
            </div>
          </div>        
        </div>
        <div class="notification__item-time">{{ notification.time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { RouterLink } from 'vue-router';
  import axios from 'axios';

  const showNotification = () => {
    const body = document.querySelector('body');
    body.classList.toggle('showing-notification');
  };

  // Define reactive state for notifications
  const notifications = ref([]);

  // Fetch notifications data using Axios when the component is mounted
  onMounted(async () => {
    try {
      // const response = await axios.get('/data/notifications.json');
      // notifications.value = response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  });
</script>

<style lang="scss" scoped>
  @import "@/assets/mixins.scss";
  .showing-notification {
    .notification {
      transform: translateX(0);
    }
    .page-wrap {
      width: calc(100% - 360px);
    }
  }
  .notification {
    transform: translateX(100%);
    transition: all 0.55s cubic-bezier(0.32, -0.08, 0.42, 1.22);
    position: fixed;
    width: 100%;
    max-width: 360px;
    height: 100vh;
    max-height: calc(100vh - 73px);
    overflow: hidden;
    overflow-y: scroll;
    right: 0;
    top: 7.2rem;
    z-index: 100;
    background-color: #fff;
    border-radius: 20px 0px 0px 20px;
    border: 1px solid var(--progress-bar-bar-circle, #EAECEF);
    box-shadow: 0px 4px 30px 0px rgba(41, 69, 99, 0.05);
    &__header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    &__title {
      font-size: 20px;
      font-weight: 700;
      color: $primary-500;
    }
    &__buttons {
      display: flex;
      gap: 1.6rem;
      margin-left: auto;
      font-size: 24px;
      i {
        width: 24px;
        height: 24px;
        color: $primary-500;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
    &__item {
      padding: 8px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      cursor: pointer;
      position: relative;
      &.-unread {
        &::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background-color: #32B3C7;
          top: 8px;
          right: 20px;
          border-radius: 50%;
        }
      }
      &:hover {
        background-color: #F6FAFF;
      }
    }
    &__item-body {
      display: flex;
      gap: 8px;
    }
    &__item-name {
      font-size: 14px;
      font-weight: 700;
      font-family: $font-family-heading;
      strong {
        font-size: 14px;
        display: flex;
        font-weight: bold;
      }
    }
    &__item-time {
      color: var(--Text-Body-3, #9A9A9A);
      display: inline-flex;
      align-self: flex-end;
      font-size: 12px;
      font-style: italic;
      font-weight: 400;
    }
    &__item-icon {
      display: flex;
      width: 36px;
      height: 36px;
      padding: 4px 3px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      border-radius: 50%;
      background: var(--Listening-5, #D6F0F4);
      &.-order {
        background-color: #FEEEDE;
        &::before {
          content: "\f555";
          color: #FAA859;
        }
      }
      &.-doc {
        background: var(--Speaking-5, #F4E0E4);
        &::before {
          content: "\f15b";
          color: #C86478;
        }
      }
      &.-password {
        background-color: #D6F0F4;
        &::before {
          content: "\f30d";
          color: #32B3C7;
        }
      }
      &::before {
        content: '\f0e0';
        font-family: "Font Awesome 6 Pro";
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        display: var(--fa-display, inline-block);
        font-style: normal;
        font-variant: normal;
        line-height: 1;
        text-rendering: auto;
        color: #32B3C7;
        font-weight: 500;
      }
    }
    &__item-name {
      font-size: 14px;
      font-weight: bold;
      color: $primary-500;
    }
    &__item-cap {
      color: var(--Text-Body-3, #9A9A9A);
      font-size: 12px;
      font-weight: 400;
    }
  }
</style>