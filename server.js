// ============================================
// UNIVERSITY MANAGEMENT SYSTEM - BACKEND
// Node.js + Express + MySQL
// ============================================

// --- FOLDER STRUCTURE ---
// university-backend/
//   ├── server.js          (main file - ye file)
//   ├── .env               (environment variables)
//   ├── package.json
//   └── routes/
//       ├── students.js
//       ├── courses.js
//       ├── enrollments.js
//       └── departments.js

// ============================================
// 1. SETUP - Run these commands first:
// npm init -y
// npm install express mysql2 cors dotenv
// ============================================

// ============================================
// FILE: .env
// ============================================
/*
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=university_db
PORT=5000
*/

// ============================================
// FILE: server.js
// ============================================
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');   // ← yeh add karo
const jwt = require('jsonwebtoken');  // ← yeh add karo

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'university_db',
    waitForConnections: true,
    connectionLimit: 10,
});

const pool = db.promise();

// Test DB Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Database connected successfully!');
        connection.release();
    }
});

// ============================================
// ROUTES: DEPARTMENTS
// ============================================

// Get all departments
app.get('/api/departments', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM departments ORDER BY dept_name');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get single department
app.get('/api/departments/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM departments WHERE dept_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Department not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add department
app.post('/api/departments', async (req, res) => {
    try {
        const { dept_name, dept_code, description } = req.body;
        if (!dept_name || !dept_code) return res.status(400).json({ success: false, message: 'dept_name and dept_code are required' });
        const [result] = await pool.query(
            'INSERT INTO departments (dept_name, dept_code, description) VALUES (?, ?, ?)',
            [dept_name, dept_code, description]
        );
        res.status(201).json({ success: true, message: 'Department added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update department
app.put('/api/departments/:id', async (req, res) => {
    try {
        const { dept_name, dept_code, description } = req.body;
        await pool.query(
            'UPDATE departments SET dept_name=?, dept_code=?, description=? WHERE dept_id=?',
            [dept_name, dept_code, description, req.params.id]
        );
        res.json({ success: true, message: 'Department updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete department
app.delete('/api/departments/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM departments WHERE dept_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Department deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// ROUTES: STUDENTS
// ============================================

// Get all students (with program & dept info)
app.get('/api/students', async (req, res) => {
    try {
        const { search, program_id, status, semester } = req.query;
        let query = 'SELECT * FROM v_student_details WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (full_name LIKE ? OR reg_no LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (program_id) { query += ' AND program_id = ?'; params.push(program_id); }
        if (status) { query += ' AND status = ?'; params.push(status); }

        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get single student
app.get('/api/students/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM v_student_details WHERE student_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add student
app.post('/api/students', async (req, res) => {
    try {
        const {
            reg_no, first_name, last_name, email, phone,
            gender, date_of_birth, address, city,
            program_id, admission_date, current_semester
        } = req.body;

        if (!reg_no || !first_name || !last_name || !email || !program_id || !admission_date) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        const [result] = await pool.query(
            `INSERT INTO students 
            (reg_no, first_name, last_name, email, phone, gender, date_of_birth, address, city, program_id, admission_date, current_semester)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [reg_no, first_name, last_name, email, phone, gender, date_of_birth, address, city, program_id, admission_date, current_semester || 1]
        );
        res.status(201).json({ success: true, message: 'Student added successfully', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Registration number or email already exists' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
    try {
        const {
            first_name, last_name, email, phone,
            gender, date_of_birth, address, city,
            program_id, current_semester, status
        } = req.body;

        await pool.query(
            `UPDATE students SET 
            first_name=?, last_name=?, email=?, phone=?, gender=?,
            date_of_birth=?, address=?, city=?, program_id=?,
            current_semester=?, status=?
            WHERE student_id=?`,
            [first_name, last_name, email, phone, gender, date_of_birth, address, city, program_id, current_semester, status, req.params.id]
        );
        res.json({ success: true, message: 'Student updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM students WHERE student_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get student enrollments
app.get('/api/students/:id/enrollments', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM v_enrollment_details WHERE student_id = ?',
            [req.params.id]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// ROUTES: COURSES
// ============================================

// Get all courses
app.get('/api/courses', async (req, res) => {
    try {
        const { dept_id, semester_level } = req.query;
        let query = `
            SELECT c.*, d.dept_name 
            FROM courses c 
            JOIN departments d ON c.dept_id = d.dept_id 
            WHERE 1=1`;
        const params = [];

        if (dept_id) { query += ' AND c.dept_id = ?'; params.push(dept_id); }
        if (semester_level) { query += ' AND c.semester_level = ?'; params.push(semester_level); }

        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get single course
app.get('/api/courses/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT c.*, d.dept_name FROM courses c JOIN departments d ON c.dept_id = d.dept_id WHERE c.course_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add course
app.post('/api/courses', async (req, res) => {
    try {
        const { course_code, course_name, credit_hours, course_type, dept_id, semester_level, description, is_elective } = req.body;
        if (!course_code || !course_name || !dept_id) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }
        const [result] = await pool.query(
            `INSERT INTO courses (course_code, course_name, credit_hours, course_type, dept_id, semester_level, description, is_elective)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [course_code, course_name, credit_hours || 3, course_type || 'Theory', dept_id, semester_level || 1, description, is_elective || false]
        );
        res.status(201).json({ success: true, message: 'Course added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update course
app.put('/api/courses/:id', async (req, res) => {
    try {
        const { course_name, credit_hours, course_type, semester_level, description } = req.body;
        await pool.query(
            'UPDATE courses SET course_name=?, credit_hours=?, course_type=?, semester_level=?, description=? WHERE course_id=?',
            [course_name, credit_hours, course_type, semester_level, description, req.params.id]
        );
        res.json({ success: true, message: 'Course updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete course
app.delete('/api/courses/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM courses WHERE course_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// ROUTES: ENROLLMENTS
// ============================================

// Get all enrollments
app.get('/api/enrollments', async (req, res) => {
    try {
        const { student_id, offering_id, semester_id } = req.query;
        let query = 'SELECT * FROM v_enrollment_details WHERE 1=1';
        const params = [];

        if (student_id) { query += ' AND student_id = ?'; params.push(student_id); }
        if (offering_id) { query += ' AND offering_id = ?'; params.push(offering_id); }

        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Enroll student
app.post('/api/enrollments', async (req, res) => {
    try {
        const { student_id, offering_id } = req.body;
        if (!student_id || !offering_id) {
            return res.status(400).json({ success: false, message: 'student_id and offering_id required' });
        }

        // Check capacity
        const [offering] = await pool.query(
            'SELECT max_capacity, enrolled_count FROM course_offerings WHERE offering_id = ?',
            [offering_id]
        );
        if (offering.length === 0) return res.status(404).json({ success: false, message: 'Course offering not found' });
        if (offering[0].enrolled_count >= offering[0].max_capacity) {
            return res.status(400).json({ success: false, message: 'Course is full' });
        }

        const [result] = await pool.query(
            'INSERT INTO enrollments (student_id, offering_id) VALUES (?, ?)',
            [student_id, offering_id]
        );

        // Update enrolled count
        await pool.query(
            'UPDATE course_offerings SET enrolled_count = enrolled_count + 1 WHERE offering_id = ?',
            [offering_id]
        );

        res.status(201).json({ success: true, message: 'Student enrolled successfully', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Student already enrolled in this course' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update marks
app.put('/api/enrollments/:id/marks', async (req, res) => {
    try {
        const { midterm_marks, final_marks, assignment_marks } = req.body;
        await pool.query(
            'UPDATE enrollments SET midterm_marks=?, final_marks=?, assignment_marks=? WHERE enrollment_id=?',
            [midterm_marks, final_marks, assignment_marks, req.params.id]
        );

        // Calculate grade
        await pool.query('CALL calculate_grade(?)', [req.params.id]);

        res.json({ success: true, message: 'Marks updated and grade calculated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Drop enrollment
app.put('/api/enrollments/:id/drop', async (req, res) => {
    try {
        const [enrollment] = await pool.query('SELECT offering_id FROM enrollments WHERE enrollment_id = ?', [req.params.id]);
        await pool.query("UPDATE enrollments SET status='Dropped' WHERE enrollment_id=?", [req.params.id]);
        await pool.query(
            'UPDATE course_offerings SET enrolled_count = enrolled_count - 1 WHERE offering_id = ?',
            [enrollment[0].offering_id]
        );
        res.json({ success: true, message: 'Enrollment dropped' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// ROUTES: DASHBOARD STATS
// ============================================
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [[{ total_students }]] = await pool.query("SELECT COUNT(*) AS total_students FROM students WHERE status='Active'");
        const [[{ total_courses }]] = await pool.query("SELECT COUNT(*) AS total_courses FROM courses");
        const [[{ total_departments }]] = await pool.query("SELECT COUNT(*) AS total_departments FROM departments");
        const [[{ total_enrollments }]] = await pool.query("SELECT COUNT(*) AS total_enrollments FROM enrollments WHERE status='Enrolled'");
        const [program_stats] = await pool.query(`
            SELECT p.program_name, COUNT(s.student_id) AS student_count
            FROM programs p LEFT JOIN students s ON p.program_id = s.program_id
            GROUP BY p.program_id, p.program_name
        `);

        res.json({
            success: true,
            data: {
                total_students,
                total_courses,
                total_departments,
                total_enrollments,
                program_stats
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 University Management System API Ready!`);
});

// ============================================
// TEACHERS MANAGEMENT - BACKEND CODE
// Yeh code server.js mein ADD karo
// existing code ke NEECHE paste karo
// ============================================

// ============================================
// ROUTES: TEACHERS
// ============================================

// Get all teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const { search, dept_id, designation, status } = req.query;
        let query = 'SELECT * FROM v_teacher_details WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (full_name LIKE ? OR emp_no LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (dept_id) { query += ' AND dept_id = ?'; params.push(dept_id); }
        if (designation) { query += ' AND designation = ?'; params.push(designation); }
        if (status) { query += ' AND status = ?'; params.push(status); }

        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get single teacher
app.get('/api/teachers/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM v_teacher_details WHERE teacher_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Teacher not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add teacher
app.post('/api/teachers', async (req, res) => {
    try {
        const {
            emp_no, first_name, last_name, email, phone,
            qualification, designation, dept_id, joining_date
        } = req.body;

        if (!emp_no || !first_name || !last_name || !email || !dept_id) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        const [result] = await pool.query(
            `INSERT INTO teachers 
            (emp_no, first_name, last_name, email, phone, qualification, designation, dept_id, joining_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [emp_no, first_name, last_name, email, phone, qualification, designation || 'Lecturer', dept_id, joining_date]
        );
        res.status(201).json({ success: true, message: 'Teacher added successfully', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Employee number or email already exists' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update teacher
app.put('/api/teachers/:id', async (req, res) => {
    try {
        const {
            first_name, last_name, email, phone,
            qualification, designation, dept_id, joining_date, status
        } = req.body;

        await pool.query(
            `UPDATE teachers SET 
            first_name=?, last_name=?, email=?, phone=?,
            qualification=?, designation=?, dept_id=?, joining_date=?, status=?
            WHERE teacher_id=?`,
            [first_name, last_name, email, phone, qualification, designation, dept_id, joining_date, status, req.params.id]
        );
        res.json({ success: true, message: 'Teacher updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete teacher
app.delete('/api/teachers/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM teachers WHERE teacher_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get teacher's assigned courses
app.get('/api/teachers/:id/courses', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT c.course_name, c.course_code, c.credit_hours, 
             s.semester_name, co.section, co.schedule, co.room_no,
             co.enrolled_count, co.max_capacity
             FROM course_offerings co
             JOIN courses c ON co.course_id = c.course_id
             JOIN semesters s ON co.semester_id = s.semester_id
             WHERE co.teacher_id = ?`,
            [req.params.id]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// TEACHERS MANAGEMENT - BACKEND CODE
// Yeh code server.js mein ADD karo
// existing code ke NEECHE paste karo
// ============================================

// ============================================
// ROUTES: TEACHERS
// ============================================

// Get all teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const { search, dept_id, designation, status } = req.query;
        let query = 'SELECT * FROM v_teacher_details WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (full_name LIKE ? OR emp_no LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (dept_id) { query += ' AND dept_id = ?'; params.push(dept_id); }
        if (designation) { query += ' AND designation = ?'; params.push(designation); }
        if (status) { query += ' AND status = ?'; params.push(status); }

        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get single teacher
app.get('/api/teachers/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM v_teacher_details WHERE teacher_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Teacher not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add teacher
app.post('/api/teachers', async (req, res) => {
    try {
        const {
            emp_no, first_name, last_name, email, phone,
            qualification, designation, dept_id, joining_date
        } = req.body;

        if (!emp_no || !first_name || !last_name || !email || !dept_id) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        const [result] = await pool.query(
            `INSERT INTO teachers 
            (emp_no, first_name, last_name, email, phone, qualification, designation, dept_id, joining_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [emp_no, first_name, last_name, email, phone, qualification, designation || 'Lecturer', dept_id, joining_date]
        );
        res.status(201).json({ success: true, message: 'Teacher added successfully', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Employee number or email already exists' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update teacher
app.put('/api/teachers/:id', async (req, res) => {
    try {
        const {
            first_name, last_name, email, phone,
            qualification, designation, dept_id, joining_date, status
        } = req.body;

        await pool.query(
            `UPDATE teachers SET 
            first_name=?, last_name=?, email=?, phone=?,
            qualification=?, designation=?, dept_id=?, joining_date=?, status=?
            WHERE teacher_id=?`,
            [first_name, last_name, email, phone, qualification, designation, dept_id, joining_date, status, req.params.id]
        );
        res.json({ success: true, message: 'Teacher updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete teacher
app.delete('/api/teachers/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM teachers WHERE teacher_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get teacher's assigned courses
app.get('/api/teachers/:id/courses', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT c.course_name, c.course_code, c.credit_hours, 
             s.semester_name, co.section, co.schedule, co.room_no,
             co.enrolled_count, co.max_capacity
             FROM course_offerings co
             JOIN courses c ON co.course_id = c.course_id
             JOIN semesters s ON co.semester_id = s.semester_id
             WHERE co.teacher_id = ?`,
            [req.params.id]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// FEE MANAGEMENT - BACKEND CODE
// server.js mein module.exports se PEHLE paste karo
// ============================================

// ============================================
// ROUTES: FEE STRUCTURES
// ============================================

// Get all fee structures
app.get('/api/fee-structures', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT fs.*, p.program_name 
            FROM fee_structures fs
            JOIN programs p ON fs.program_id = p.program_id
            ORDER BY fs.program_id, fs.semester_no
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add fee structure
app.post('/api/fee-structures', async (req, res) => {
    try {
        const { program_id, semester_no, tuition_fee, admission_fee, exam_fee, library_fee, sports_fee, academic_year } = req.body;
        const [result] = await pool.query(
            `INSERT INTO fee_structures (program_id, semester_no, tuition_fee, admission_fee, exam_fee, library_fee, sports_fee, academic_year)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [program_id, semester_no, tuition_fee || 0, admission_fee || 0, exam_fee || 0, library_fee || 0, sports_fee || 0, academic_year]
        );
        res.status(201).json({ success: true, message: 'Fee structure added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// ROUTES: FEE PAYMENTS
// ============================================

// Get all fee payments
app.get('/api/fees', async (req, res) => {
    try {
        const { student_id, status, fee_type } = req.query;
        let query = 'SELECT * FROM v_fee_details WHERE 1=1';
        const params = [];

        if (student_id) { query += ' AND student_id = ?'; params.push(student_id); }
        if (status)     { query += ' AND status = ?';     params.push(status); }
        if (fee_type)   { query += ' AND fee_type = ?';   params.push(fee_type); }

        query += ' ORDER BY due_date DESC';
        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get single fee payment
app.get('/api/fees/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM v_fee_details WHERE payment_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Fee record not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add fee payment
app.post('/api/fees', async (req, res) => {
    try {
        const { student_id, fee_type, amount, due_date, payment_method, remarks } = req.body;
        if (!student_id || !amount || !due_date) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }
        const [result] = await pool.query(
            `INSERT INTO fee_payments (student_id, fee_type, amount, due_date, payment_method, status, remarks)
             VALUES (?, ?, ?, ?, ?, 'Pending', ?)`,
            [student_id, fee_type || 'Tuition', amount, due_date, payment_method || 'Cash', remarks]
        );
        res.status(201).json({ success: true, message: 'Fee record added', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Mark fee as PAID
app.put('/api/fees/:id/pay', async (req, res) => {
    try {
        const { payment_method, receipt_no } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const receiptNo = receipt_no || `REC-${Date.now()}`;

        await pool.query(
            `UPDATE fee_payments 
             SET status='Paid', paid_date=?, payment_method=?, receipt_no=?
             WHERE payment_id=?`,
            [today, payment_method || 'Cash', receiptNo, req.params.id]
        );
        res.json({ success: true, message: 'Fee marked as paid', receipt_no: receiptNo });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update overdue fees automatically
app.put('/api/fees/update-overdue', async (req, res) => {
    try {
        const [result] = await pool.query(
            `UPDATE fee_payments 
             SET status='Overdue' 
             WHERE status='Pending' AND due_date < CURDATE()`
        );
        res.json({ success: true, message: `${result.affectedRows} fees marked as overdue` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete fee record
app.delete('/api/fees/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM fee_payments WHERE payment_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Fee record deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Fee dashboard stats
app.get('/api/fees/stats/summary', async (req, res) => {
    try {
        const [[{ total_collected }]] = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) AS total_collected FROM fee_payments WHERE status='Paid'"
        );
        const [[{ total_pending }]] = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) AS total_pending FROM fee_payments WHERE status='Pending'"
        );
        const [[{ total_overdue }]] = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) AS total_overdue FROM fee_payments WHERE status='Overdue'"
        );
        const [[{ total_records }]] = await pool.query(
            "SELECT COUNT(*) AS total_records FROM fee_payments"
        );
        res.json({
            success: true,
            data: { total_collected, total_pending, total_overdue, total_records }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// ROUTES: EXAMINATION & RESULTS
// ============================================

// Get all exams
app.get('/api/exams', async (req, res) => {
    try {
        const { search, exam_type, status } = req.query;
        let query = `
            SELECT e.*, c.course_name, c.course_code,
                   CONCAT(t.first_name,' ',t.last_name) AS teacher_name,
                   sem.semester_name,
                   COUNT(r.result_id) AS total_results
            FROM exams e
            LEFT JOIN course_offerings co ON e.course_offering_id = co.offering_id
            LEFT JOIN courses c ON co.course_id = c.course_id
            LEFT JOIN teachers t ON co.teacher_id = t.teacher_id
            LEFT JOIN semesters sem ON co.semester_id = sem.semester_id
            LEFT JOIN results r ON e.exam_id = r.exam_id
            WHERE 1=1
        `;
        const params = [];
        if (search) { query += ' AND e.exam_name LIKE ?'; params.push(`%${search}%`); }
        if (exam_type) { query += ' AND e.exam_type = ?'; params.push(exam_type); }
        if (status) { query += ' AND e.status = ?'; params.push(status); }
        query += ' GROUP BY e.exam_id ORDER BY e.exam_date DESC';
        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get single exam
app.get('/api/exams/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT e.*, c.course_name, c.course_code,
                   CONCAT(t.first_name,' ',t.last_name) AS teacher_name
            FROM exams e
            LEFT JOIN course_offerings co ON e.course_offering_id = co.offering_id
            LEFT JOIN courses c ON co.course_id = c.course_id
            LEFT JOIN teachers t ON co.teacher_id = t.teacher_id
            WHERE e.exam_id = ?`, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add exam
app.post('/api/exams', async (req, res) => {
    try {
        const { exam_name, exam_type, course_offering_id, exam_date, total_marks, passing_marks, duration_minutes } = req.body;
        if (!exam_name) return res.status(400).json({ success: false, message: 'Exam name is required' });
        const [result] = await pool.query(
            `INSERT INTO exams (exam_name, exam_type, course_offering_id, exam_date, total_marks, passing_marks, duration_minutes)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [exam_name, exam_type || 'Midterm', course_offering_id || null, exam_date, total_marks || 100, passing_marks || 50, duration_minutes || 180]
        );
        res.status(201).json({ success: true, message: 'Exam added successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update exam
app.put('/api/exams/:id', async (req, res) => {
    try {
        const { exam_name, exam_type, exam_date, total_marks, passing_marks, duration_minutes, status } = req.body;
        await pool.query(
            `UPDATE exams SET exam_name=?, exam_type=?, exam_date=?, total_marks=?, passing_marks=?, duration_minutes=?, status=?
             WHERE exam_id=?`,
            [exam_name, exam_type, exam_date, total_marks, passing_marks, duration_minutes, status, req.params.id]
        );
        res.json({ success: true, message: 'Exam updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete exam
app.delete('/api/exams/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM exams WHERE exam_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Exam deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get results for an exam
app.get('/api/exams/:id/results', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM v_result_details WHERE exam_id = ? ORDER BY obtained_marks DESC',
            [req.params.id]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all results
app.get('/api/results', async (req, res) => {
    try {
        const { student_id, exam_id, grade } = req.query;
        let query = 'SELECT * FROM v_result_details WHERE 1=1';
        const params = [];
        if (student_id) { query += ' AND student_id = ?'; params.push(student_id); }
        if (exam_id) { query += ' AND exam_id = ?'; params.push(exam_id); }
        if (grade) { query += ' AND grade = ?'; params.push(grade); }
        query += ' ORDER BY exam_date DESC';
        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add / update result
app.post('/api/results', async (req, res) => {
    try {
        const { student_id, exam_id, obtained_marks, remarks } = req.body;
        if (!student_id || !exam_id) return res.status(400).json({ success: false, message: 'Student and Exam required' });

        // Get exam total marks
        const [[exam]] = await pool.query('SELECT total_marks FROM exams WHERE exam_id = ?', [exam_id]);
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

        const percentage = (obtained_marks / exam.total_marks) * 100;

        // Get grade from policy
        const [[policy]] = await pool.query(
            'SELECT grade, grade_points FROM grade_policy WHERE ? BETWEEN min_percentage AND max_percentage LIMIT 1',
            [percentage]
        );
        const grade = policy ? policy.grade : 'F';
        const grade_points = policy ? policy.grade_points : 0;

        await pool.query(
            `INSERT INTO results (student_id, exam_id, obtained_marks, grade, grade_points, remarks)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE obtained_marks=VALUES(obtained_marks), grade=VALUES(grade), grade_points=VALUES(grade_points), remarks=VALUES(remarks)`,
            [student_id, exam_id, obtained_marks, grade, grade_points, remarks]
        );
        res.status(201).json({ success: true, message: 'Result saved', grade, grade_points, percentage: percentage.toFixed(2) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete result
app.delete('/api/results/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM results WHERE result_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Result deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get student GPA / transcript
app.get('/api/students/:id/transcript', async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT * FROM v_result_details WHERE student_id = ? ORDER BY exam_date DESC',
            [req.params.id]
        );
        const [[gpa]] = await pool.query(
            'SELECT * FROM v_student_gpa WHERE student_id = ?',
            [req.params.id]
        );
        res.json({ success: true, gpa, results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Dashboard stats for exams
app.get('/api/exams/stats/summary', async (req, res) => {
    try {
        const [[total]] = await pool.query('SELECT COUNT(*) AS total FROM exams');
        const [[completed]] = await pool.query("SELECT COUNT(*) AS total FROM exams WHERE status='Completed'");
        const [[scheduled]] = await pool.query("SELECT COUNT(*) AS total FROM exams WHERE status='Scheduled'");
        const [[passed]] = await pool.query("SELECT COUNT(*) AS total FROM results WHERE grade != 'F'");
        const [[failed]] = await pool.query("SELECT COUNT(*) AS total FROM results WHERE grade = 'F'");
        const [[avgGpa]] = await pool.query('SELECT ROUND(AVG(cgpa),2) AS avg_gpa FROM v_student_gpa WHERE cgpa IS NOT NULL');
        res.json({
            success: true,
            data: {
                total_exams: total.total,
                completed: completed.total,
                scheduled: scheduled.total,
                passed: passed.total,
                failed: failed.total,
                avg_gpa: avgGpa.avg_gpa
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all students for dropdown
app.get('/api/students/list/all', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT student_id, reg_no, CONCAT(first_name," ",last_name) AS full_name FROM students ORDER BY first_name');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// ROUTES: HOSTEL MANAGEMENT
// ============================================

// Get all hostels with stats
app.get('/api/hostels', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT h.*,
                COUNT(DISTINCT r.room_id) AS total_rooms_count,
                SUM(r.capacity) AS total_capacity,
                SUM(r.occupied) AS total_occupied,
                SUM(r.capacity - r.occupied) AS total_available,
                COUNT(DISTINCT CASE WHEN a.status='Active' THEN a.student_id END) AS total_students
            FROM hostels h
            LEFT JOIN hostel_rooms r ON h.hostel_id = r.hostel_id
            LEFT JOIN hostel_allocations a ON h.hostel_id = a.hostel_id
            GROUP BY h.hostel_id
            ORDER BY h.hostel_name
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get rooms for a hostel
app.get('/api/hostels/:id/rooms', async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT * FROM v_room_details WHERE hostel_id = ?';
        const params = [req.params.id];
        if (status) { query += ' AND status = ?'; params.push(status); }
        query += ' ORDER BY floor_number, room_number';
        const [rows] = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all rooms
app.get('/api/hostel-rooms', async (req, res) => {
    try {
        const { hostel_id, status, room_type } = req.query;
        let query = 'SELECT * FROM v_room_details WHERE 1=1';
        const params = [];
        if (hostel_id) { query += ' AND hostel_id = ?'; params.push(hostel_id); }
        if (status) { query += ' AND status = ?'; params.push(status); }
        if (room_type) { query += ' AND room_type = ?'; params.push(room_type); }
        query += ' ORDER BY hostel_name, floor_number, room_number';
        const [rows] = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add room
app.post('/api/hostel-rooms', async (req, res) => {
    try {
        const { hostel_id, room_number, room_type, capacity, monthly_fee, floor_number, has_ac, has_attached_bath } = req.body;
        if (!hostel_id || !room_number) return res.status(400).json({ success: false, message: 'Hostel and room number required' });
        const [result] = await pool.query(
            `INSERT INTO hostel_rooms (hostel_id, room_number, room_type, capacity, monthly_fee, floor_number, has_ac, has_attached_bath)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [hostel_id, room_number, room_type || 'Double', capacity || 2, monthly_fee || 5000, floor_number || 1, has_ac ? 1 : 0, has_attached_bath ? 1 : 0]
        );
        res.status(201).json({ success: true, message: 'Room added', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: 'Room number already exists in this hostel' });
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update room status
app.put('/api/hostel-rooms/:id', async (req, res) => {
    try {
        const { room_number, room_type, capacity, monthly_fee, floor_number, has_ac, has_attached_bath, status } = req.body;
        await pool.query(
            `UPDATE hostel_rooms SET room_number=?, room_type=?, capacity=?, monthly_fee=?, floor_number=?, has_ac=?, has_attached_bath=?, status=?
             WHERE room_id=?`,
            [room_number, room_type, capacity, monthly_fee, floor_number, has_ac ? 1 : 0, has_attached_bath ? 1 : 0, status, req.params.id]
        );
        res.json({ success: true, message: 'Room updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete room
app.delete('/api/hostel-rooms/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM hostel_rooms WHERE room_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Room deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all allocations
app.get('/api/hostel-allocations', async (req, res) => {
    try {
        const { hostel_id, status } = req.query;
        let query = 'SELECT * FROM v_allocation_details WHERE 1=1';
        const params = [];
        if (hostel_id) { query += ' AND hostel_id = ?'; params.push(hostel_id); }
        if (status) { query += ' AND status = ?'; params.push(status); }
        query += ' ORDER BY allocation_date DESC';
        const [rows] = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Allocate room to student
app.post('/api/hostel-allocations', async (req, res) => {
    try {
        const { student_id, room_id, hostel_id, allocation_date, monthly_fee, remarks } = req.body;
        if (!student_id || !room_id || !hostel_id) return res.status(400).json({ success: false, message: 'Student, room and hostel required' });

        // Check room availability
        const [[room]] = await pool.query('SELECT capacity, occupied, status FROM hostel_rooms WHERE room_id = ?', [room_id]);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        if (room.occupied >= room.capacity) return res.status(400).json({ success: false, message: 'Room is full' });

        // Check student not already allocated
        const [[existing]] = await pool.query(
            "SELECT allocation_id FROM hostel_allocations WHERE student_id = ? AND status = 'Active'", [student_id]
        );
        if (existing) return res.status(400).json({ success: false, message: 'Student already has an active room allocation' });

        // Insert allocation
        await pool.query(
            `INSERT INTO hostel_allocations (student_id, room_id, hostel_id, allocation_date, monthly_fee, remarks)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [student_id, room_id, hostel_id, allocation_date || new Date().toISOString().split('T')[0], monthly_fee, remarks]
        );

        // Update room occupied count
        await pool.query('UPDATE hostel_rooms SET occupied = occupied + 1 WHERE room_id = ?', [room_id]);
        await pool.query(
            "UPDATE hostel_rooms SET status = CASE WHEN occupied >= capacity THEN 'Full' ELSE 'Available' END WHERE room_id = ?",
            [room_id]
        );

        res.status(201).json({ success: true, message: 'Room allocated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Vacate room (student leaving)
app.put('/api/hostel-allocations/:id/vacate', async (req, res) => {
    try {
        const { vacating_date } = req.body;
        const [[alloc]] = await pool.query('SELECT room_id FROM hostel_allocations WHERE allocation_id = ?', [req.params.id]);
        if (!alloc) return res.status(404).json({ success: false, message: 'Allocation not found' });

        await pool.query(
            "UPDATE hostel_allocations SET status='Vacated', vacating_date=? WHERE allocation_id=?",
            [vacating_date || new Date().toISOString().split('T')[0], req.params.id]
        );

        // Decrease occupied count
        await pool.query('UPDATE hostel_rooms SET occupied = GREATEST(occupied - 1, 0) WHERE room_id = ?', [alloc.room_id]);
        await pool.query(
            "UPDATE hostel_rooms SET status = CASE WHEN status='Maintenance' THEN 'Maintenance' WHEN occupied >= capacity THEN 'Full' ELSE 'Available' END WHERE room_id = ?",
            [alloc.room_id]
        );

        res.json({ success: true, message: 'Room vacated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get complaints
app.get('/api/hostel-complaints', async (req, res) => {
    try {
        const { hostel_id, status } = req.query;
        let query = `
            SELECT c.*, CONCAT(s.first_name,' ',s.last_name) AS student_name, s.reg_no, h.hostel_name
            FROM hostel_complaints c
            JOIN students s ON c.student_id = s.student_id
            JOIN hostels h ON c.hostel_id = h.hostel_id
            WHERE 1=1
        `;
        const params = [];
        if (hostel_id) { query += ' AND c.hostel_id = ?'; params.push(hostel_id); }
        if (status) { query += ' AND c.status = ?'; params.push(status); }
        query += ' ORDER BY c.filed_date DESC';
        const [rows] = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add complaint
app.post('/api/hostel-complaints', async (req, res) => {
    try {
        const { student_id, hostel_id, complaint_type, description } = req.body;
        if (!student_id || !hostel_id || !description) return res.status(400).json({ success: false, message: 'Required fields missing' });
        await pool.query(
            `INSERT INTO hostel_complaints (student_id, hostel_id, complaint_type, description, filed_date)
             VALUES (?, ?, ?, ?, CURDATE())`,
            [student_id, hostel_id, complaint_type || 'Other', description]
        );
        res.status(201).json({ success: true, message: 'Complaint filed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update complaint status
app.put('/api/hostel-complaints/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const resolved = status === 'Resolved' ? 'CURDATE()' : 'NULL';
        await pool.query(
            `UPDATE hostel_complaints SET status=?, resolved_date=${resolved} WHERE complaint_id=?`,
            [status, req.params.id]
        );
        res.json({ success: true, message: 'Complaint updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Hostel summary stats
app.get('/api/hostels/stats/summary', async (req, res) => {
    try {
        const [[totalStudents]] = await pool.query("SELECT COUNT(*) AS total FROM hostel_allocations WHERE status='Active'");
        const [[availableRooms]] = await pool.query("SELECT COUNT(*) AS total FROM hostel_rooms WHERE status='Available'");
        const [[fullRooms]] = await pool.query("SELECT COUNT(*) AS total FROM hostel_rooms WHERE status='Full'");
        const [[pendingComplaints]] = await pool.query("SELECT COUNT(*) AS total FROM hostel_complaints WHERE status='Pending'");
        const [[totalRooms]] = await pool.query("SELECT COUNT(*) AS total FROM hostel_rooms");
        const [[monthlyRevenue]] = await pool.query("SELECT COALESCE(SUM(monthly_fee),0) AS total FROM hostel_allocations WHERE status='Active'");
        res.json({
            success: true,
            data: {
                total_students: totalStudents.total,
                available_rooms: availableRooms.total,
                full_rooms: fullRooms.total,
                total_rooms: totalRooms.total,
                pending_complaints: pendingComplaints.total,
                monthly_revenue: monthlyRevenue.total
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// ROUTES: DEPARTMENT MANAGEMENT
// ============================================

// Get all departments with stats
app.get('/api/departments', async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = 'SELECT * FROM v_department_details WHERE 1=1';
        const params = [];
        if (search) { query += ' AND (dept_name LIKE ? OR dept_code LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
        if (status) { query += ' AND status = ?'; params.push(status); }
        query += ' ORDER BY dept_name';
        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get single department
app.get('/api/departments/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM v_department_details WHERE dept_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Department not found' });
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add department
app.post('/api/departments', async (req, res) => {
    try {
        const { dept_name, dept_code, established_year, office_location, phone, email, description } = req.body;
        if (!dept_name || !dept_code) return res.status(400).json({ success: false, message: 'Department name and code required' });
        const [result] = await pool.query(
            `INSERT INTO departments (dept_name, dept_code, established_year, office_location, phone, email, description)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [dept_name, dept_code, established_year || new Date().getFullYear(), office_location, phone, email, description]
        );
        res.status(201).json({ success: true, message: 'Department added successfully', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: 'Department code already exists' });
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update department
app.put('/api/departments/:id', async (req, res) => {
    try {
        const { dept_name, dept_code, established_year, office_location, phone, email, description, status, dept_head_id } = req.body;
        await pool.query(
            `UPDATE departments SET dept_name=?, dept_code=?, established_year=?, office_location=?,
             phone=?, email=?, description=?, status=?, dept_head_id=?
             WHERE dept_id=?`,
            [dept_name, dept_code, established_year, office_location, phone, email, description, status,
             dept_head_id || null, req.params.id]
        );
        res.json({ success: true, message: 'Department updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete department
app.delete('/api/departments/:id', async (req, res) => {
    try {
        await pool.query('UPDATE departments SET status="Inactive" WHERE dept_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Department deactivated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get department teachers
app.get('/api/departments/:id/teachers', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM v_teacher_details WHERE dept_id = ? ORDER BY designation, first_name',
            [req.params.id]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get department courses
app.get('/api/departments/:id/courses', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM courses WHERE dept_id = ? ORDER BY course_name',
            [req.params.id]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Department summary stats
app.get('/api/departments/stats/summary', async (req, res) => {
    try {
        const [[total]] = await pool.query('SELECT COUNT(*) AS total FROM departments');
        const [[active]] = await pool.query("SELECT COUNT(*) AS total FROM departments WHERE status='Active'");
        const [[totalStudents]] = await pool.query('SELECT COUNT(*) AS total FROM students');
        const [[totalTeachers]] = await pool.query('SELECT COUNT(*) AS total FROM teachers');
        res.json({ success: true, data: { total: total.total, active: active.total, total_students: totalStudents.total, total_teachers: totalTeachers.total } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ============================================
// LOGIN / AUTH SYSTEM - BACKEND CODE
// 
// STEP 1: Terminal mein yeh run karo:
// npm install bcryptjs jsonwebtoken
//
// STEP 2: .env file mein yeh add karo:
// JWT_SECRET=university_secret_key_2024
//
// STEP 3: server.js mein bilkul UPAR
// (require statements ke baad) yeh add karo:
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
//
// STEP 4: Baaki code module.exports se pehle paste karo
// ============================================

// ============================================
// AUTH MIDDLEWARE
// ============================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'university_secret_key_2024');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

// ============================================
// ROUTES: AUTH
// ============================================

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        // Find user
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ? AND is_active = 1',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Update last login
        await pool.query('UPDATE users SET last_login = NOW() WHERE user_id = ?', [user.user_id]);

        // Generate token
        const token = jwt.sign(
            {
                user_id:    user.user_id,
                username:   user.username,
                role:       user.role,
                full_name:  user.full_name,
                email:      user.email,
                student_id: user.student_id,
                teacher_id: user.teacher_id,
            },
            process.env.JWT_SECRET || 'university_secret_key_2024',
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                user_id:    user.user_id,
                username:   user.username,
                role:       user.role,
                full_name:  user.full_name,
                email:      user.email,
                student_id: user.student_id,
                teacher_id: user.teacher_id,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Register new user (Admin only)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, role, full_name, email, student_id, teacher_id } = req.body;

        if (!username || !password || !full_name || !email) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users (username, password, role, full_name, email, student_id, teacher_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [username, hashedPassword, role || 'Student', full_name, email, student_id || null, teacher_id || null]
        );

        res.status(201).json({ success: true, message: 'User registered successfully', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT user_id, username, role, full_name, email, last_login FROM users WHERE user_id = ?',
            [req.user.user_id]
        );
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Change password
app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        const [users] = await pool.query('SELECT * FROM users WHERE user_id = ?', [req.user.user_id]);
        const isMatch = await bcrypt.compare(old_password, users[0].password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Old password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        await pool.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, req.user.user_id]);

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all users (Admin only)
app.get('/api/auth/users', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT user_id, username, role, full_name, email, is_active, last_login, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Toggle user active status
app.put('/api/auth/users/:id/toggle', async (req, res) => {
    try {
        await pool.query(
            'UPDATE users SET is_active = NOT is_active WHERE user_id = ?',
            [req.params.id]
        );
        res.json({ success: true, message: 'User status updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = app;