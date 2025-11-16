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

// Các endpoint mock khác
server.get('/mock-api/:file', (req, res) => {
  try {
    const data = readDataFile(req.params.file);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});