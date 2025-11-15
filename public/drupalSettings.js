var drupalSettings = {
  "path": {
    "baseUrl": "/",
    "pathPrefix": "",
    "isFront": false,
    "currentLanguage": "en"
  },
  "user": {
    "uid": "1589",
    "name": "thai.d2",
    "email": "thai.d2@intergreat.com",
    "fullName": "Thai Do",
    "phone": "0912345678",
    "dialCode": "+84",
    "wallet": {
      "balance": 90,
      "currency": "USD"
    },
    "roles": [
      "authenticated",
      "administrator"
    ],
    "avatar": "/src/assets/images/avatars/avatar-student-1.jpg",
    "agent": "",
    "notifications": {
      "unread": 6,
      "total": 10
    }
  },
  "languages": {
    "en": {
      "name": "English",
      "direction": "ltr",
      "langCode": "en"
    },
    "zh-hans": {
      "name": "Chinese, Simplified",
      "direction": "ltr",
      "langCode": "zh-hans"
    },
    "vi": {
      "name": "Vietnamese",
      "direction": "ltr",
      "langCode": "vi"
    }
  },
  "endpoint": {
    notifications: "http://localhost:3000/mock-api/notifications.json",
    collections: "http://localhost:3000/mock-api/all-collections-data.json",
    my_test: "http://localhost:3000/mock-api/my_test-data.json",
    my_test_history: "http://localhost:3000/api/my-test-history",
    transaction_history: "http://localhost:3000/mock-api/transaction-history.json",
    // Authentication endpoints
    login: 'http://localhost:3000/mock-api/login',
    logout: 'http://localhost:3000/mock-api/logout',
    register: '',
    consultation: 'http://localhost:3000/mock-api/consultation',
    validateCode: 'http://localhost:3000/mock-api/validate-code',
    checkEmail: 'http://localhost:3000/api/check-email',
    qrImages: 'http://localhost:3000/api/qr-images',
  }
}