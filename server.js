import jsonServer from 'json-server';
import * as path from 'node:path';
import * as fs from 'node:fs';
import dayjs from 'dayjs';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const readDataFile = (fileName) => {
  const dataPath = path.resolve(path.join('data', fileName));
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Mock user data
let userData = {
  fullName: 'Thai Do',
  uid: '1589',
  email: 'thai.d2@intergreat.com',
  phone: '0912345678',
  dialCode: '+84',
  avatar: '/src/assets/images/avatars/avatar-student-1.jpg',
};

// Endpoint kiểm tra email tồn tại
server.post('/api/check-email', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }
  const validEmail = 'thai.d2@intergreat.com';
  if (email === validEmail) {
    return res.json({ success: true, exists: true });
  }
  return res.json({ success: true, exists: false });
});

// Endpoint kiểm tra số điện thoại tồn tại
server.post('/api/check-phone', (req, res) => {
  const { phone, dialCode } = req.body;
  console.log('Received check-phone:', { phone, dialCode });
  if (!phone || !dialCode) {
    return res.status(400).json({ success: false, error: 'Invalid phone number or dial code' });
  }
  const validPhones = ['0912345678', '0123456789', '999999999', '666666666']; // Danh sách số hợp lệ
  const validDialCode = '+84';
  const normalizedPhone = phone.replace(/\D/g, '');
  if (validPhones.includes(normalizedPhone) && dialCode === validDialCode) {
    return res.json({ success: true, exists: true });
  }
  return res.json({ success: true, exists: false });
});

// Endpoint mô phỏng API Drupal để lấy item mới dựa trên mã code
server.post('/mock-api/validate-code', (req, res) => {
  const { code } = req.body;

  // Kiểm tra mã code hợp lệ (giả sử chỉ TEST123 là hợp lệ)
  if (!code || code !== 'TEST123') {
    return res.status(400).json({ success: false, error: 'Invalid exam code' });
  }

  // Dữ liệu item mới (mô phỏng nội dung của my_test-data-2.json và collection-data-2.json)
  const newItem = {
    id: Date.now(), // ID duy nhất
    title: `IELTS Test ${code}`,
    caption: `Code: ${code}`,
    code,
    status: 'purchased',
    buttonText: 'TAKE TEST',
    urlTest: `/test/${code}`,
    type: 'academic',
  };

  // Trả về dữ liệu item mới
  res.json({
    success: true,
    data: {
      my_test: { data: [newItem] },
      collections: { data: [newItem] },
    },
  });
});

// Endpoint gửi yêu cầu tư vấn
server.post('/mock-api/consultation', (req, res) => {
  const { userContactName, userContactPhone, userContactEmail } = req.body;
  console.log('Received consultation request:', req.body);
  // Giả lập xử lý yêu cầu (thay bằng logic thực tế, ví dụ: lưu vào DB)
  if (userContactName && userContactPhone) {
    res.json({ success: true, message: 'Consultation request received' });
  } else {
    res.status(400).json({ success: false, error: 'Missing required fields' });
  }
});

// Endpoint cập nhật profile (user name, student ID)
server.put('/api/user/profile', (req, res) => {
  const { fullName, uid } = req.body;
  if (fullName) userData.fullName = fullName;
  if (uid) userData.uid = uid;
  res.json({ success: true, data: userData });
});

// Endpoint upload avatar
server.post('/api/user/avatar', (req, res) => {
  // Giả lập xử lý file upload
  const avatarUrl = '/src/assets/images/avatars/new-avatar.jpg'; // Thay bằng logic lưu file thực tế
  userData.avatar = avatarUrl;
  res.json({ success: true, avatarUrl });
});

// Endpoint gửi OTP
server.post('/api/otp/send', (req, res) => {
  const { identifier, type } = req.body;
  console.log(`Sending OTP to ${type}: ${identifier}`);
  res.json({ success: true });
});

// Endpoint xác thực OTP
server.post('/api/otp/verify', (req, res) => {
  const { identifier, otp, type } = req.body;
  // Giả lập kiểm tra OTP (thay bằng logic thực tế)
  if (otp === '123456') {
    res.json({ success: true });
  } else {
    res.json({ success: false, error: 'Invalid OTP' });
  }
});

