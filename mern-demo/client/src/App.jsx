import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  const API = '/api/students';

  const loadData = () => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStudents(data);
        else if (data.students) setStudents(data.students);
        else if (data.data) setStudents(data.data);
      })
      .catch(() => setMsg('❌ Chưa kết nối được Backend!'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg('Đang xử lý...');

    if (editingId) {
      fetch(`${API}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, studentId, email }),
      })
        .then((res) => res.json())
        .then(() => {
          setMsg('✅ Cập nhật sinh viên thành công!');
          resetForm();
          loadData();
        })
        .catch(() => setMsg('❌ Lỗi khi cập nhật!'));
    } else {
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, studentId, email }),
      })
        .then((res) => res.json())
        .then(() => {
          setMsg('✅ Thêm sinh viên thành công!');
          resetForm();
          loadData();
        })
        .catch(() => setMsg('❌ Lỗi khi thêm!'));
    }
  };

  // Hàm xử lý Xóa sinh viên
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
      fetch(`${API}/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(() => {
          setMsg('🗑️ Đã xóa sinh viên thành công!');
          loadData();
        })
        .catch(() => setMsg('❌ Lỗi khi xóa sinh viên!'));
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setFullName(student.fullName);
    setStudentId(student.studentId);
    setEmail(student.email);
  };

  const resetForm = () => {
    setEditingId(null);
    setFullName('');
    setStudentId('');
    setEmail('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', color: '#fff' }}>
      <h2>{editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên'}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Mã sinh viên"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: editingId ? '#007bff' : 'green', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {editingId ? 'Lưu Cập Nhật' : 'Thêm Ngay'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} style={{ padding: '5px', backgroundColor: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Hủy Sửa
          </button>
        )}
      </form>

      <p>{msg}</p>

      <h3>Danh Sách Đã Thêm ({students.length})</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', color: '#fff', borderColor: '#444' }}>
        <thead>
          <tr>
            <th>Họ Tên</th>
            <th>Mã SV</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((st) => (
            <tr key={st._id}>
              <td>{st.fullName}</td>
              <td>{st.studentId}</td>
              <td>{st.email}</td>
              <td style={{ display: 'flex', gap: '5px' }}>
                <button type="button" onClick={() => handleEdit(st)} style={{ backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', cursor: 'pointer', color: '#000', fontWeight: 'bold' }}>
                  Sửa
                </button>
                <button type="button" onClick={() => handleDelete(st._id)} style={{ backgroundColor: '#dc3545', border: 'none', padding: '5px 10px', cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;