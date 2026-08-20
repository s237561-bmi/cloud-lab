const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Chuỗi kết nối trực tiếp đến database quanlysinhvien
const MONGO_URI = 'mongodb+srv://admin:S237561@cluster0.akzuynk.mongodb.net/quanlysinhvien?retryWrites=true&w=majority';

// Kết nối MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB Atlas thành công!'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB Atlas:', err));

// Schema Sinh Viên
const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// 1. Route lấy danh sách sinh viên (GET)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy dữ liệu', error: error.message });
  }
});

// 2. Route thêm sinh viên (POST)
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
      { new: true } // Trả về document sau khi cập nhật
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
// Chạy Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});