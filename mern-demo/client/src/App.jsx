import { useState, useEffect } from 'react';
import './App.css';

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

  const messageClass = msg.startsWith('✅') || msg.startsWith('🗑️')
    ? 'message success'
    : msg.startsWith('❌')
      ? 'message error'
      : msg.startsWith('Đang')
        ? 'message info'
        : '';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Student Portal</p>
            <h1>Quản lý sinh viên</h1>
          </div>
        </div>

        <div className="summary-card">
          <span>Tổng số lượng</span>
          <strong>{students.length}</strong>
          <small>Học viên</small>
        </div>

        <div className="status-box">
          <div className="status-header">
            <span className="status-dot" />
            <span>Backend Status</span>
          </div>
          <p>{msg || 'Sẵn sàng đồng bộ dữ liệu'}</p>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow muted">Dashboard</p>
            <h2>{editingId ? 'Cập nhật sinh viên' : 'Thêm sinh viên mới'}</h2>
          </div>
          <button type="button" className="chip-button">
            {students.length} records
          </button>
        </header>

        <section className="card form-card">
          <div className="section-title">
            <h3>Thông tin học viên</h3>
          </div>

          <form onSubmit={handleSubmit} className="student-form">
            <div className="input-row">
              <label>
                <span>Họ và tên</span>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="input-row two-col">
              <label>
                <span>Mã sinh viên</span>
                <input
                  type="text"
                  placeholder="SV001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  placeholder="student@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="action-row">
              <button type="submit" className="primary-btn">
                {editingId ? 'Lưu cập nhật' : 'Thêm ngay'}
              </button>

              {editingId && (
                <button type="button" onClick={resetForm} className="secondary-btn">
                  Hủy sửa
                </button>
              )}
            </div>
          </form>

          {msg && <p className={messageClass}>{msg}</p>}
        </section>

        <section className="card table-card">
          <div className="section-title">
            <h3>Danh sách sinh viên</h3>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Mã SV</th>
                  <th>Email</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((st) => (
                    <tr key={st._id}>
                      <td>{st.fullName}</td>
                      <td>{st.studentId}</td>
                      <td>{st.email}</td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="edit-btn" onClick={() => handleEdit(st)}>
                            Sửa
                          </button>
                          <button type="button" className="delete-btn" onClick={() => handleDelete(st._id)}>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      Chưa có sinh viên nào được thêm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
