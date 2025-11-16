var drupalSettings = {
  "path": {
    "baseUrl": "/",
    "pathPrefix": "",
    "isFront": false,
    "currentLanguage": "en"
  },
  "user": {
    "uid": "1589",
    "name": "testuser",
    "email": "testuser@gmail.com",
    "fullName": "Test User",
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
    blockhome: "http://localhost:3000/mock-api/blockhome.json"
  }
}