import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem('ums_token');
const getUser = () => JSON.parse(localStorage.getItem('ums_user') || 'null');

// ============================================
// COLOR PALETTE & DESIGN SYSTEM
// ============================================
const colors = {
  primary: "#1a1f36",
  accent: "#4f6ef7",
  accentLight: "#7b93fa",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  bg: "#f0f4ff",
  card: "#ffffff",
  border: "#e2e8f0",
  textDark: "#1a1f36",
  textMid: "#4a5568",
  textLight: "#94a3b8",
};

// ============================================
// UTILITY HOOKS
// ============================================
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(url);
      const json = await res.json();
      setData(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [url]);
  return { data, loading, error, refetch: fetchData };
}

// ============================================
// SMALL COMPONENTS
// ============================================

function Badge({ text, type = "default" }) {
  const styles = {
    default: { background: "#e2e8f0", color: "#4a5568" },
    success: { background: "#d1fae5", color: "#065f46" },
    warning: { background: "#fef3c7", color: "#92400e" },
    danger: { background: "#fee2e2", color: "#991b1b" },
    info: { background: "#dbeafe", color: "#1e40af" },
  };
  const s = styles[type] || styles.default;
  return (
    <span style={{
      ...s,
      padding: "2px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
    }}>{text}</span>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: colors.card,
      borderRadius: 16,
      padding: "24px 28px",
      boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
      display: "flex",
      alignItems: "center",
      gap: 18,
      flex: 1,
      minWidth: 180,
    }}>
      <div style={{
        width: 54,
        height: 54,
        borderRadius: 14,
        background: color + "20",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: colors.textDark }}>{value}</div>
        <div style={{ fontSize: 13, color: colors.textLight, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
      <div style={{
        width: 36,
        height: 36,
        border: `4px solid ${colors.border}`,
        borderTop: `4px solid ${colors.accent}`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(26,31,54,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20,
    }}>
      <div style={{
        background: colors.card,
        borderRadius: 18,
        padding: 32,
        width: "100%",
        maxWidth: 520,
        maxHeight: "85vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(79,110,247,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.textDark }}>{title}</h3>
          <button onClick={onClose} style={{
            background: colors.bg, border: "none", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", fontSize: 18, color: colors.textMid,
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMid, display: "block", marginBottom: 6 }}>{label}</label>}
      <input {...props} style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: `1.5px solid ${colors.border}`,
        fontSize: 14,
        color: colors.textDark,
        background: colors.bg,
        outline: "none",
        boxSizing: "border-box",
        ...props.style,
      }} />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMid, display: "block", marginBottom: 6 }}>{label}</label>}
      <select {...props} style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: `1.5px solid ${colors.border}`,
        fontSize: 14,
        color: colors.textDark,
        background: colors.bg,
        outline: "none",
        boxSizing: "border-box",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style = {} }) {
  const variants = {
    primary: { background: colors.accent, color: "#fff" },
    danger: { background: colors.danger, color: "#fff" },
    success: { background: colors.success, color: "#fff" },
    ghost: { background: colors.bg, color: colors.textMid, border: `1.5px solid ${colors.border}` },
  };
  return (
    <button onClick={onClick} style={{
      ...variants[variant],
      padding: "9px 18px",
      borderRadius: 10,
      border: "none",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "opacity 0.2s",
      ...style,
    }}
      onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
      onMouseOut={e => e.currentTarget.style.opacity = "1"}
    >
      {children}
    </button>
  );
}

// ============================================
// DASHBOARD
// ============================================
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/dashboard/stats`)
      .then(r => r.json())
      .then(d => { setStats(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textDark, marginBottom: 8 }}>Dashboard</h2>
      <p style={{ color: colors.textLight, marginBottom: 28 }}>University Management System — Overview</p>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
        <StatCard icon="🎓" label="Active Students" value={stats?.total_students ?? "—"} color={colors.accent} />
        <StatCard icon="📚" label="Total Courses" value={stats?.total_courses ?? "—"} color={colors.success} />
        <StatCard icon="🏛️" label="Departments" value={stats?.total_departments ?? "—"} color={colors.warning} />
        <StatCard icon="📋" label="Enrollments" value={stats?.total_enrollments ?? "—"} color={colors.danger} />
      </div>

      {stats?.program_stats && (
        <div style={{ background: colors.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 16px rgba(79,110,247,0.08)" }}>
          <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700 }}>Students by Program</h3>
          {stats.program_stats.map((p, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.textMid }}>{p.program_name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: colors.accent }}>{p.student_count}</span>
              </div>
              <div style={{ background: colors.bg, borderRadius: 8, height: 8 }}>
                <div style={{
                  width: `${Math.min(100, (p.student_count / (stats.total_students || 1)) * 100)}%`,
                  background: colors.accent,
                  height: "100%",
                  borderRadius: 8,
                  transition: "width 0.8s ease",
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// STUDENTS MODULE
// ============================================
function Students() {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({
    reg_no: "", first_name: "", last_name: "", email: "",
    phone: "", gender: "Male", date_of_birth: "",
    program_id: "", admission_date: "", current_semester: 1,
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/students${search ? `?search=${search}` : ""}`);
      const d = await res.json();
      setStudents(d.data || []);
    } catch { }
    setLoading(false);
  };

  const fetchPrograms = async () => {
    const res = await fetch(`${API}/departments`);
    const d = await res.json();
    setPrograms(d.data || []);
  };

  useEffect(() => { fetchStudents(); fetchPrograms(); }, []);
  useEffect(() => { const t = setTimeout(fetchStudents, 400); return () => clearTimeout(t); }, [search]);

  const openAdd = () => {
    setEditStudent(null);
    setForm({ reg_no: "", first_name: "", last_name: "", email: "", phone: "", gender: "Male", date_of_birth: "", program_id: "", admission_date: "", current_semester: 1 });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditStudent(s);
    setForm({ ...s });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const method = editStudent ? "PUT" : "POST";
    const url = editStudent ? `${API}/students/${editStudent.student_id}` : `${API}/students`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    await fetch(`${API}/students/${id}`, { method: "DELETE" });
    fetchStudents();
  };

  const statusColor = { Active: "success", Inactive: "warning", Graduated: "info", Expelled: "danger" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textDark, margin: 0 }}>Students</h2>
          <p style={{ color: colors.textLight, margin: "4px 0 0" }}>{students.length} students found</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="🔍 Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${colors.border}`,
              fontSize: 13, width: 220, background: colors.bg, outline: "none",
            }}
          />
          <Btn onClick={openAdd}>+ Add Student</Btn>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ background: colors.card, borderRadius: 16, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: colors.bg }}>
                {["Reg No", "Name", "Program", "Semester", "CGPA", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 12, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: colors.textLight }}>No students found</td></tr>
              ) : students.map((s, i) => (
                <tr key={s.student_id} style={{ borderTop: `1px solid ${colors.border}`, background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                  <td style={{ padding: "14px 18px", fontSize: 13, fontWeight: 700, color: colors.accent }}>{s.reg_no}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.textDark }}>{s.full_name}</div>
                    <div style={{ fontSize: 12, color: colors.textLight }}>{s.email}</div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.program_name}</div>
                    <div style={{ fontSize: 12, color: colors.textLight }}>{s.dept_name}</div>
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: 13, textAlign: "center" }}>{s.current_semester}</td>
                  <td style={{ padding: "14px 18px", fontSize: 13, fontWeight: 700, color: parseFloat(s.cgpa) >= 3.0 ? colors.success : colors.warning }}>{s.cgpa}</td>
                  <td style={{ padding: "14px 18px" }}><Badge text={s.status} type={statusColor[s.status] || "default"} /></td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn variant="ghost" onClick={() => openEdit(s)} style={{ padding: "6px 12px", fontSize: 12 }}>✏️ Edit</Btn>
                      <Btn variant="danger" onClick={() => handleDelete(s.student_id)} style={{ padding: "6px 12px", fontSize: 12 }}>🗑️</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title={editStudent ? "Edit Student" : "Add New Student"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Registration No" value={form.reg_no} onChange={e => setForm({ ...form, reg_no: e.target.value })} placeholder="BSCS-2024-001" disabled={!!editStudent} />
            <Select label="Gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
              options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} />
            <Input label="First Name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="Ali" />
            <Input label="Last Name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Raza" />
            <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ali@student.edu" type="email" />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0300-0000000" />
            <Input label="Date of Birth" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} type="date" />
            <Input label="Admission Date" value={form.admission_date} onChange={e => setForm({ ...form, admission_date: e.target.value })} type="date" />
            <Input label="Current Semester" value={form.current_semester} onChange={e => setForm({ ...form, current_semester: e.target.value })} type="number" min={1} max={8} />
            <Select label="Program" value={form.program_id} onChange={e => setForm({ ...form, program_id: e.target.value })}
              options={[{ value: "", label: "Select Program" }, { value: "1", label: "BSCS" }, { value: "2", label: "BBA" }, { value: "3", label: "BSEE" }]} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSubmit}>{editStudent ? "Update Student" : "Add Student"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// COURSES MODULE
// ============================================
function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ course_code: "", course_name: "", credit_hours: 3, course_type: "Theory", dept_id: 1, semester_level: 1, description: "" });

  const fetchCourses = async () => {
    setLoading(true);
    const res = await fetch(`${API}/courses`);
    const d = await res.json();
    setCourses(d.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async () => {
    await fetch(`${API}/courses`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    await fetch(`${API}/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  };

  const typeColor = { Theory: "info", Lab: "success", "Theory+Lab": "warning" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textDark, margin: 0 }}>Courses</h2>
          <p style={{ color: colors.textLight, margin: "4px 0 0" }}>{courses.length} courses available</p>
        </div>
        <Btn onClick={() => setShowModal(true)}>+ Add Course</Btn>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {courses.map(c => (
            <div key={c.course_id} style={{
              background: colors.card, borderRadius: 14, padding: 22,
              boxShadow: "0 2px 12px rgba(79,110,247,0.07)",
              borderTop: `4px solid ${colors.accent}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: colors.accent }}>{c.course_code}</span>
                <Badge text={c.course_type} type={typeColor[c.course_type]} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.textDark, margin: "0 0 8px" }}>{c.course_name}</h3>
              <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 12 }}>{c.dept_name} • Semester {c.semester_level}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: colors.textMid }}>{c.credit_hours} Credit Hours</span>
                <Btn variant="danger" onClick={() => handleDelete(c.course_id)} style={{ padding: "5px 10px", fontSize: 12 }}>🗑️ Delete</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Add New Course" onClose={() => setShowModal(false)}>
          <Input label="Course Code" value={form.course_code} onChange={e => setForm({ ...form, course_code: e.target.value })} placeholder="CS301" />
          <Input label="Course Name" value={form.course_name} onChange={e => setForm({ ...form, course_name: e.target.value })} placeholder="Database Systems" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Credit Hours" value={form.credit_hours} onChange={e => setForm({ ...form, credit_hours: e.target.value })} type="number" min={1} max={4} />
            <Input label="Semester Level" value={form.semester_level} onChange={e => setForm({ ...form, semester_level: e.target.value })} type="number" min={1} max={8} />
            <Select label="Course Type" value={form.course_type} onChange={e => setForm({ ...form, course_type: e.target.value })}
              options={[{ value: "Theory", label: "Theory" }, { value: "Lab", label: "Lab" }, { value: "Theory+Lab", label: "Theory+Lab" }]} />
            <Select label="Department" value={form.dept_id} onChange={e => setForm({ ...form, dept_id: e.target.value })}
              options={[{ value: 1, label: "Computer Science" }, { value: 2, label: "Business Admin" }, { value: 3, label: "Electrical Eng" }, { value: 4, label: "Mathematics" }]} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSubmit}>Add Course</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// ENROLLMENTS MODULE
