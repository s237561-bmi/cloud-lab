const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ==========================================
// 1. CẤU HÌNH MIDDLEWARE & CORS PRODUCTION
// ==========================================
// Đọc URL Frontend từ biến môi trường CLIENT_URL trên Render
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (như mobile app/curl) hoặc nằm trong danh sách allowedOrigins hoặc trong môi trường dev
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true); // Đảm bảo luôn cấp phép cho Frontend Render
    }
  },
  credentials: true
}));

app.use(express.json());

// ==========================================
// 2. KẾT NỐI DATABASE MONGODB ATLAS
// ==========================================
// Ưu tiên đọc từ MONGODB_URI trong biến môi trường, nếu không có sẽ dùng chuỗi mặc định
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:S237561@cluster0.akzuynk.mongodb.net/quanlysinhvien?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB Atlas thành công!'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB Atlas:', err));

// ==========================================
// 3. DEFINITION SCHEMA & MODEL SINH VIÊN
// ==========================================
// Schema Sinh Viên (Hỗ trợ linh hoạt cả name/fullName và mssv/studentId)
const studentSchema = new mongoose.Schema({
  fullName: { type: String },
  name: { type: String },
  studentId: { type: String },
  mssv: { type: String },
  email: { type: String, required: true }
}, { timestamps: true });

// Tự động đồng bộ dữ liệu trước khi lưu vào Database
studentSchema.pre('save', function(next) {
  if (!this.fullName && this.name) this.fullName = this.name;
  if (!this.name && this.fullName) this.name = this.fullName;
  if (!this.studentId && this.mssv) this.studentId = this.mssv;
  if (!this.mssv && this.studentId) this.mssv = this.studentId;
  next();
});

const Student = mongoose.model('Student', studentSchema);
// ==========================================
// 4. API ROUTES (CRUD OPERATIONS)
// ==========================================

// Route kiểm tra trạng thái Backend
app.get('/', (req, res) => {
  res.send('🚀 MERN Backend Service is running live!');
});

// 1. Route lấy danh sách sinh viên (GET)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy dữ liệu', error: error.message });
  }
});

// 2. Route thêm sinh viên mới (POST)
app.post('/api/students', async (req, res) => {
  try {
    const { fullName, name, studentId, mssv, email } = req.body;

    const newStudent = new Student({
      fullName: fullName || name,
      studentId: studentId || mssv,
      email: email
    });

    await newStudent.save();
    res.status(201).json({ message: 'Thêm thành công!', data: newStudent });
  } catch (error) {
    console.error('Lỗi lưu MongoDB:', error);
    res.status(500).json({ message: 'Lỗi Database', error: error.message });
  }
});

// 3. Route cập nhật sinh viên theo ID (PUT)
app.put('/api/students/:id', async (req, res) => {
  try {
    const { fullName, studentId, email } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { fullName, studentId, email },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Cập nhật thành công!', data: updatedStudent });
  } catch (error) {
    console.error('Lỗi cập nhật MongoDB:', error);
    res.status(500).json({ message: 'Lỗi cập nhật Database', error: error.message });
  }
});

// 4. Route xóa sinh viên theo ID (DELETE)
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa sinh viên thành công!' });
  } catch (error) {
    console.error('Lỗi xóa MongoDB:', error);
    res.status(500).json({ message: 'Lỗi xóa sinh viên!', error: error.message });
  }
});

// ==========================================
// 5. KHỞI CHẠY SERVER
// ==========================================
// Đọc cổng PORT từ Render (mặc định Render cấp port tự động, local dùng 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
});
