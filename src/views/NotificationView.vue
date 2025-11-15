<template>
  <div class="notification-board">
    <div class="container">
      <a-breadcrumb>
        <a-breadcrumb-item><RouterLink to="/">Dashboard</RouterLink></a-breadcrumb-item>
        <a-breadcrumb-item>Notifications</a-breadcrumb-item>
      </a-breadcrumb>      
      <div class="notification-board__contents">
        <div class="notification-board__head">
          <h1 class="notification-board__title">Notification</h1>
        </div>
        <div class="notification-board__body">
          <div class="notification-board__col-left">
            <div class="notification-list">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="notification-item"
                :class="{ '-unread': notification.isUnread }"
              >
                <div class="notification-item__body">
                  <span :class="['notification-item__icon', `-${notification.type}`]"></span>
                  <div class="notification-item__mess">
                    <h5 class="notification-item__name" v-html="notification.title"></h5>
                    <div
                      v-if="notification.message"
                      class="notification-item__cap"
                    >
                      {{ notification.message }}
                    </div>
                  </div>
                </div>
                <div class="notification-item__time">{{ notification.time }}</div>
              </div>
            </div>
          </div>
          <div class="notification-board__col-right">            
            <div class="notification-board__view-details">
              <h6 class="notification-board__item-title">[IAT]  Request to reset password</h6>
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <table cellspacing="0" cellpadding="0" style="margin:0px auto;overflow:hidden;background-color:#fff;max-width: 600px;min-width: 340px; padding: 0; border: 1px solid #EAECEF; border-radius: 20px;" border="0" align="center">
                      <tr>
                        <td style="padding:25px 30px;text-align: center">
                          <a href="#" target="_blank">
                            <img alt="" src="@/assets/images/logos/ait-logo.png" style="max-width: 118px" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0px 0px">
                          <div style="margin: 0px auto; max-width: 100%; font-family:'Nunito', Arial, sans-serif;">
                            <div style="font-family:'Montserrat', Arial, sans-serif; font-size: 14px; background-color: #ffffff;padding: 0px 28px; text-align: left; color: #294563; border-radius: 15px;">									
                              <div style="font-weight: 400; font-size: 14px; margin-bottom: 24px;">Hi <span style="font-weight: 700; color: #284664;">Anna!</span></div>
                              <p style="font-size: 14px; margin-bottom: 20px;">We regret to inform you that the payment of your referral commission invoice has been rejected.</p>
                              <table style="text-align: left; font-size: 14px;">
                                <tr>
                                  <td style="font-style: italic; padding: 2px 4px 2px 0;">Invoice No: </td>
                                  <td style="padding: 2px 0;"><strong style="color: #294563;">#203359</strong></td>
                                </tr>
                                <tr>
                                  <td style="font-style: italic; padding: 2px 4px 2px 0;">Issue Date: </td>
                                  <td style="padding: 2px 0;"><strong style="color: #294563;">2025/03/14</strong></td>
                                </tr>
                                <tr>
                                  <td style="font-style: italic; padding: 2px 4px 2px 0;">Total Amount: </td>
                                  <td style="padding: 2px 0;"><strong style="color: #294563;">11.50 USD</strong></td>
                                </tr>
                              </table>
                              <p style="font-size: 14px; margin: 2px 0 8px; font-style: italic;">Reject reason:</p>
                              <div style="border-radius: 20px; background: rgba(244, 224, 228, 0.30); padding: 16px; margin: 0 0 24px;">
                                Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.
                              </div>
                              <p style="font-size: 14px; margin-bottom: 20px;">If the issue persists or if you require assistance, please contact our support team at <a href="mailto:hi@ieltsonlinetests.com" style="color: #4CBDA7;">hi@ieltsonlinetests.com.</a> as soon as possible. We recommend resolving this within 7 days to avoid further delays.</p>
                              <p style="font-size: 14px; margin-bottom: 20px;">We apologize for any inconvenience this may cause.</p>
                              <p style="font-size: 14px; margin-bottom: 20px;">Sincerely,</p>
                              <p style="color: #294563; font-size: 14px; font-weight: bold;">The IOT Team</p>
                              <hr style="border: 1px solid #EAECEF; margin: 32px 0; border-bottom: none;">
                            </div>
                            <p style="font-size: 20px;color: #284664;font-family:'Montserrat', Arial, sans-serif;font-weight: bold;margin: 0px 0px 10px 0px;padding: 0px;text-align: center;line-height: 24px;letter-spacing: 0.3px;">Need Help?
                            </p>
                            <p style="font-size: 14px;color: #888888;font-family:'Nunito', Arial, sans-serif;margin: 0px 0px 35px 0px;padding: 0px 10px;text-align: center;line-height: 1.57;">If you need any support or have further enquiries, <br /> please checkout our <a href="" style="color: #284664; font-weight: bold;">FAQ</a> page or reply to this email.
                            </p>
                            <p style="font-size: 20px;color: #294563;font-family:'Montserrat', Arial, sans-serif;font-weight: 700;margin: 0px 0px 15px 0px;padding: 0px;text-align: center;line-height: 24px;">Stay Connected
                            </p>
                            <div style="text-align: center;">
                              <a href="#" style="display: inline-block;margin: 0px 10px">
                                <img alt="" src="@/assets/images/icons/twitter.png">
                              </a>
                              <a href="#" style="display: inline-block;margin: 0px 10px">
                                <img alt="" src="@/assets/images/icons/facebook.png">
                              </a>
                              <a href="#" style="display: inline-block;margin: 0px 10px">
                                <img alt="" src="@/assets/images/icons/weibo.png">
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr style="background-color:#fff">
                        <td style="padding:30px 30px;">
                          <div style="text-align: center;margin: 0px 0px 10px 0px;">
                            <a href="#" target="_blank" style="text-align: center;font-weight: normal;font-size: 14px;display: inline-block;font-family:'Nunito', Arial, sans-serif;color: #4a4a4a; text-decoration: underline; color: #294563;">
                              Terms
                            </a>
                            <span style="text-align: center;font-weight: normal;font-size: 14px;display: inline-block;font-family:'Montserrat', Arial, sans-serif;color: #4a4a4a;margin: 0px 5px;">|
                            </span>
                            <a href="#" target="_blank" style="text-align: center;font-weight: normal;font-size: 14px;display: inline-block;font-family:'Nunito', Arial, sans-serif;color: #4a4a4a; text-decoration: underline; color: #294563;">
                              Privacy Policy
                            </a>
                            <span style="text-align: center;font-weight: normal;font-size: 14px;display: inline-block;font-family:'Montserrat', Arial, sans-serif;color: #4a4a4a;margin: 0px 5px;">|
                            </span>
                            <a href="#" target="_blank" style="text-align: center;font-weight: normal;font-size: 14px;display: inline-block;font-family:'Nunito', Arial, sans-serif;color: #4a4a4a; text-decoration: underline; color: #294563;">
                              About
                            </a>
                          </div>
                          <div style="text-align: center;margin: 30px 0px 30px 0px; height: 1px;background-color: #d5d5d5"></div>
                          <div style="text-align: center;margin: 0px auto 5px auto; max-width: 500px;">
                            <p style="text-align: center;font-weight: 400;font-size: 11px;display: inline-block;font-family:'Montserrat', Arial, sans-serif;color: #a0a0a0;margin: 0px;max-width: 85%;line-height: 21px;">
                              IOT are trademarks or registered trademarks of InterGreat Education Group, in the UK, Vietnam, China and/or other countries.
                            </p>
                          </div>
                          <div style="text-align: center;margin: 0px auto 0px auto; max-width: 500px;">
                            <p style="text-align: center;font-weight: 400;font-size: 11px;display: inline-block;font-family:'Montserrat', Arial, sans-serif;color: #a0a0a0;margin: 0px;">
                              All other trademarks referenced herein are the properties of their respective owners.
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td height="20px"></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { RouterLink } from 'vue-router';
  import axios from 'axios';
  import {useAuthStore} from "@/store.js";
  const authStore = useAuthStore();

  // Define reactive state for notifications
  const notifications = ref([]);

  // Fetch notifications data using Axios when the component is mounted
  onMounted(async () => {
    try {
      // const endpoint = authStore.config?.endpoint || {};
      // let response = await axios.get(endpoint.notifications);
      // notifications.value = response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  });
</script>

<style lang="scss">
  .notification-item__name {
    strong {
      display: block;
    }
  }
</style>

<style lang="scss" scoped>
  @import "@/assets/mixins.scss";
  .notification-board {
    &__head {
      display: flex;
      padding: 16px 40px;
      justify-content: center;
      align-items: center;
    }
    &__title {
      font-size: 20px;
      font-weight: 700;
      color: $primary-500;
    }
    &__item-title {
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      margin: 2rem auto;
      color: $primary-500;
    }
    &__contents {
      border-radius: 1.25rem;
      background: #FFF;
      box-shadow: 0px 4px 30px 0px rgba(41, 69, 99, 0.05);
    }
    &__body {
      display: grid;
      grid-template-columns: 0.5fr 1fr;
    }
    &__view-details {
      height: 100%;
      padding: 20px;
      background: rgba(234, 236, 239, 0.30);
    }
  }
  .notification-item {
    padding: 8px 30px 8px 20px;
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
    &__body {
      display: flex;
      gap: 8px;
    }
    &__name {
      font-size: 14px;
      font-weight: 700;
      font-family: $font-family-heading;
      strong {
        font-size: 14px;
        display: flex;
        font-weight: bold;
      }
    }
    &__time {
      color: var(--Text-Body-3, #9A9A9A);
      display: inline-flex;
      align-self: flex-end;
      font-size: 12px;
      font-style: italic;
      font-weight: 400;
    }
    &__icon {
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
    &__name {
      font-size: 14px;
      font-weight: bold;
      color: $primary-500;
    }
    &__cap {
      color: var(--Text-Body-3, #9A9A9A);
      font-size: 12px;
      font-weight: 400;
    }
  }
</style>