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

// 고객 정보 수정 API
app.put('/api/customer/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const updateData = req.body;
    
    const query = `
      UPDATE Customer 
      SET 
        Customer_contact = ?,
        Customer_email = ?,
        Customer_address = ?,
        Customer_preferences = ?
      WHERE Customer_ID = ?
    `;
    
    await db.query(query, [
      updateData.contact,
      updateData.email,
      updateData.address,
      updateData.preferences,
      customerId
    ]);
    
    res.json({ success: true, message: '회원정보가 수정되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 직원 정보 수정 API
app.put('/api/staff/:id', async (req, res) => {
  try {
    const staffId = req.params.id;
    const updateData = req.body;
    
    const query = `
      UPDATE Staff 
      SET 
        staff_email = ?,
        staff_number = ?
      WHERE staff_ID = ?
    `;
    
    await db.query(query, [
      updateData.email,
      updateData.number,
      staffId
    ]);
    
    res.json({ success: true, message: '직원정보가 수정되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 고객 탈퇴 API
app.delete('/api/customer/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    await db.query('DELETE FROM Customer WHERE Customer_ID = ?', [customerId]);
    res.json({ success: true, message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 직원 탈퇴 API
app.delete('/api/staff/:id', async (req, res) => {
  try {
    const staffId = req.params.id;
    await db.query('DELETE FROM Staff WHERE staff_ID = ?', [staffId]);
    res.json({ success: true, message: '직원 정보가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 부서 등록 API
app.post('/api/department', async (req, res) => {
  try {
    const {
      department_name,
      department_classification,
      department_location,
      department_number
    } = req.body;

    const query = `
      INSERT INTO Department (
        department_name,
        department_classification,
        department_location,
        department_number
      ) VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      department_name,
      department_classification,
      department_location,
      department_number
    ]);

    res.json({ 
      success: true, 
      message: '부서가 등록되었습니다.',
      departmentId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 도서 등록 API
app.post('/api/book', async (req, res) => {
  try {
    const {
      Book_name,
      Book_publisher,
      Book_author,
      Book_genre,
      Book_language,
      Book_ISBN,
      Book_pages,
      Book_published_date,
      Book_description,
      Book_state
    } = req.body;

    const query = `
      INSERT INTO Book (
        Book_name,
        Book_publisher,
        Book_author,
        Book_genre,
        Book_language,
        Book_ISBN,
        Book_pages,
        Book_published_date,
        Book_description,
        Book_state
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      Book_name,
      Book_publisher,
      Book_author,
      Book_genre,
      Book_language,
      Book_ISBN,
      Book_pages,
      Book_published_date,
      Book_description,
      Book_state
    ]);

    res.json({ 
      success: true, 
      message: '도서가 등록되었습니다.',
      bookId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 반납 장소 등록 API
app.post('/api/returnLo', async (req, res) => {
  try {
    const { ReturnLo_location, ReturnLo_number, ReturnLo_capacity } = req.body;

    const query = `
      INSERT INTO ReturnLo (
        ReturnLo_location,
        ReturnLo_number,
        ReturnLo_capacity
      ) VALUES (?, ?, ?)
    `;

    const [result] = await db.query(query, [
      ReturnLo_location,
      ReturnLo_number,
      ReturnLo_capacity
    ]);

    res.json({ 
      success: true, 
      message: '반납 장소가 등록되었습니다.',
      returnLoId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 공급업체(Cooperation) 등록 API
app.post('/api/cooperation', async (req, res) => {
  try {
    const {
      Cooperation_name,
      Cooperation_address,
      Cooperation_pername,
      Cooperation_number,
      Cooperation_classification
    } = req.body;

    const query = `
      INSERT INTO Supply (
        Cooperation_name,
        Cooperation_address,
        Cooperation_pername,
        Cooperation_number,
        Cooperation_classification
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      Cooperation_name,
      Cooperation_address,
      Cooperation_pername,
      Cooperation_number,
      Cooperation_classification
    ]);

    res.json({ 
      success: true, 
      message: '공급업체가 등록되었습니다.',
      cooperationId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 콘텐츠(Contents) 등록 API
app.post('/api/contents', async (req, res) => {
  try {
    const {
      Book_ID,
      Contents_type,
      Contents_name,
      Contents_author,
      Contents_date,
      Contents_state,
      staff_ID
    } = req.body;

    const query = `
      INSERT INTO Contents (
        Book_ID,
        Contents_type,
        Contents_name,
        Contents_author,
        Contents_date,
        Contents_state,
        staff_ID
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      Book_ID,
      Contents_type,
      Contents_name,
      Contents_author,
      Contents_date,
      Contents_state,
      staff_ID
    ]);

    res.json({ 
      success: true, 
      message: '콘텐츠가 등록되었습니다.',
      contentsId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 영상 자료(Media) 등록 API
app.post('/api/media', async (req, res) => {
  try {
    const {
      media_link,
      Book_ID,
      media_date,
      staff_ID
    } = req.body;

    const query = `
      INSERT INTO Media (
        media_link,
        Book_ID,
        media_date,
        staff_ID
      ) VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      media_link,
      Book_ID,
      media_date,
      staff_ID
    ]);

    res.json({ 
      success: true, 
      message: '영상 자료가 등록되었습니다.',
      mediaId: result.insertId 
    });
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