// Endpoint cập nhật email
server.put('/api/user/email', (req, res) => {
  const { email, otp } = req.body;
  // Giả lập kiểm tra OTP
  if (otp === '123456') {
    userData.email = email;
    res.json({ success: true, data: userData });
  } else {
    res.status(400).json({ success: false, error: 'Invalid OTP' });
  }
});

// Endpoint cập nhật phone
server.put('/api/user/phone', (req, res) => {
  const { phone, dialCode, otp } = req.body;
  // Giả lập kiểm tra OTP
  if (otp === '123456') {
    userData.phone = phone;
    userData.dialCode = dialCode;
    res.json({ success: true, data: userData });
  } else {
    res.status(400).json({ success: false, error: 'Invalid OTP' });
  }
});

// Endpoint đổi mật khẩu
server.put('/api/user/password', (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  if (newPassword === confirmPassword) {
    // Giả lập lưu mật khẩu
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Passwords do not match' });
  }
});

// Các endpoint mock khác
server.get('/mock-api/:file', (req, res) => {
  try {
    const data = readDataFile(req.params.file);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint cho lịch sử bài kiểm tra với phân trang và lọc
server.get('/api/my-test-history', (req, res) => {
  try {
    const data = readDataFile('my-test-history.json');
    let result = [...data.data];

    // Lấy tham số từ query
    const results = parseInt(req.query.results) || 10;
    const page = parseInt(req.query.page) || 1;
    const minScore = req.query.minScore ? parseFloat(req.query.minScore) : null;
    const maxScore = req.query.maxScore ? parseFloat(req.query.maxScore) : null;
    const status = req.query.status || null;
    const testName = req.query.testName?.trim() || null;
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;

    // Áp dụng các bộ lọc
    if (minScore !== null) {
      result = result.filter(item => parseFloat(item.score) >= minScore);
    }
    if (maxScore !== null) {
      result = result.filter(item => parseFloat(item.score) <= maxScore);
    }
    if (status) {
      result = result.filter(item => item.status === status);
      console.log(`Filtered by status "${status}":`, result);
    }
    if (testName) {
      result = result.filter(item => item.testname.toLowerCase().includes(testName.toLowerCase()));
    }
    if (startDate && endDate) {
      result = result.filter(item => {
        const testDate = dayjs(item.testdate);
        return (
          testDate.isValid() &&
          testDate.isAfter(dayjs(startDate).startOf('day')) &&
          testDate.isBefore(dayjs(endDate).endOf('day'))
        );
      });
    }

    // Phân trang
    const start = (page - 1) * results;
    const end = start + results;
    const paginatedData = result.slice(start, end);
    const total = result.length;

    console.log(`Returning data: page=${page}, results=${results}, total=${total}, data=`, paginatedData);

    res.json({
      success: true,
      data: paginatedData,
      total: total,
    });
  } catch (error) {
    console.error('Error fetching test history:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

server.post('/mock-api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Giả lập kiểm tra tài khoản
  const validEmail = 'thai.d2@intergreat.com'; // Email hợp lệ
  const validPassword = 'password123'; // Mật khẩu hợp lệ

  if (email === validEmail && password === validPassword) {
    const authUser = readDataFile('auth-user.json');
    res.json(authUser);
  } else {
    res.status(404).json({ success: false, error: 'Account does not exist' });
  }
});

server.post('/mock-api/logout', (req, res) => {
  const anoUser = readDataFile('ano-user.json');
  res.json(anoUser);
});

server.post('/verify-otp', (req, res) => {
  console.log('Received POST /verify-otp with body:', req.body);
  res.json({ success: true });
});

// Endpoint để lấy danh sách URL hình ảnh QR code
server.get('/api/qr-images', (req, res) => {
  const qrImages = {
    zalo: '/public/images/misc/zalo-qr.png',
    whatsapp: '/public/images/misc/whatsapp-qr.png',
    wechat: '/public/images/misc/wechat-qr.png',
  };
  res.json({ success: true, data: qrImages });
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});