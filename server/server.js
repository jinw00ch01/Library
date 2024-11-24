const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// 예시 API 엔드포인트
app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Book');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 데이터베이스 연결 테스트 엔드포인트
app.get('/api/test', async (req, res) => {
  try {
    const [result] = await db.query('SELECT 1');
    res.json({ message: 'Database connection successful', result });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      sqlState: error.sqlState 
    });
  }
});

// 고객 회원가입 API
app.post('/api/customer/signup', async (req, res) => {
  try {
    const {
      infoId,
      password,
      contact,
      email,
      classification,
      address,
      birthdate,
      preferences
    } = req.body;

    // 디버깅을 위한 상세 로그
    console.log('=== Customer Signup Debug Info ===');
    console.log('Request body:', req.body);
    console.log('Classification:', classification);
    console.log('Birthdate:', birthdate);
    console.log('================================');

    // 허용된 분류 값 검증
    const allowedClassifications = ['학생', '교수', '외부인', '일반'];
    if (!allowedClassifications.includes(classification)) {
      return res.status(400).json({
        error: '올바르지 않은 회원 구분입니다.',
        allowedValues: allowedClassifications
      });
    }

    // 필수 필드 검증
    if (!infoId || !password || !contact || !email || !classification) {
      return res.status(400).json({
        error: '필수 필드가 누락되었습니다.',
        receivedData: { infoId, contact, email, classification }
      });
    }

    const query = `
      INSERT INTO Customer (
        Customer_InfoID,
        Customer_InfoPASSWORD,
        Customer_contact,
        Customer_email,
        Customer_Classification,
        Customer_Credit,
        Customer_address,
        Customer_birthdate,
        Customer_membership_date,
        Customer_preferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)
    `;

    const params = [
      infoId,
      password,
      contact,
      email,
      classification,
      '일반',  // Customer_Credit의 기본값
      address || null,
      birthdate ? new Date(birthdate).toISOString().split('T')[0] : null,
      preferences || null
    ];

    console.log('Query parameters:', params);

    const [result] = await db.query(query, params);
    res.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      customerId: result.insertId
    });
  } catch (error) {
    console.error('=== Error Details ===');
    console.error('Error:', error);
    console.error('SQL Message:', error.sqlMessage);
    console.error('SQL State:', error.sqlState);
    console.error('===================');

    res.status(500).json({
      error: '데이터베이스 오류가 발생했습니다.',
      details: error.sqlMessage,
      state: error.sqlState
    });
  }
});

// 직원 등록 API
app.post('/api/staff/signup', async (req, res) => {
  try {
    const {
      infoId,
      password,
      name,
      classification,
      email,
      number,
      department_ID
    } = req.body;

    const query = `
      INSERT INTO Staff (
        staff_name,
        staff_classification,
        staff_email,
        staff_number,
        staff_InfoID,
        staff_InfoPASSWORD,
        department_ID
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      name,
      classification,
      email,
      number,
      infoId,
      password,
      department_ID
    ]);

    res.json({ 
      success: true, 
      message: '직원 등록이 완료되었습니다.',
      staffId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 고객 로그인 API
app.post('/api/customer/login', async (req, res) => {
  try {
    const { infoId, password } = req.body;
    
    const query = `
      SELECT Customer_ID, Customer_InfoID, Customer_Classification 
      FROM Customer 
      WHERE Customer_InfoID = ? AND Customer_InfoPASSWORD = ?
    `;
    
    const [rows] = await db.query(query, [infoId, password]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }
    
    res.json({ 
      success: true, 
      user: {
        id: rows[0].Customer_ID,
        infoId: rows[0].Customer_InfoID,
        classification: rows[0].Customer_Classification
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 직원 로그인 API
app.post('/api/staff/login', async (req, res) => {
  try {
    const { infoId, password } = req.body;
    
    const query = `
      SELECT staff_ID, staff_InfoID, staff_classification 
      FROM Staff 
      WHERE staff_InfoID = ? AND staff_InfoPASSWORD = ?
    `;
    
    const [rows] = await db.query(query, [infoId, password]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }
    
    res.json({ 
      success: true, 
      user: {
        id: rows[0].staff_ID,
        infoId: rows[0].staff_InfoID,
        classification: rows[0].staff_classification
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 고객 정보 조회 API
app.get('/api/customer/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const query = `
      SELECT 
        Customer_InfoID,
        Customer_contact,
        Customer_email,
        Customer_Classification,
        Customer_Credit,
        Customer_address,
        Customer_birthdate,
        Customer_membership_date
      FROM Customer 
      WHERE Customer_ID = ?
    `;
    
    const [rows] = await db.query(query, [customerId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: '고객 정보를 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, customerInfo: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 직원 정보 조회 API
app.get('/api/staff/:id', async (req, res) => {
  try {
    const staffId = req.params.id;
    const query = `
      SELECT 
        staff_InfoID,
        staff_name,
        staff_classification,
        staff_email,
        staff_number,
        department_ID
      FROM Staff 
      WHERE staff_ID = ?
    `;
    
    const [rows] = await db.query(query, [staffId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: '직원 정보를 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, staffInfo: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: '도서관 관리 시스템 API 서버' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 