// ============================================
function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [marksModal, setMarksModal] = useState(null);
  const [form, setForm] = useState({ student_id: "", offering_id: "" });
  const [marks, setMarks] = useState({ midterm_marks: "", final_marks: "", assignment_marks: "" });

  const fetchEnrollments = async () => {
    setLoading(true);
    const res = await fetch(`${API}/enrollments`);
    const d = await res.json();
    setEnrollments(d.data || []);
    setLoading(false);
  };


  useEffect(() => { fetchEnrollments(); }, []);

  const handleEnroll = async () => {
    await fetch(`${API}/enrollments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false);
    fetchEnrollments();
  };

  const handleMarks = async () => {
    await fetch(`${API}/enrollments/${marksModal}/marks`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(marks) });
    setMarksModal(null);
    fetchEnrollments();
  };

  const handleDrop = async (id) => {
    if (!window.confirm("Drop this enrollment?")) return;
    await fetch(`${API}/enrollments/${id}/drop`, { method: "PUT" });
    fetchEnrollments();
  };

  const statusColor = { Enrolled: "success", Dropped: "danger", Completed: "info", Failed: "warning" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textDark, margin: 0 }}>Enrollments</h2>
          <p style={{ color: colors.textLight, margin: "4px 0 0" }}>{enrollments.length} enrollments</p>
        </div>
        <Btn onClick={() => setShowModal(true)}>+ Enroll Student</Btn>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ background: colors.card, borderRadius: 16, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: colors.bg }}>
                {["Student", "Course", "Teacher", "Marks", "Grade", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 12, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: colors.textLight }}>No enrollments found</td></tr>
              ) : enrollments.map((e, i) => (
                <tr key={e.enrollment_id} style={{ borderTop: `1px solid ${colors.border}`, background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{e.student_name}</div>
                    <div style={{ fontSize: 12, color: colors.textLight }}>{e.reg_no}</div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{e.course_name}</div>
                    <div style={{ fontSize: 12, color: colors.textLight }}>{e.course_code} • {e.credit_hours} CR</div>
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: 13 }}>{e.teacher_name}</td>
                  <td style={{ padding: "14px 18px", fontSize: 12 }}>
                    <div>Mid: {e.midterm_marks ?? "—"}</div>
                    <div>Final: {e.final_marks ?? "—"}</div>
                    <div>Asgn: {e.assignment_marks ?? "—"}</div>
                  </td>
                  <td style={{ padding: "14px 18px", fontWeight: 800, fontSize: 16, color: e.grade === "F" ? colors.danger : colors.success }}>{e.grade ?? "—"}</td>
                  <td style={{ padding: "14px 18px" }}><Badge text={e.status} type={statusColor[e.status]} /></td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Btn variant="ghost" onClick={() => { setMarksModal(e.enrollment_id); setMarks({ midterm_marks: e.midterm_marks || "", final_marks: e.final_marks || "", assignment_marks: e.assignment_marks || "" }); }} style={{ padding: "6px 10px", fontSize: 11 }}>📊 Marks</Btn>
                      {e.status === "Enrolled" && <Btn variant="danger" onClick={() => handleDrop(e.enrollment_id)} style={{ padding: "6px 10px", fontSize: 11 }}>Drop</Btn>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title="Enroll Student" onClose={() => setShowModal(false)}>
          <Input label="Student ID" value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} placeholder="e.g. 1" type="number" />
          <Input label="Course Offering ID" value={form.offering_id} onChange={e => setForm({ ...form, offering_id: e.target.value })} placeholder="e.g. 1" type="number" />
          <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 16 }}>💡 Use the Student ID and Course Offering ID from the database</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleEnroll}>Enroll</Btn>
          </div>
        </Modal>
      )}

      {marksModal && (
        <Modal title="Update Marks" onClose={() => setMarksModal(null)}>
          <Input label="Midterm Marks (out of 30)" value={marks.midterm_marks} onChange={e => setMarks({ ...marks, midterm_marks: e.target.value })} type="number" min={0} max={30} />
          <Input label="Final Marks (out of 50)" value={marks.final_marks} onChange={e => setMarks({ ...marks, final_marks: e.target.value })} type="number" min={0} max={50} />
          <Input label="Assignment Marks (out of 20)" value={marks.assignment_marks} onChange={e => setMarks({ ...marks, assignment_marks: e.target.value })} type="number" min={0} max={20} />
          <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 16 }}>Total = 100 marks. Grade will be calculated automatically.</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setMarksModal(null)}>Cancel</Btn>
            <Btn onClick={handleMarks}>Save & Calculate Grade</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
// ============================================
// TEACHERS MODULE
// ============================================
function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [showCoursesModal, setShowCoursesModal] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [form, setForm] = useState({
    emp_no: "", first_name: "", last_name: "", email: "",
    phone: "", qualification: "", designation: "Lecturer",
    dept_id: "1", joining_date: "", status: "Active"
  });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/teachers${search ? `?search=${search}` : ""}`);
      const d = await res.json();
      setTeachers(d.data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchTeachers(); }, []);
  useEffect(() => {
    const t = setTimeout(fetchTeachers, 400);
    return () => clearTimeout(t);
  }, [search]);

  const openAdd = () => {
    setEditTeacher(null);
    setForm({
      emp_no: "", first_name: "", last_name: "", email: "",
      phone: "", qualification: "", designation: "Lecturer",
      dept_id: "1", joining_date: "", status: "Active"
    });
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditTeacher(t);
    setForm({ ...t, dept_id: String(t.dept_id) });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const method = editTeacher ? "PUT" : "POST";
    const url = editTeacher ? `${API}/teachers/${editTeacher.teacher_id}` : `${API}/teachers`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const d = await res.json();
    if (d.success) {
      setShowModal(false);
      fetchTeachers();
    } else {
      alert(d.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Is teacher ko delete karna chahte hain?")) return;
    await fetch(`${API}/teachers/${id}`, { method: "DELETE" });
    fetchTeachers();
  };

  const viewCourses = async (teacher) => {
    setShowCoursesModal(teacher);
    const res = await fetch(`${API}/teachers/${teacher.teacher_id}/courses`);
    const d = await res.json();
    setTeacherCourses(d.data || []);
  };

  const designationColor = {
    "Professor": "danger",
    "Associate Professor": "warning",
    "Assistant Professor": "info",
    "Lecturer": "success"
  };

  const statusColor = { Active: "success", Inactive: "warning" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textDark, margin: 0 }}>Teachers</h2>
          <p style={{ color: colors.textLight, margin: "4px 0 0" }}>{teachers.length} faculty members</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="🔍 Search teachers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: "9px 16px", borderRadius: 10,
              border: `1.5px solid ${colors.border}`,
              fontSize: 13, width: 220, background: colors.bg, outline: "none",
            }}
          />
          <Btn onClick={openAdd}>+ Add Teacher</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Professor", color: "#ef4444" },
          { label: "Associate Professor", color: "#f59e0b" },
          { label: "Assistant Professor", color: "#3b82f6" },
          { label: "Lecturer", color: "#10b981" },
        ].map(d => (
          <div key={d.label} style={{
            background: colors.card, borderRadius: 12, padding: "14px 20px",
            boxShadow: "0 2px 10px rgba(79,110,247,0.07)",
            borderLeft: `4px solid ${d.color}`, flex: 1, minWidth: 150,
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: colors.textDark }}>
              {teachers.filter(t => t.designation === d.label).length}
            </div>
            <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>{d.label}</div>
          </div>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div style={{ background: colors.card, borderRadius: 16, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: colors.bg }}>
                {["Emp No", "Name", "Department", "Designation", "Qualification", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 12, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: colors.textLight }}>No teachers found</td></tr>
              ) : teachers.map((t, i) => (
                <tr key={t.teacher_id} style={{ borderTop: `1px solid ${colors.border}`, background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                  <td style={{ padding: "14px 18px", fontSize: 13, fontWeight: 700, color: colors.accent }}>{t.emp_no}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.textDark }}>{t.full_name}</div>
                    <div style={{ fontSize: 12, color: colors.textLight }}>{t.email}</div>
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: 13 }}>{t.dept_name}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <Badge text={t.designation} type={designationColor[t.designation] || "default"} />
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: 13, color: colors.textMid }}>{t.qualification}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <Badge text={t.status} type={statusColor[t.status]} />
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Btn variant="ghost" onClick={() => viewCourses(t)} style={{ padding: "6px 10px", fontSize: 11 }}>
                        📚 Courses ({t.total_courses_assigned})
                      </Btn>
                      <Btn variant="ghost" onClick={() => openEdit(t)} style={{ padding: "6px 10px", fontSize: 11 }}>✏️ Edit</Btn>
                      <Btn variant="danger" onClick={() => handleDelete(t.teacher_id)} style={{ padding: "6px 10px", fontSize: 11 }}>🗑️</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title={editTeacher ? "Edit Teacher" : "Add New Teacher"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Employee No" value={form.emp_no} onChange={e => setForm({ ...form, emp_no: e.target.value })} placeholder="EMP001" disabled={!!editTeacher} />
            <Input label="Joining Date" value={form.joining_date} onChange={e => setForm({ ...form, joining_date: e.target.value })} type="date" />
            <Input label="First Name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="Ahmad" />
            <Input label="Last Name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Hassan" />
            <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ahmad@university.edu" type="email" />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0300-0000000" />
            <Input label="Qualification" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} placeholder="PhD Computer Science" />
            <Select label="Designation" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })}
              options={[
                { value: "Lecturer", label: "Lecturer" },
                { value: "Assistant Professor", label: "Assistant Professor" },
                { value: "Associate Professor", label: "Associate Professor" },
                { value: "Professor", label: "Professor" },
              ]} />
            <Select label="Department" value={form.dept_id} onChange={e => setForm({ ...form, dept_id: e.target.value })}
              options={[
                { value: "1", label: "Computer Science" },
                { value: "2", label: "Business Administration" },
                { value: "3", label: "Electrical Engineering" },
                { value: "4", label: "Mathematics" },
              ]} />
            <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSubmit}>{editTeacher ? "Update Teacher" : "Add Teacher"}</Btn>
          </div>
        </Modal>
      )}

      {showCoursesModal && (
        <Modal title={`${showCoursesModal.full_name} — Assigned Courses`} onClose={() => { setShowCoursesModal(null); setTeacherCourses([]); }}>
          {teacherCourses.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: colors.textLight }}>Koi course assign nahi hai abhi</div>
          ) : (
            <div>
              {teacherCourses.map((c, i) => (
                <div key={i} style={{ background: colors.bg, borderRadius: 10, padding: "14px 16px", marginBottom: 10, borderLeft: `4px solid ${colors.accent}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: colors.textDark }}>{c.course_name}</div>
                      <div style={{ fontSize: 12, color: colors.textLight, marginTop: 3 }}>{c.course_code} • Section {c.section} • {c.credit_hours} CR</div>
                      <div style={{ fontSize: 12, color: colors.textLight }}>📅 {c.schedule} • 🚪 Room {c.room_no}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: colors.accent }}>{c.enrolled_count}/{c.max_capacity}</div>
                      <div style={{ fontSize: 11, color: colors.textLight }}>Students</div>
                      <div style={{ fontSize: 11, color: colors.textLight, marginTop: 2 }}>{c.semester_name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => { setShowCoursesModal(null); setTeacherCourses([]); }}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// FEE MANAGEMENT - FRONTEND COMPONENT
// App.js mein // SIDEBAR NAV se PEHLE paste karo
// ============================================

function Fees() {
  const [fees, setFees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [payModal, setPayModal] = useState(null);
  const [payMethod, setPayMethod] = useState("Cash");
  const [form, setForm] = useState({
    student_id: "", fee_type: "Tuition", amount: "",
    due_date: "", payment_method: "Cash", remarks: ""
  });

  const fetchFees = async () => {
    setLoading(true);
    try {
      const url = `${API}/fees${filterStatus ? `?status=${filterStatus}` : ""}`;
      const res = await fetch(url);
      const d = await res.json();
      setFees(d.data || []);
    } catch { }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/fees/stats/summary`);
      const d = await res.json();
      setStats(d.data);
    } catch { }
  };

  useEffect(() => { fetchFees(); fetchStats(); }, []);
  useEffect(() => { fetchFees(); }, [filterStatus]);

  const handleAdd = async () => {
    const res = await fetch(`${API}/fees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const d = await res.json();
    if (d.success) { setShowModal(false); fetchFees(); fetchStats(); }
    else alert(d.message);
  };

  const handlePay = async () => {
    const res = await fetch(`${API}/fees/${payModal}/pay`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_method: payMethod })
    });
    const d = await res.json();
    if (d.success) {
      alert(`✅ Fee paid! Receipt: ${d.receipt_no}`);
      setPayModal(null);
      fetchFees(); fetchStats();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fee record?")) return;
    await fetch(`${API}/fees/${id}`, { method: "DELETE" });
    fetchFees(); fetchStats();
  };

  const handleUpdateOverdue = async () => {
    const res = await fetch(`${API}/fees/update-overdue`, { method: "PUT" });
    const d = await res.json();
    alert(d.message);
    fetchFees(); fetchStats();
  };

  const statusColor = { Paid: "success", Pending: "warning", Overdue: "danger", Partial: "info" };

  const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textDark, margin: 0 }}>Fee Management</h2>
          <p style={{ color: colors.textLight, margin: "4px 0 0" }}>{fees.length} fee records</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn variant="ghost" onClick={handleUpdateOverdue} style={{ fontSize: 12 }}>⚠️ Update Overdue</Btn>
          <Btn onClick={() => setShowModal(true)}>+ Add Fee</Btn>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Total Collected", value: fmt(stats.total_collected), color: colors.success, icon: "✅" },
            { label: "Pending",         value: fmt(stats.total_pending),   color: colors.warning, icon: "⏳" },
            { label: "Overdue",         value: fmt(stats.total_overdue),   color: colors.danger,  icon: "❌" },
            { label: "Total Records",   value: stats.total_records,        color: colors.accent,  icon: "📋" },
          ].map((s, i) => (
            <div key={i} style={{
              background: colors.card, borderRadius: 14, padding: "18px 22px",
              boxShadow: "0 2px 12px rgba(79,110,247,0.08)",
              borderTop: `4px solid ${s.color}`, flex: 1, minWidth: 160,
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: colors.textDark }}>{s.value}</div>
              <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        {["", "Pending", "Paid", "Overdue"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: `1.5px solid ${filterStatus === s ? colors.accent : colors.border}`,
            background: filterStatus === s ? colors.accent : colors.card,
            color: filterStatus === s ? "#fff" : colors.textMid,
            cursor: "pointer",
          }}>
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? <Spinner /> : (
        <div style={{ background: colors.card, borderRadius: 16, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: colors.bg }}>
                {["Student", "Fee Type", "Amount", "Due Date", "Paid Date", "Method", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: colors.textLight }}>No fee records found</td></tr>
              ) : fees.map((f, i) => (
                <tr key={f.payment_id} style={{ borderTop: `1px solid ${colors.border}`, background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: colors.textDark }}>{f.student_name}</div>
                    <div style={{ fontSize: 11, color: colors.textLight }}>{f.reg_no}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{f.fee_type}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: colors.textDark }}>{fmt(f.amount)}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: f.status === "Overdue" ? colors.danger : colors.textMid }}>
                    {f.due_date}
                    {f.status === "Overdue" && <div style={{ fontSize: 10, color: colors.danger }}>{f.days_overdue} days late</div>}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: colors.success }}>{f.paid_date || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12 }}>{f.payment_method || "—"}</td>
                  <td style={{ padding: "12px 16px" }}><Badge text={f.status} type={statusColor[f.status]} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {f.status !== "Paid" && (
                        <Btn variant="success" onClick={() => setPayModal(f.payment_id)} style={{ padding: "5px 10px", fontSize: 11 }}>
                          💰 Pay
                        </Btn>
                      )}
                      {f.status === "Paid" && f.receipt_no && (
                        <span style={{ fontSize: 11, color: colors.success, padding: "5px 0" }}>🧾 {f.receipt_no}</span>
                      )}
                      <Btn variant="danger" onClick={() => handleDelete(f.payment_id)} style={{ padding: "5px 10px", fontSize: 11 }}>🗑️</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Fee Modal */}
      {showModal && (
        <Modal title="Add Fee Record" onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Student ID" value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} placeholder="e.g. 1" type="number" />
            <Select label="Fee Type" value={form.fee_type} onChange={e => setForm({ ...form, fee_type: e.target.value })}
              options={[
                { value: "Tuition",   label: "Tuition Fee" },
                { value: "Admission", label: "Admission Fee" },
                { value: "Exam",      label: "Exam Fee" },
                { value: "Library",   label: "Library Fee" },
                { value: "Sports",    label: "Sports Fee" },
                { value: "Hostel",    label: "Hostel Fee" },
                { value: "Other",     label: "Other" },
              ]} />
            <Input label="Amount (Rs.)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="35000" type="number" />
            <Input label="Due Date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} type="date" />
            <Select label="Payment Method" value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}
              options={[
                { value: "Cash",          label: "Cash" },
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Online",        label: "Online" },
                { value: "Cheque",        label: "Cheque" },
              ]} />
            <Input label="Remarks" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Optional" />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleAdd}>Add Fee</Btn>
          </div>
        </Modal>
      )}

      {/* Pay Modal */}
      {payModal && (
        <Modal title="Mark Fee as Paid" onClose={() => setPayModal(null)}>
          <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>💰</div>
            <p style={{ color: colors.textMid, marginBottom: 20 }}>Select payment method to confirm payment:</p>
            <Select label="Payment Method" value={payMethod} onChange={e => setPayMethod(e.target.value)}
              options={[
                { value: "Cash",          label: "Cash" },
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Online",        label: "Online" },
                { value: "Cheque",        label: "Cheque" },
              ]} />
            <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 16 }}>
              Receipt number will be auto-generated ✅
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setPayModal(null)}>Cancel</Btn>
            <Btn variant="success" onClick={handlePay}>✅ Confirm Payment</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// App.js mein YEH BHI ADD KAREIN:
// ============================================
// 1. navItems mein:
// { key: "fees", icon: "💰", label: "Fee Management" },
//
// 2. renderPage() mein:
// if (active === "fees") return <Fees />;
// ============================================
// ============================================
// EXAMINATION & RESULTS MODULE
// ============================================
function Examinations() {
  const [tab, setTab] = useState("exams"); // "exams" | "results" | "transcript"
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showExamModal, setShowExamModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showResultsView, setShowResultsView] = useState(null);
  const [showTranscript, setShowTranscript] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [editExam, setEditExam] = useState(null);

  const [examForm, setExamForm] = useState({
    exam_name: "", exam_type: "Midterm", exam_date: "",
    total_marks: "100", passing_marks: "50", duration_minutes: "180", status: "Scheduled"
  });
  const [resultForm, setResultForm] = useState({
    student_id: "", exam_id: "", obtained_marks: "", remarks: ""
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [eRes, sRes, stRes] = await Promise.all([
        fetch(`${API}/exams${search ? `?search=${search}` : ""}`),
        fetch(`${API}/exams/stats/summary`),
        fetch(`${API}/students/list/all`)
      ]);
      const [eData, sData, stData] = await Promise.all([eRes.json(), sRes.json(), stRes.json()]);
      setExams(eData.data || []);
      setStats(sData.data || null);
      setStudents(stData.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { const t = setTimeout(fetchAll, 400); return () => clearTimeout(t); }, [search]);

  const openAddExam = () => {
    setEditExam(null);
    setExamForm({ exam_name: "", exam_type: "Midterm", exam_date: "", total_marks: "100", passing_marks: "50", duration_minutes: "180", status: "Scheduled" });
    setShowExamModal(true);
  };

  const openEditExam = (ex) => {
    setEditExam(ex);
    setExamForm({
      exam_name: ex.exam_name, exam_type: ex.exam_type,
      exam_date: ex.exam_date ? ex.exam_date.substring(0, 10) : "",
      total_marks: String(ex.total_marks), passing_marks: String(ex.passing_marks),
      duration_minutes: String(ex.duration_minutes || ""), status: ex.status
    });
    setShowExamModal(true);
  };

  const handleExamSubmit = async () => {
    const method = editExam ? "PUT" : "POST";
    const url = editExam ? `${API}/exams/${editExam.exam_id}` : `${API}/exams`;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(examForm) });
    const d = await res.json();
    if (d.success) { setShowExamModal(false); fetchAll(); } else alert(d.message);
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm("Is exam ko delete karna chahte hain?")) return;
    await fetch(`${API}/exams/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const viewResults = async (exam) => {
    setShowResultsView(exam);
    const res = await fetch(`${API}/exams/${exam.exam_id}/results`);
    const d = await res.json();
    setExamResults(d.data || []);
  };

  const handleResultSubmit = async () => {
    const res = await fetch(`${API}/results`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resultForm)
    });
    const d = await res.json();
    if (d.success) {
      alert(`Result saved! Grade: ${d.grade} | Percentage: ${d.percentage}%`);
      setShowResultModal(false);
      setResultForm({ student_id: "", exam_id: "", obtained_marks: "", remarks: "" });
      fetchAll();
    } else alert(d.message);
  };

  const viewTranscript = async (student) => {
    setShowTranscript(student);
    const res = await fetch(`${API}/students/${student.student_id}/transcript`);
    const d = await res.json();
    setTranscript(d);
  };

  const gradeColor = (g) => {
    if (!g) return colors.textLight;
    if (g.startsWith("A")) return "#10b981";
    if (g.startsWith("B")) return "#3b82f6";
    if (g.startsWith("C")) return "#f59e0b";
    if (g === "D") return "#f97316";
    return "#ef4444";
  };

  const statusColor = { Scheduled: "info", Ongoing: "warning", Completed: "success" };
  const typeColor = { Midterm: "info", Final: "danger", Quiz: "success", Assignment: "warning", Lab: "default" };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textDark, margin: 0 }}>Examination & Results</h2>
          <p style={{ color: colors.textLight, margin: "4px 0 0" }}>Manage exams, marks, and grades</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => setShowResultModal(true)}>📝 Enter Marks</Btn>
          <Btn onClick={openAddExam}>+ Add Exam</Btn>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Total Exams", value: stats.total_exams, color: colors.accent, icon: "📋" },
            { label: "Completed", value: stats.completed, color: "#10b981", icon: "✅" },
            { label: "Scheduled", value: stats.scheduled, color: "#f59e0b", icon: "📅" },
            { label: "Avg CGPA", value: stats.avg_gpa || "—", color: "#8b5cf6", icon: "🎓" },
            { label: "Passed", value: stats.passed, color: "#10b981", icon: "👍" },
            { label: "Failed", value: stats.failed, color: "#ef4444", icon: "❌" },
          ].map(s => (
            <div key={s.label} style={{ background: colors.card, borderRadius: 12, padding: "14px 18px", boxShadow: "0 2px 10px rgba(79,110,247,0.07)", borderLeft: `4px solid ${s.color}`, flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: colors.textDark }}>{s.icon} {s.value}</div>
              <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["exams", "📋 Exams"], ["results", "📝 Results"], ["transcript", "🎓 Student Transcript"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === key ? colors.accent : colors.bg,
            color: tab === key ? "#fff" : colors.textMid,
            boxShadow: tab === key ? "0 2px 8px rgba(79,110,247,0.3)" : "none",
          }}>{label}</button>
        ))}
      </div>

      {/* EXAMS TAB */}
      {tab === "exams" && (
        <>
          <div style={{ marginBottom: 16 }}>
            <input placeholder="🔍 Search exams..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 13, width: 280, background: colors.bg, outline: "none" }} />
          </div>
          {loading ? <Spinner /> : (
            <div style={{ background: colors.card, borderRadius: 16, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: colors.bg }}>
                    {["Exam Name", "Type", "Course", "Date", "Marks", "Submissions", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exams.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: colors.textLight }}>No exams found</td></tr>
                  ) : exams.map((ex, i) => (
                    <tr key={ex.exam_id} style={{ borderTop: `1px solid ${colors.border}`, background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textDark }}>{ex.exam_name}</div>
                        <div style={{ fontSize: 11, color: colors.textLight }}>{ex.duration_minutes ? `${ex.duration_minutes} min` : "—"}</div>
                      </td>
                      <td style={{ padding: "13px 16px" }}><Badge text={ex.exam_type} type={typeColor[ex.exam_type] || "default"} /></td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: colors.textMid }}>{ex.course_code || "—"}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13 }}>{ex.exam_date ? ex.exam_date.substring(0, 10) : "—"}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13 }}>
                        <span style={{ fontWeight: 700, color: colors.textDark }}>{ex.total_marks}</span>
                        <span style={{ color: colors.textLight, fontSize: 11 }}> (pass: {ex.passing_marks})</span>
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 13 }}>
                        <span style={{ background: colors.bg, borderRadius: 6, padding: "3px 10px", fontWeight: 700, color: colors.accent }}>{ex.total_results || 0}</span>
                      </td>
                      <td style={{ padding: "13px 16px" }}><Badge text={ex.status} type={statusColor[ex.status]} /></td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <Btn variant="ghost" onClick={() => viewResults(ex)} style={{ padding: "5px 10px", fontSize: 11 }}>👁️ Results</Btn>
                          <Btn variant="ghost" onClick={() => openEditExam(ex)} style={{ padding: "5px 10px", fontSize: 11 }}>✏️</Btn>
                          <Btn variant="danger" onClick={() => handleDeleteExam(ex.exam_id)} style={{ padding: "5px 10px", fontSize: 11 }}>🗑️</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* RESULTS TAB */}
      {tab === "results" && (
        <div>
          <div style={{ marginBottom: 16, color: colors.textLight, fontSize: 14 }}>
            Kisi exam ke results dekhne ke liye Exams tab mein "👁️ Results" button click karein.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {exams.filter(e => e.total_results > 0).map(ex => (
              <div key={ex.exam_id} onClick={() => { setTab("exams"); viewResults(ex); }}
                style={{ background: colors.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(79,110,247,0.08)", cursor: "pointer", borderLeft: `4px solid ${colors.accent}`, transition: "transform 0.15s", }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.textDark }}>{ex.exam_name}</div>
                <div style={{ fontSize: 12, color: colors.textLight, marginTop: 4 }}>{ex.course_code || "No course"}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                  <Badge text={ex.exam_type} type={typeColor[ex.exam_type] || "default"} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors.accent }}>{ex.total_results} results</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRANSCRIPT TAB */}
      {tab === "transcript" && (
        <div>
          <div style={{ marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {students.map(s => (
              <button key={s.student_id} onClick={() => viewTranscript(s)} style={{
                padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${colors.border}`, cursor: "pointer", fontSize: 13,
                background: showTranscript?.student_id === s.student_id ? colors.accent : colors.bg,
                color: showTranscript?.student_id === s.student_id ? "#fff" : colors.textMid, fontWeight: 600,
              }}>{s.full_name}</button>
            ))}
          </div>

          {transcript && (
            <div style={{ background: colors.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 16px rgba(79,110,247,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.textDark }}>{showTranscript?.full_name}</h3>
                  <div style={{ fontSize: 13, color: colors.textLight, marginTop: 4 }}>{showTranscript?.reg_no}</div>
                </div>
                {transcript.gpa && (
                  <div style={{ display: "flex", gap: 16 }}>
                    {[
                      { label: "CGPA", value: transcript.gpa.cgpa || "—", color: colors.accent },
                      { label: "Avg %", value: `${transcript.gpa.avg_percentage || "—"}%`, color: "#10b981" },
                      { label: "Total Exams", value: transcript.gpa.total_exams, color: "#8b5cf6" },
                      { label: "Failed", value: transcript.gpa.failed_exams, color: "#ef4444" },
                    ].map(item => (
                      <div key={item.label} style={{ textAlign: "center", background: colors.bg, borderRadius: 10, padding: "10px 16px" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.value}</div>
                        <div style={{ fontSize: 11, color: colors.textLight }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: colors.bg }}>
                    {["Exam", "Course", "Type", "Date", "Marks", "%", "Grade", "Points"].map(h => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: colors.textLight, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transcript.results.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: "center", padding: 30, color: colors.textLight }}>Koi result nahi mila</td></tr>
                  ) : transcript.results.map((r, i) => (
                    <tr key={r.result_id} style={{ borderTop: `1px solid ${colors.border}`, background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                      <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: colors.textDark }}>{r.exam_name}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: colors.textMid }}>{r.course_code || "—"}</td>
                      <td style={{ padding: "12px 14px" }}><Badge text={r.exam_type} type={typeColor[r.exam_type] || "default"} /></td>
                      <td style={{ padding: "12px 14px", fontSize: 12 }}>{r.exam_date ? r.exam_date.substring(0, 10) : "—"}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13 }}>{r.obtained_marks}/{r.total_marks}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600 }}>{r.percentage}%</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: gradeColor(r.grade) }}>{r.grade}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: colors.textMid }}>{r.grade_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD EXAM MODAL */}
      {showExamModal && (
        <Modal title={editExam ? "Edit Exam" : "Add New Exam"} onClose={() => setShowExamModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Input label="Exam Name" value={examForm.exam_name} onChange={e => setExamForm({ ...examForm, exam_name: e.target.value })} placeholder="CS101 Midterm Spring 2025" />
            </div>
            <Select label="Exam Type" value={examForm.exam_type} onChange={e => setExamForm({ ...examForm, exam_type: e.target.value })}
              options={["Midterm", "Final", "Quiz", "Assignment", "Lab"].map(v => ({ value: v, label: v }))} />
            <Input label="Exam Date" value={examForm.exam_date} onChange={e => setExamForm({ ...examForm, exam_date: e.target.value })} type="date" />
            <Input label="Total Marks" value={examForm.total_marks} onChange={e => setExamForm({ ...examForm, total_marks: e.target.value })} placeholder="100" type="number" />
            <Input label="Passing Marks" value={examForm.passing_marks} onChange={e => setExamForm({ ...examForm, passing_marks: e.target.value })} placeholder="50" type="number" />
            <Input label="Duration (minutes)" value={examForm.duration_minutes} onChange={e => setExamForm({ ...examForm, duration_minutes: e.target.value })} placeholder="180" type="number" />
            <Select label="Status" value={examForm.status} onChange={e => setExamForm({ ...examForm, status: e.target.value })}
              options={["Scheduled", "Ongoing", "Completed"].map(v => ({ value: v, label: v }))} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
            <Btn variant="ghost" onClick={() => setShowExamModal(false)}>Cancel</Btn>
            <Btn onClick={handleExamSubmit}>{editExam ? "Update Exam" : "Add Exam"}</Btn>
          </div>
        </Modal>
      )}

      {/* ENTER MARKS MODAL */}
      {showResultModal && (
        <Modal title="Enter Student Marks" onClose={() => setShowResultModal(false)}>
          <Select label="Select Student" value={resultForm.student_id} onChange={e => setResultForm({ ...resultForm, student_id: e.target.value })}
            options={[{ value: "", label: "-- Select Student --" }, ...students.map(s => ({ value: String(s.student_id), label: `${s.full_name} (${s.reg_no})` }))]} />
          <Select label="Select Exam" value={resultForm.exam_id} onChange={e => setResultForm({ ...resultForm, exam_id: e.target.value })}
            options={[{ value: "", label: "-- Select Exam --" }, ...exams.map(ex => ({ value: String(ex.exam_id), label: `${ex.exam_name} (Total: ${ex.total_marks})` }))]} />
          <Input label="Obtained Marks" value={resultForm.obtained_marks} onChange={e => setResultForm({ ...resultForm, obtained_marks: e.target.value })} placeholder="85" type="number" />
          <Input label="Remarks (Optional)" value={resultForm.remarks} onChange={e => setResultForm({ ...resultForm, remarks: e.target.value })} placeholder="Good performance" />
          <div style={{ background: colors.bg, borderRadius: 8, padding: "10px 14px", marginTop: 8, fontSize: 12, color: colors.textLight }}>
            ℹ️ Grade automatic calculate hoga obtained marks aur total marks ke basis par.
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
            <Btn variant="ghost" onClick={() => setShowResultModal(false)}>Cancel</Btn>
            <Btn onClick={handleResultSubmit}>Save Result</Btn>
          </div>
        </Modal>
      )}

      {/* EXAM RESULTS VIEW MODAL */}
      {showResultsView && (
        <Modal title={`Results — ${showResultsView.exam_name}`} onClose={() => { setShowResultsView(null); setExamResults([]); }}>
          {examResults.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: colors.textLight }}>Koi result nahi enter kiya gaya abhi</div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                {["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "F"].map(g => {
                  const count = examResults.filter(r => r.grade === g).length;
                  if (!count) return null;
                  return (
                    <div key={g} style={{ background: colors.bg, borderRadius: 8, padding: "6px 12px", textAlign: "center" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: gradeColor(g) }}>{g}</span>
                      <span style={{ fontSize: 12, color: colors.textLight, marginLeft: 6 }}>×{count}</span>
                    </div>
                  );
                })}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: colors.bg }}>
                    {["Student", "Reg No", "Marks", "%", "Grade"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: colors.textLight, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {examResults.map((r, i) => (
                    <tr key={r.result_id} style={{ borderTop: `1px solid ${colors.border}`, background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                      <td style={{ padding: "11px 14px", fontSize: 14, fontWeight: 600, color: colors.textDark }}>{r.student_name}</td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: colors.textLight }}>{r.reg_no}</td>
                      <td style={{ padding: "11px 14px", fontSize: 13 }}>{r.obtained_marks}/{r.total_marks}</td>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600 }}>{r.percentage}%</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: gradeColor(r.grade) }}>{r.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <Btn variant="ghost" onClick={() => { setShowResultsView(null); setExamResults([]); }}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// HOSTEL MANAGEMENT MODULE
// ============================================
function Hostel() {
  const [tab, setTab] = useState("overview");
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHostel, setSelectedHostel] = useState("all");

  const [showAllocModal, setShowAllocModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);

  const [allocForm, setAllocForm] = useState({ student_id: "", room_id: "", hostel_id: "", allocation_date: "", monthly_fee: "", remarks: "" });
  const [roomForm, setRoomForm] = useState({ hostel_id: "", room_number: "", room_type: "Double", capacity: "2", monthly_fee: "5000", floor_number: "1", has_ac: false, has_attached_bath: false, status: "Available" });
  const [complaintForm, setComplaintForm] = useState({ student_id: "", hostel_id: "", complaint_type: "Maintenance", description: "" });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const hostelQ = selectedHostel !== "all" ? `?hostel_id=${selectedHostel}` : "";
      const [hRes, rRes, aRes, cRes, sRes, stRes] = await Promise.all([
        fetch(`${API}/hostels`),
        fetch(`${API}/hostel-rooms${hostelQ}`),
        fetch(`${API}/hostel-allocations${hostelQ}`),
        fetch(`${API}/hostel-complaints${hostelQ}`),
        fetch(`${API}/hostels/stats/summary`),
        fetch(`${API}/students/list/all`),
      ]);
      const [hData, rData, aData, cData, sData, stData] = await Promise.all([
        hRes.json(), rRes.json(), aRes.json(), cRes.json(), sRes.json(), stRes.json()
      ]);
      setHostels(hData.data || []);
      setRooms(rData.data || []);
      setAllocations(aData.data || []);
      setComplaints(cData.data || []);
      setStats(sData.data || null);
      setStudents(stData.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [selectedHostel]);

  const handleAllocSubmit = async () => {
    const res = await fetch(`${API}/hostel-allocations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(allocForm) });
    const d = await res.json();
    if (d.success) { setShowAllocModal(false); fetchAll(); } else alert(d.message);
  };

  const handleVacate = async (id) => {
    if (!window.confirm("Is student ko vacate karna chahte hain?")) return;
    const res = await fetch(`${API}/hostel-allocations/${id}/vacate`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vacating_date: new Date().toISOString().split("T")[0] }) });
    const d = await res.json();
    if (d.success) fetchAll(); else alert(d.message);
  };

  const handleRoomSubmit = async () => {
    const method = editRoom ? "PUT" : "POST";
    const url = editRoom ? `${API}/hostel-rooms/${editRoom.room_id}` : `${API}/hostel-rooms`;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(roomForm) });
    const d = await res.json();
    if (d.success) { setShowRoomModal(false); fetchAll(); } else alert(d.message);
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Is room ko delete karna chahte hain?")) return;
    await fetch(`${API}/hostel-rooms/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const handleComplaintSubmit = async () => {
    const res = await fetch(`${API}/hostel-complaints`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(complaintForm) });
    const d = await res.json();
    if (d.success) { setShowComplaintModal(false); fetchAll(); } else alert(d.message);
  };

  const updateComplaintStatus = async (id, status) => {
    await fetch(`${API}/hostel-complaints/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchAll();
  };

  const openAddRoom = () => {
    setEditRoom(null);
    setRoomForm({ hostel_id: selectedHostel !== "all" ? selectedHostel : "", room_number: "", room_type: "Double", capacity: "2", monthly_fee: "5000", floor_number: "1", has_ac: false, has_attached_bath: false, status: "Available" });
    setShowRoomModal(true);
  };

  const openEditRoom = (r) => {
    setEditRoom(r);
    setRoomForm({ hostel_id: String(r.hostel_id), room_number: r.room_number, room_type: r.room_type, capacity: String(r.capacity), monthly_fee: String(r.monthly_fee), floor_number: String(r.floor_number), has_ac: !!r.has_ac, has_attached_bath: !!r.has_attached_bath, status: r.status });
    setShowRoomModal(true);
  };

  const statusColor = { Available: "success", Full: "danger", Maintenance: "warning" };
  const complaintStatusColor = { Pending: "danger", "In Progress": "warning", Resolved: "success" };
  const complaintTypeIcon = { Maintenance: "🔧", Cleanliness: "🧹", Security: "🔒", Food: "🍽️", Other: "📋" };

  const activeAllocs = allocations.filter(a => a.status === "Active");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textDark, margin: 0 }}>🏠 Hostel Management</h2>
          <p style={{ color: colors.textLight, margin: "4px 0 0" }}>Rooms, allocations aur complaints manage karein</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select value={selectedHostel} onChange={e => setSelectedHostel(e.target.value)}
            style={{ padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 13, background: colors.bg, color: colors.textDark, outline: "none", cursor: "pointer" }}>
            <option value="all">🏠 All Hostels</option>
            {hostels.map(h => <option key={h.hostel_id} value={h.hostel_id}>{h.hostel_name}</option>)}
          </select>
          <Btn variant="ghost" onClick={() => setShowComplaintModal(true)}>📋 File Complaint</Btn>
          <Btn variant="ghost" onClick={openAddRoom}>+ Add Room</Btn>
          <Btn onClick={() => setShowAllocModal(true)}>🛏️ Allocate Room</Btn>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Students in Hostel", value: stats.total_students, color: colors.accent, icon: "👥" },
            { label: "Available Rooms", value: stats.available_rooms, color: "#10b981", icon: "🟢" },
            { label: "Full Rooms", value: stats.full_rooms, color: "#ef4444", icon: "🔴" },
            { label: "Total Rooms", value: stats.total_rooms, color: "#8b5cf6", icon: "🏠" },
            { label: "Pending Complaints", value: stats.pending_complaints, color: "#f59e0b", icon: "⚠️" },
            { label: "Monthly Revenue", value: `Rs. ${Number(stats.monthly_revenue || 0).toLocaleString()}`, color: "#10b981", icon: "💰" },
          ].map(s => (
            <div key={s.label} style={{ background: colors.card, borderRadius: 12, padding: "14px 18px", boxShadow: "0 2px 10px rgba(79,110,247,0.07)", borderLeft: `4px solid ${s.color}`, flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: colors.textDark }}>{s.icon} {s.value}</div>
              <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["overview", "🏢 Hostels"], ["rooms", "🛏️ Rooms"], ["allocations", "👥 Residents"], ["complaints", "📋 Complaints"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === key ? colors.accent : colors.bg,
            color: tab === key ? "#fff" : colors.textMid,
            boxShadow: tab === key ? "0 2px 8px rgba(79,110,247,0.3)" : "none",
          }}>{label}</button>
        ))}
      </div>

      {loading ? <Spinner /> : <>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {hostels.map(h => (
              <div key={h.hostel_id} style={{ background: colors.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 16px rgba(79,110,247,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: colors.textDark }}>{h.hostel_name}</div>
                    <Badge text={h.hostel_type} type={h.hostel_type === "Boys" ? "info" : "danger"} />
                  </div>
                  <div style={{ fontSize: 28 }}>{h.hostel_type === "Boys" ? "🏢" : "🏫"}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Total Rooms", value: h.total_rooms_count || 0 },
                    { label: "Total Beds", value: h.total_capacity || 0 },
                    { label: "Occupied", value: h.total_occupied || 0, color: "#ef4444" },
                    { label: "Available", value: h.total_available || 0, color: "#10b981" },
                    { label: "Students", value: h.total_students || 0, color: colors.accent },
                  ].map(item => (
                    <div key={item.label} style={{ background: colors.bg, borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: item.color || colors.textDark }}>{item.value}</div>
                      <div style={{ fontSize: 11, color: colors.textLight }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                {h.warden_name && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${colors.border}`, fontSize: 13, color: colors.textMid }}>
                    👤 Warden: <strong>{h.warden_name}</strong> &nbsp;|&nbsp; 📞 {h.warden_phone}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ROOMS TAB */}
        {tab === "rooms" && (
          <div style={{ background: colors.card, borderRadius: 16, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: colors.bg }}>
                  {["Room No", "Hostel", "Type", "Floor", "Capacity", "Occupied", "Fee/Month", "Amenities", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr><td colSpan={10} style={{ textAlign: "center", padding: 40, color: colors.textLight }}>Koi room nahi mila</td></tr>
                ) : rooms.map((r, i) => (
                  <tr key={r.room_id} style={{ borderTop: `1px solid ${colors.border}`, background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: colors.accent, fontSize: 14 }}>{r.room_number}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>{r.hostel_name}</td>
                    <td style={{ padding: "12px 14px" }}><Badge text={r.room_type} type="info" /></td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>Floor {r.floor_number}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>{r.capacity} beds</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ height: 6, width: 60, background: colors.border, borderRadius: 3 }}>
                          <div style={{ height: "100%", width: `${(r.occupied / r.capacity) * 100}%`, background: r.occupied >= r.capacity ? "#ef4444" : "#10b981", borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: colors.textMid }}>{r.occupied}/{r.capacity}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#10b981" }}>Rs. {Number(r.monthly_fee).toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12 }}>
                      {r.has_ac ? "❄️ AC" : ""} {r.has_attached_bath ? "🚿 Bath" : ""}
                      {!r.has_ac && !r.has_attached_bath ? <span style={{ color: colors.textLight }}>—</span> : ""}
                    </td>
                    <td style={{ padding: "12px 14px" }}><Badge text={r.status} type={statusColor[r.status]} /></td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn variant="ghost" onClick={() => openEditRoom(r)} style={{ padding: "5px 10px", fontSize: 11 }}>✏️</Btn>
                        <Btn variant="danger" onClick={() => handleDeleteRoom(r.room_id)} style={{ padding: "5px 10px", fontSize: 11 }}>🗑️</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ALLOCATIONS TAB */}
        {tab === "allocations" && (
          <div style={{ background: colors.card, borderRadius: 16, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: colors.bg }}>
                  {["Student", "Reg No", "Hostel", "Room", "Type", "Alloc. Date", "Fee/Month", "Status", "Action"].map(h => (
                    <th key={h} style={{ padding: "13px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allocations.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: "center", padding: 40, color: colors.textLight }}>Koi allocation nahi mila</td></tr>
                ) : allocations.map((a, i) => (
                  <tr key={a.allocation_id} style={{ borderTop: `1px solid ${colors.border}`, background: i % 2 === 0 ? "#fff" : "#fafbff" }}>
                    <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 600, color: colors.textDark }}>{a.student_name}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: colors.textLight }}>{a.reg_no}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>{a.hostel_name}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: colors.accent }}>Room {a.room_number}</td>
                    <td style={{ padding: "12px 14px" }}><Badge text={a.room_type} type="info" /></td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>{a.allocation_date ? a.allocation_date.substring(0, 10) : "—"}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#10b981" }}>Rs. {Number(a.monthly_fee || 0).toLocaleString()}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <Badge text={a.status} type={a.status === "Active" ? "success" : "default"} />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {a.status === "Active" && (
                        <Btn variant="danger" onClick={() => handleVacate(a.allocation_id)} style={{ padding: "5px 12px", fontSize: 11 }}>
                          🚪 Vacate
                        </Btn>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {tab === "complaints" && (
          <div style={{ display: "grid", gap: 14 }}>
            {complaints.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: colors.textLight, background: colors.card, borderRadius: 16 }}>Koi complaint nahi mili</div>
            ) : complaints.map(c => (
              <div key={c.complaint_id} style={{ background: colors.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(79,110,247,0.07)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 14, flex: 1 }}>
                  <div style={{ fontSize: 28 }}>{complaintTypeIcon[c.complaint_type] || "📋"}</div>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: colors.textDark }}>{c.student_name}</span>
                      <Badge text={c.complaint_type} type="info" />
                      <Badge text={c.status} type={complaintStatusColor[c.status]} />
                    </div>
                    <div style={{ fontSize: 13, color: colors.textMid, marginBottom: 4 }}>{c.description}</div>
                    <div style={{ fontSize: 12, color: colors.textLight }}>{c.hostel_name} • Filed: {c.filed_date ? c.filed_date.substring(0, 10) : "—"}</div>
                  </div>
                </div>
                {c.status !== "Resolved" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    {c.status === "Pending" && (
                      <Btn variant="ghost" onClick={() => updateComplaintStatus(c.complaint_id, "In Progress")} style={{ padding: "6px 12px", fontSize: 12 }}>
                        🔄 In Progress
                      </Btn>
                    )}
                    <Btn onClick={() => updateComplaintStatus(c.complaint_id, "Resolved")} style={{ padding: "6px 12px", fontSize: 12 }}>
                      ✅ Resolve
                    </Btn>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>}

      {/* ALLOCATE ROOM MODAL */}
      {showAllocModal && (
        <Modal title="Allocate Room to Student" onClose={() => setShowAllocModal(false)}>
          <Select label="Select Hostel" value={allocForm.hostel_id} onChange={e => setAllocForm({ ...allocForm, hostel_id: e.target.value })}
            options={[{ value: "", label: "-- Select Hostel --" }, ...hostels.map(h => ({ value: String(h.hostel_id), label: h.hostel_name }))]} />
          <Select label="Select Room" value={allocForm.room_id} onChange={e => {
            const room = rooms.find(r => String(r.room_id) === e.target.value);
            setAllocForm({ ...allocForm, room_id: e.target.value, monthly_fee: room ? String(room.monthly_fee) : "" });
          }}
            options={[{ value: "", label: "-- Select Room --" }, ...rooms.filter(r => r.status === "Available" && (allocForm.hostel_id ? String(r.hostel_id) === allocForm.hostel_id : true)).map(r => ({ value: String(r.room_id), label: `Room ${r.room_number} — ${r.room_type} (${r.available_beds} beds free) — Rs. ${Number(r.monthly_fee).toLocaleString()}` }))]} />
          <Select label="Select Student" value={allocForm.student_id} onChange={e => setAllocForm({ ...allocForm, student_id: e.target.value })}
            options={[{ value: "", label: "-- Select Student --" }, ...students.map(s => ({ value: String(s.student_id), label: `${s.full_name} (${s.reg_no})` }))]} />
          <Input label="Allocation Date" value={allocForm.allocation_date} onChange={e => setAllocForm({ ...allocForm, allocation_date: e.target.value })} type="date" />
          <Input label="Monthly Fee (Rs.)" value={allocForm.monthly_fee} onChange={e => setAllocForm({ ...allocForm, monthly_fee: e.target.value })} placeholder="5000" type="number" />
          <Input label="Remarks (Optional)" value={allocForm.remarks} onChange={e => setAllocForm({ ...allocForm, remarks: e.target.value })} placeholder="Any special note" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
            <Btn variant="ghost" onClick={() => setShowAllocModal(false)}>Cancel</Btn>
            <Btn onClick={handleAllocSubmit}>🛏️ Allocate Room</Btn>
          </div>
        </Modal>
      )}

      {/* ADD/EDIT ROOM MODAL */}
      {showRoomModal && (
        <Modal title={editRoom ? "Edit Room" : "Add New Room"} onClose={() => setShowRoomModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Select label="Hostel" value={roomForm.hostel_id} onChange={e => setRoomForm({ ...roomForm, hostel_id: e.target.value })}
              options={[{ value: "", label: "-- Select Hostel --" }, ...hostels.map(h => ({ value: String(h.hostel_id), label: h.hostel_name }))]} />
            <Input label="Room Number" value={roomForm.room_number} onChange={e => setRoomForm({ ...roomForm, room_number: e.target.value })} placeholder="101" />
            <Select label="Room Type" value={roomForm.room_type} onChange={e => setRoomForm({ ...roomForm, room_type: e.target.value })}
              options={["Single", "Double", "Triple", "Quad"].map(v => ({ value: v, label: v }))} />
            <Input label="Capacity (Beds)" value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })} type="number" />
            <Input label="Monthly Fee (Rs.)" value={roomForm.monthly_fee} onChange={e => setRoomForm({ ...roomForm, monthly_fee: e.target.value })} type="number" />
            <Input label="Floor Number" value={roomForm.floor_number} onChange={e => setRoomForm({ ...roomForm, floor_number: e.target.value })} type="number" />
            <Select label="Status" value={roomForm.status} onChange={e => setRoomForm({ ...roomForm, status: e.target.value })}
              options={["Available", "Full", "Maintenance"].map(v => ({ value: v, label: v }))} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
              <input type="checkbox" checked={roomForm.has_ac} onChange={e => setRoomForm({ ...roomForm, has_ac: e.target.checked })} />
              ❄️ AC Available
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
              <input type="checkbox" checked={roomForm.has_attached_bath} onChange={e => setRoomForm({ ...roomForm, has_attached_bath: e.target.checked })} />
              🚿 Attached Bathroom
            </label>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
            <Btn variant="ghost" onClick={() => setShowRoomModal(false)}>Cancel</Btn>
            <Btn onClick={handleRoomSubmit}>{editRoom ? "Update Room" : "Add Room"}</Btn>
          </div>
        </Modal>
      )}

      {/* COMPLAINT MODAL */}
      {showComplaintModal && (
        <Modal title="File a Complaint" onClose={() => setShowComplaintModal(false)}>
          <Select label="Select Student" value={complaintForm.student_id} onChange={e => setComplaintForm({ ...complaintForm, student_id: e.target.value })}
            options={[{ value: "", label: "-- Select Student --" }, ...students.map(s => ({ value: String(s.student_id), label: `${s.full_name} (${s.reg_no})` }))]} />
          <Select label="Select Hostel" value={complaintForm.hostel_id} onChange={e => setComplaintForm({ ...complaintForm, hostel_id: e.target.value })}
            options={[{ value: "", label: "-- Select Hostel --" }, ...hostels.map(h => ({ value: String(h.hostel_id), label: h.hostel_name }))]} />
          <Select label="Complaint Type" value={complaintForm.complaint_type} onChange={e => setComplaintForm({ ...complaintForm, complaint_type: e.target.value })}
            options={["Maintenance", "Cleanliness", "Security", "Food", "Other"].map(v => ({ value: v, label: v }))} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: colors.textMid, marginBottom: 6 }}>Description</label>
            <textarea value={complaintForm.description} onChange={e => setComplaintForm({ ...complaintForm, description: e.target.value })}
              placeholder="Complaint ki detail likho..." rows={3}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowComplaintModal(false)}>Cancel</Btn>
            <Btn onClick={handleComplaintSubmit}>📋 File Complaint</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// DEPARTMENT MANAGEMENT MODULE
// ============================================
function Departments() {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [detailDept, setDetailDept] = useState(null);
  const [detailTeachers, setDetailTeachers] = useState([]);
  const [detailCourses, setDetailCourses] = useState([]);
  const [detailTab, setDetailTab] = useState("teachers");

  const [form, setForm] = useState({
    dept_name: "", dept_code: "", established_year: "",
    office_location: "", phone: "", email: "",
    description: "", status: "Active", dept_head_id: ""
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dRes, tRes, sRes] = await Promise.all([
        fetch(`${API}/departments${search ? `?search=${search}` : ""}`),
        fetch(`${API}/teachers`),
        fetch(`${API}/departments/stats/summary`)
      ]);
      const [dData, tData, sData] = await Promise.all([dRes.json(), tRes.json(), sRes.json()]);
      setDepartments(dData.data || []);
      setTeachers(tData.data || []);
      setStats(sData.data || null);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { const t = setTimeout(fetchAll, 400); return () => clearTimeout(t); }, [search]);

  const openAdd = () => {
    setEditDept(null);
    setForm({ dept_name: "", dept_code: "", established_year: new Date().getFullYear(), office_location: "", phone: "", email: "", description: "", status: "Active", dept_head_id: "" });
    setShowModal(true);
  };

  const openEdit = (d) => {
    setEditDept(d);
    setForm({
      dept_name: d.dept_name, dept_code: d.dept_code,
      established_year: d.established_year || "",
      office_location: d.office_location || "",
      phone: d.phone || "", email: d.email || "",
      description: d.description || "",
      status: d.status || "Active",
      dept_head_id: d.dept_head_id ? String(d.dept_head_id) : ""
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const method = editDept ? "PUT" : "POST";
    const url = editDept ? `${API}/departments/${editDept.dept_id}` : `${API}/departments`;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    if (d.success) { setShowModal(false); fetchAll(); } else alert(d.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Is department ko deactivate karna chahte hain?")) return;
    await fetch(`${API}/departments/${id}`, { method: "DELETE" });
    fetchAll();
  };

  const viewDetail = async (dept) => {
    setDetailDept(dept);
    setDetailTab("teachers");
    const [tRes, cRes] = await Promise.all([
      fetch(`${API}/departments/${dept.dept_id}/teachers`),
      fetch(`${API}/departments/${dept.dept_id}/courses`)
    ]);
    const [tData, cData] = await Promise.all([tRes.json(), cRes.json()]);
    setDetailTeachers(tData.data || []);
    setDetailCourses(cData.data || []);
  };

  const deptColors = ["#4f6ef7", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textDark, margin: 0 }}>🏛️ Departments</h2>
          <p style={{ color: colors.textLight, margin: "4px 0 0" }}>University ke saare departments manage karein</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input placeholder="🔍 Search departments..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 13, width: 240, background: colors.bg, outline: "none" }} />
          <Btn onClick={openAdd}>+ Add Department</Btn>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Total Departments", value: stats.total, color: colors.accent, icon: "🏛️" },
            { label: "Active Departments", value: stats.active, color: "#10b981", icon: "✅" },
            { label: "Total Students", value: stats.total_students, color: "#8b5cf6", icon: "🎓" },
            { label: "Total Teachers", value: stats.total_teachers, color: "#f59e0b", icon: "👨‍🏫" },
          ].map(s => (
            <div key={s.label} style={{ background: colors.card, borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 10px rgba(79,110,247,0.07)", borderLeft: `4px solid ${s.color}`, flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.textDark }}>{s.icon} {s.value}</div>
              <div style={{ fontSize: 12, color: colors.textLight, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Department Cards */}
      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {departments.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: colors.textLight }}>Koi department nahi mila</div>
          ) : departments.map((d, i) => {
            const color = deptColors[i % deptColors.length];
            return (
              <div key={d.dept_id} style={{ background: colors.card, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px rgba(79,110,247,0.08)", border: `1px solid ${colors.border}` }}>
                {/* Color bar */}
                <div style={{ height: 6, background: color }} />
                <div style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: colors.textDark, marginBottom: 4 }}>{d.dept_name}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ background: color + "22", color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>{d.dept_code}</span>
                        <Badge text={d.status} type={d.status === "Active" ? "success" : "warning"} />
                      </div>
                    </div>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏛️</div>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                    {[
                      { label: "Students", value: d.total_students || 0, icon: "🎓" },
                      { label: "Teachers", value: d.total_teachers || 0, icon: "👨‍🏫" },
                      { label: "Courses", value: d.total_courses || 0, icon: "📚" },
                      { label: "Programs", value: d.total_programs || 0, icon: "🎯" },
                    ].map(item => (
                      <div key={item.label} style={{ background: colors.bg, borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color }}>{item.value}</div>
                        <div style={{ fontSize: 10, color: colors.textLight }}>{item.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Info */}
                  <div style={{ fontSize: 12, color: colors.textMid, marginBottom: 6 }}>
                    {d.office_location && <div>📍 {d.office_location}</div>}
                    {d.phone && <div>📞 {d.phone}</div>}
                    {d.dept_head_name && <div>👤 Head: <strong>{d.dept_head_name}</strong></div>}
                    {d.established_year && <div>📅 Est. {d.established_year}</div>}
                  </div>

                  {d.description && (
                    <div style={{ fontSize: 12, color: colors.textLight, marginBottom: 12, fontStyle: "italic", borderLeft: `3px solid ${color}`, paddingLeft: 8 }}>
                      {d.description}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
                    <Btn variant="ghost" onClick={() => viewDetail(d)} style={{ flex: 1, padding: "7px 10px", fontSize: 12 }}>👁️ View Detail</Btn>
                    <Btn variant="ghost" onClick={() => openEdit(d)} style={{ padding: "7px 12px", fontSize: 12 }}>✏️ Edit</Btn>
                    <Btn variant="danger" onClick={() => handleDelete(d.dept_id)} style={{ padding: "7px 12px", fontSize: 12 }}>🗑️</Btn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <Modal title={editDept ? "Edit Department" : "Add New Department"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Department Name" value={form.dept_name} onChange={e => setForm({ ...form, dept_name: e.target.value })} placeholder="Computer Science" />
            <Input label="Department Code" value={form.dept_code} onChange={e => setForm({ ...form, dept_code: e.target.value })} placeholder="CS" />
            <Input label="Established Year" value={form.established_year} onChange={e => setForm({ ...form, established_year: e.target.value })} placeholder="2005" type="number" />
            <Input label="Office Location" value={form.office_location} onChange={e => setForm({ ...form, office_location: e.target.value })} placeholder="Block A, Room 101" />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="061-1234567" />
            <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="dept@university.edu" type="email" />
            <Select label="Department Head" value={form.dept_head_id} onChange={e => setForm({ ...form, dept_head_id: e.target.value })}
              options={[{ value: "", label: "-- Select Head --" }, ...teachers.map(t => ({ value: String(t.teacher_id), label: `${t.full_name} (${t.designation})` }))]} />
            <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: colors.textMid, marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Department ke baare mein likho..." rows={2}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleSubmit}>{editDept ? "Update Department" : "Add Department"}</Btn>
          </div>
        </Modal>
      )}

      {/* DETAIL MODAL */}
      {detailDept && (
        <Modal title={`🏛️ ${detailDept.dept_name}`} onClose={() => { setDetailDept(null); setDetailTeachers([]); setDetailCourses([]); }}>
          {/* Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Code", value: detailDept.dept_code },
              { label: "Est. Year", value: detailDept.established_year },
              { label: "Office", value: detailDept.office_location || "—" },
              { label: "Phone", value: detailDept.phone || "—" },
              { label: "Email", value: detailDept.email || "—" },
              { label: "Head", value: detailDept.dept_head_name || "Not assigned" },
              { label: "Students", value: detailDept.total_students || 0 },
              { label: "Teachers", value: detailDept.total_teachers || 0 },
            ].map(item => (
              <div key={item.label} style={{ background: colors.bg, borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: colors.textLight }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.textDark }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[["teachers", "👨‍🏫 Teachers"], ["courses", "📚 Courses"]].map(([key, label]) => (
              <button key={key} onClick={() => setDetailTab(key)} style={{
                padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: detailTab === key ? colors.accent : colors.bg,
                color: detailTab === key ? "#fff" : colors.textMid,
              }}>{label}</button>
            ))}
          </div>

          {detailTab === "teachers" && (
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {detailTeachers.length === 0 ? (
                <div style={{ textAlign: "center", padding: 20, color: colors.textLight }}>Koi teacher assign nahi</div>
              ) : detailTeachers.map(t => (
                <div key={t.teacher_id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.textDark }}>{t.full_name}</div>
                    <div style={{ fontSize: 12, color: colors.textLight }}>{t.email}</div>
                  </div>
                  <Badge text={t.designation} type="info" />
                </div>
              ))}
            </div>
          )}

          {detailTab === "courses" && (
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {detailCourses.length === 0 ? (
                <div style={{ textAlign: "center", padding: 20, color: colors.textLight }}>Koi course nahi mila</div>
              ) : detailCourses.map(c => (
                <div key={c.course_id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.textDark }}>{c.course_name}</div>
                    <div style={{ fontSize: 12, color: colors.textLight }}>{c.course_code} • {c.credit_hours} Credit Hours</div>
                  </div>
                  <Badge text={c.course_type || "Core"} type="success" />
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <Btn variant="ghost" onClick={() => { setDetailDept(null); setDetailTeachers([]); setDetailCourses([]); }}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// LOGIN / AUTH SYSTEM - FRONTEND
//
// App.js mein PURI file replace karni hogi
// Sirf TOP par yeh 2 cheezein add karni hain:
//
// 1. const API ke baad yeh add karo:
//    const getToken = () => localStorage.getItem('ums_token');
//    const getUser  = () => JSON.parse(localStorage.getItem('ums_user') || 'null');
//
// 2. export default function App() ke andar
//    useState ke saath yeh add karo:
//    const [user, setUser] = useState(getUser());
//
// 3. return ke pehle yeh add karo:
//    if (!user) return <LoginPage onLogin={setUser} />;
//
// 4. Sidebar mein logout button add karo (neeche diya hai)
//
// 5. // SIDEBAR NAV se pehle LoginPage component paste karo
// ============================================

// ============================================
// LOGIN PAGE COMPONENT
// App.js mein // SIDEBAR NAV se PEHLE paste karo
// ============================================
function LoginPage({ onLogin }) {
  const [form, setForm]       = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Username aur password dono zaroori hain!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const d = await res.json();
      if (d.success) {
        localStorage.setItem("ums_token", d.token);
        localStorage.setItem("ums_user",  JSON.stringify(d.user));
        onLogin(d.user);
      } else {
        setError(d.message || "Login failed");
      }
    } catch {
      setError("Server se connect nahi ho pa raha. Backend chal raha hai?");
    }
    setLoading(false);
  };

  const roleColor = { Admin: "#4f6ef7", Teacher: "#10b981", Student: "#f59e0b" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1f36 0%, #2e3563 50%, #1a1f36 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: 20,
    }}>
      {/* Background circles */}
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(79,110,247,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -150, left: -150, width: 500, height: 500, borderRadius: "50%", background: "rgba(79,110,247,0.06)", pointerEvents: "none" }} />

      <div style={{
        background: "#fff",
        borderRadius: 24,
        padding: "48px 44px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 70, height: 70, borderRadius: 18,
            background: "linear-gradient(135deg, #4f6ef7, #7b93fa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(79,110,247,0.35)",
          }}>🏛️</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1f36", margin: "0 0 4px" }}>
            UniManage
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
            University Management System
          </p>
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1f36", marginBottom: 20, textAlign: "center" }}>
          Sign in to your account
        </h2>

        {/* Error */}
        {error && (
          <div style={{
            background: "#fee2e2", border: "1px solid #fca5a5",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#991b1b",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Username */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>
            Username
          </label>
          <input
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Enter your username"
            style={{
              width: "100%", padding: "11px 14px", borderRadius: 10,
              border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none",
              background: "#f8faff", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter your password"
              style={{
                width: "100%", padding: "11px 44px 11px 14px", borderRadius: 10,
                border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none",
                background: "#f8faff", boxSizing: "border-box",
              }}
            />
            <button onClick={() => setShowPass(!showPass)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8",
            }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "13px",
            background: loading ? "#94a3b8" : "linear-gradient(135deg, #4f6ef7, #7b93fa)",
            color: "#fff", border: "none", borderRadius: 12,
            fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 16px rgba(79,110,247,0.35)",
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        {/* Demo Credentials */}
        <div style={{ marginTop: 28, padding: 16, background: "#f8faff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Demo Credentials
          </p>
          {[
            { role: "Admin",   user: "admin",        pass: "admin123" },
            { role: "Teacher", user: "ahmad.hassan", pass: "teacher123" },
            { role: "Student", user: "ali.raza",     pass: "student123" },
          ].map(c => (
            <div key={c.role}
              onClick={() => setForm({ username: c.user, password: c.pass })}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "7px 10px", borderRadius: 8, marginBottom: 6,
                background: "#fff", cursor: "pointer", border: "1px solid #e2e8f0",
                transition: "border-color 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = "#4f6ef7"}
              onMouseOut={e => e.currentTarget.style.borderColor = "#e2e8f0"}
            >
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#fff",
                background: roleColor[c.role], padding: "2px 8px", borderRadius: 20,
              }}>{c.role}</span>
              <span style={{ fontSize: 11, color: "#4a5568", fontFamily: "monospace" }}>{c.user}</span>
              <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{c.pass}</span>
            </div>
          ))}
          <p style={{ fontSize: 10, color: "#94a3b8", margin: "8px 0 0", textAlign: "center" }}>
            Click any row to auto-fill credentials
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// YAHAN SE NEECHE WALI CHEEZEIN App.js mein ADD KAREIN
// ============================================

// 1. const API = ... ke BAAD yeh 2 lines add karo:
/*
const getToken = () => localStorage.getItem('ums_token');
const getUser  = () => JSON.parse(localStorage.getItem('ums_user') || 'null');
*/

// 2. export default function App() ke andar
//    const [active, setActive] = useState ke SAATH yeh add karo:
/*
const [user, setUser] = useState(getUser());
*/

// 3. return ( ke PEHLE yeh add karo:
/*
if (!user) return <LoginPage onLogin={setUser} />;
*/

// 4. Sidebar mein neeche wala div update karo — yeh paste karo:
/*
<div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
    {user?.full_name}
  </div>
  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginBottom: 10 }}>
    {user?.role}
  </div>
  <button
    onClick={() => {
      localStorage.removeItem('ums_token');
      localStorage.removeItem('ums_user');
      setUser(null);
    }}
    style={{
      width: "100%", padding: "8px", borderRadius: 8,
      background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)",
      color: "#fca5a5", fontSize: 12, fontWeight: 600, cursor: "pointer",
    }}
  >
    🚪 Logout
  </button>
</div>
*/

// SIDEBAR NAV
// ============================================
// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [user, setUser] = useState(getUser());
  
  const allNavItems = [
  { key: "dashboard",    icon: "🏠", label: "Dashboard",    roles: ["Admin","Teacher","Student"] },
  { key: "students",     icon: "🎓", label: "Students",     roles: ["Admin"] },
  { key: "courses",      icon: "📚", label: "Courses",      roles: ["Admin","Teacher"] },
  { key: "enrollments",  icon: "📋", label: "Enrollments",  roles: ["Admin"] },
  { key: "teachers",     icon: "👨‍🏫", label: "Teachers",     roles: ["Admin"] },
  { key: "fees",         icon: "💰", label: "Fee Management",roles: ["Admin","Student"] },
  { key: "exams",        icon: "📝", label: "Examinations", roles: ["Admin","Teacher","Student"] },
  { key: "hostel",       icon: "🏠", label: "Hostel",       roles: ["Admin","Student"] },
  { key: "departments",  icon: "🏛️", label: "Departments",  roles: ["Admin"] },
];
const navItems = allNavItems.filter(item => item.roles.includes(user?.role));

  const renderPage = () => {
    if (active === "dashboard") return <Dashboard />;
    if (active === "departments") return <Departments />;
    if (active === "students") return <Students />;
    if (active === "courses") return <Courses />;
    if (active === "enrollments") return <Enrollments />;
    if (active === "teachers") return <Teachers />;
    if (active === "fees") return <Fees />;
    if (active === "exams") return <Examinations />;
    if (active === "hostel") return <Hostel />;
  };

  if (!user) return <LoginPage onLogin={setUser} />;
  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", width: "100vw", overflow: "hidden", fontFamily: "'Segoe UI', system-ui, sans-serif", background: colors.bg }}>
      {/* Sidebar */}
      <div style={{
        width: 240,
        minWidth: 240,
        background: colors.primary,
        padding: "28px 0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}>
        <div style={{ padding: "0 24px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>🏛️</div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>NFC-IET Multan</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Management System</div>
        </div>

        <nav style={{ marginTop: 16, flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "12px 24px",
                border: "none",
                background: active === item.key ? "rgba(79,110,247,0.25)" : "transparent",
                color: active === item.key ? colors.accentLight : "rgba(255,255,255,0.55)",
                fontSize: 14,
                fontWeight: active === item.key ? 700 : 500,
                cursor: "pointer",
                textAlign: "left",
                borderLeft: active === item.key ? `3px solid ${colors.accent}` : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
<div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
            {user?.full_name}
          </div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginBottom: 10 }}>
            {user?.role}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('ums_token');
              localStorage.removeItem('ums_user');
              setUser(null);
            }}
            style={{
              width: "100%", padding: "8px", borderRadius: 8,
              background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 36, overflowY: "auto", minWidth: 0 }}>
        {renderPage()}
      </div>
    </div>
  );
}
