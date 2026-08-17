import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  
  // Câu 48: Tạo State lưu dữ liệu Form (MSSV, Họ tên, Email)
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  // Câu 47: Lấy danh sách sinh viên từ API
  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý khi nhập dữ liệu vào ô input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Câu 49: Gửi dữ liệu từ Form đến API POST /api/students
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Reset form và tải lại danh sách sinh viên
        setFormData({ studentId: '', name: '', email: '' });
        fetchStudents();
      } else {
        const errData = await response.json();
        alert('Lỗi: ' + (errData.error || 'Không thể thêm sinh viên'));
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px' }}>
      <h2>Quản Lý Sinh Viên</h2>

      {/* Câu 48: Form nhập thông tin */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          name="studentId"
          placeholder="Mã sinh viên (VD: SV003)"
          value={formData.studentId}
          onChange={handleChange}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Thêm sinh viên
        </button>
      </form>

      {/* Danh sách sinh viên */}
      <h3>Danh Sách Sinh Viên</h3>
      <ul>
        {students.map((student) => (
          <li key={student._id} style={{ marginBottom: '5px' }}>
            <strong>{student.studentId}</strong> - {student.name} ({student.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;