const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Câu 35: Khai báo Model Student
const Student = require('./models/Student');

const app = express();
app.use(express.json());

// Kết nối MongoDB Atlas (Câu 34)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Câu 22: Route thử nghiệm cho trang chủ
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Câu 36: GET /api/students - Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Câu 37: POST /api/students - Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Câu 38: PUT /api/students/:id - Cập nhật sinh viên theo ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Câu 39: DELETE /api/students/:id - Xóa sinh viên theo ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa sinh viên thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server đang chạy tại port ${PORT}`));