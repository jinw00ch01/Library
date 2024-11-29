const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// 로그인한 사용자 정보를 req.user에 추가하는 미들웨어
app.use((req, res, next) => {
  req.user = {
    id: req.headers['x-user-id'],
    type: req.headers['x-user-type'],
  };
  next();
});

// 도서 목록 조회 API
app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Book');
    res.json({ success: true, books: rows });
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
      name,
      contact,
      email,
      classification,
      address,
      birthdate,
      preferences
    } = req.body;

    const query = `
      INSERT INTO Customer (
        Customer_InfoID,
        Customer_InfoPASSWORD,
        Customer_name,
        Customer_contact,
        Customer_email,
        Customer_Classification,
        Customer_address,
        Customer_birthdate,
        Customer_membership_date,
        Customer_preferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)
    `;

    await db.query(query, [
      infoId,
      password,
      name,
      contact,
      email,
      classification,
      address,
      birthdate,
      preferences
    ]);

    res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      SELECT 
        Customer_ID,
        Customer_name,
        Customer_InfoID,
        Customer_contact,
        Customer_email,
        Customer_Classification,
        Customer_Credit,
        Customer_address,
        Customer_birthdate,
        Customer_membership_date
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
        name: rows[0].Customer_name,
        ...rows[0]
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
      SELECT * 
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
        classification: rows[0].staff_classification,
        name: rows[0].staff_name
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
        Customer_ID,
        Customer_name,
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
    
    res.json({ 
      success: true, 
      userInfo: rows[0] 
    });
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
        s.staff_ID,
        s.staff_name,
        s.staff_InfoID,
        s.staff_number,
        s.staff_email,
        s.staff_classification,
        s.department_ID,
        d.department_name
      FROM Staff s 
      JOIN Department d ON s.department_ID = d.department_ID 
      WHERE s.staff_ID = ?
    `;
    const [rows] = await db.query(query, [staffId]);
    if (rows.length > 0) {
      res.json({ 
        success: true, 
        userInfo: rows[0] 
      });
    } else {
      res.status(404).json({ error: '직원 정보를 찾을 수 없습니다.' });
    }
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
        staff_name = ?,
        staff_number = ?,
        staff_email = ?,
        staff_classification = ?,
        department_ID = ?
      WHERE staff_ID = ?
    `;

    await db.query(query, [
      updateData.staff_name,
      updateData.staff_number,
      updateData.staff_email,
      updateData.staff_classification,
      updateData.department_ID,
      staffId,
    ]);

    res.json({ success: true, message: '직원 정보가 수정되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 직원 정보 삭제 API
app.delete('/api/staff/:id', async (req, res) => {
  try {
    const staffId = req.params.id;
    await db.query('DELETE FROM Staff WHERE staff_ID = ?', [staffId]);
    res.json({ success: true, message: '직원 정보가 삭제되었습니다.' });
  } catch (error) {
    console.error('직원 탈퇴 중 오류 발생:', error);
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
        Customer_name = ?,
        Customer_contact = ?,
        Customer_email = ?,
        Customer_Classification = ?,
        Customer_address = ?,
        Customer_birthdate = ?
      WHERE Customer_ID = ?
    `;

    await db.query(query, [
      updateData.Customer_name,
      updateData.Customer_contact,
      updateData.Customer_email,
      updateData.Customer_Classification,
      updateData.Customer_address,
      updateData.Customer_birthdate,
      customerId,
    ]);

    res.json({ success: true, message: '회원정보가 정되었습니다.' });
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
    console.error('고객 탈퇴 중 오류 발생:', error);
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
    console.error('직원 탈퇴 중 오류 발생:', error);
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

    // 받은 데이터 확인
    console.log('받은 데이터:', req.body);

    const query = `
      INSERT INTO Cooperation (
        Cooperation_name,
        Cooperation_address,
        Cooperation_pername,
        Cooperation_number,
        Cooperation_classification
      ) VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      Cooperation_name,
      Cooperation_address,
      Cooperation_pername,
      Cooperation_number,
      Cooperation_classification
    ]);

    res.json({ 
      success: true, 
      message: '공급업체가 등록되었습니다.'
    });
  } catch (error) {
    console.error('공급업체 등록 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// 콘텐츠 등록 API
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
      INSERT INTO Contents 
      (Book_ID, Contents_type, Contents_name, Contents_author, Contents_date, Contents_state, staff_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      Book_ID,
      Contents_type,
      Contents_name,
      Contents_author,
      Contents_date,
      Contents_state,
      staff_ID
    ]);

    res.json({ success: true, message: '콘텐츠가 등록되었습니다.' });
  } catch (error) {
    console.error('콘텐츠 등록 에러:', error);
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

// 모든 도서의 간략 정보 조회 API
app.get('/api/books/summary', async (req, res) => {
  try {
    const query = `
      SELECT Book_ID, Book_name, Book_state
      FROM Book
    `;
    const [rows] = await db.query(query);
    res.json({ success: true, books: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 도서의 상세 정보 조회 API
app.get('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const query = `
      SELECT *
      FROM Book
      WHERE Book_ID = ?
    `;
    const [rows] = await db.query(query, [bookId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: '도서를 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, book: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 도서 정보 수정 API
app.put('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const updateData = req.body;
    
    const query = `
      UPDATE Book 
      SET 
        Book_name = ?,
        Book_publisher = ?,
        Book_author = ?,
        Book_genre = ?,
        Book_language = ?,
        Book_ISBN = ?,
        Book_pages = ?,
        Book_published_date = ?,
        Book_description = ?,
        Book_state = ?
      WHERE Book_ID = ?
    `;

    await db.query(query, [
      updateData.Book_name,
      updateData.Book_publisher,
      updateData.Book_author,
      updateData.Book_genre,
      updateData.Book_language,
      updateData.Book_ISBN,
      updateData.Book_pages,
      updateData.Book_published_date,
      updateData.Book_description,
      updateData.Book_state,
      bookId
    ]);

    res.json({ success: true, message: '도서 정보가 수정되었니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 도서 삭제 API
app.delete('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const query = 'DELETE FROM Book WHERE Book_ID = ?';
    await db.query(query, [bookId]);
    res.json({ success: true, message: '도서가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 부서 목록 회 API
app.get('/api/departments', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Department');
    res.json({ success: true, departments: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 부서 정보 수정 API
app.put('/api/departments/:id', async (req, res) => {
  try {
    const departmentId = req.params.id;
    const { department_name, department_classification, department_location, department_number } = req.body;

    const query = `
      UPDATE Department
      SET
        department_name = ?,
        department_classification = ?,
        department_location = ?,
        department_number = ?
      WHERE department_ID = ?
    `;

    await db.query(query, [
      department_name,
      department_classification,
      department_location,
      department_number,
      departmentId
    ]);

    res.json({ success: true, message: '부서 정보가 수정되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 부서 삭제 API
app.delete('/api/departments/:id', async (req, res) => {
  try {
    const departmentId = req.params.id;
    await db.query('DELETE FROM Department WHERE department_ID = ?', [departmentId]);
    res.json({ success: true, message: '부서가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 반납장소 목록 조회 API
app.get('/api/returnLocations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ReturnLo');
    res.json({ success: true, returnLocations: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 반납장소 정보 수정 API
app.put('/api/returnLocations/:id', async (req, res) => {
  try {
    const locationId = req.params.id;
    const { ReturnLo_location, ReturnLo_number, ReturnLo_capacity } = req.body;

    const query = `
      UPDATE ReturnLo
      SET
        ReturnLo_location = ?,
        ReturnLo_number = ?,
        ReturnLo_capacity = ?
      WHERE ReturnLo_ID = ?
    `;

    await db.query(query, [
      ReturnLo_location,
      ReturnLo_number,
      ReturnLo_capacity,
      locationId
    ]);

    res.json({ success: true, message: '반납장소 정보가 수정되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 반납장소 삭제 API
app.delete('/api/returnLocations/:id', async (req, res) => {
  try {
    const locationId = req.params.id;
    await db.query('DELETE FROM ReturnLo WHERE ReturnLo_ID = ?', [locationId]);
    res.json({ success: true, message: '반납장소가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 공급업체 목록 조회 API
app.get('/api/cooperations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Cooperation');
    res.json({ success: true, cooperations: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 공급업체 정보 수정 API
app.put('/api/cooperations/:id', async (req, res) => {
  try {
    const cooperationId = req.params.id;
    const { Cooperation_name, Cooperation_address, Cooperation_pername, Cooperation_number, Cooperation_classification } = req.body;

    const query = `
      UPDATE Cooperation
      SET
        Cooperation_name = ?,
        Cooperation_address = ?,
        Cooperation_pername = ?,
        Cooperation_number = ?,
        Cooperation_classification = ?
      WHERE Cooperation_ID = ?
    `;

    await db.query(query, [
      Cooperation_name,
      Cooperation_address,
      Cooperation_pername,
      Cooperation_number,
      Cooperation_classification,
      cooperationId
    ]);

    res.json({ success: true, message: '공급업체 정보가 수정되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 공급업체 삭제 API
app.delete('/api/cooperations/:id', async (req, res) => {
  try {
    const cooperationId = req.params.id;
    await db.query('DELETE FROM Cooperation WHERE Cooperation_ID = ?', [cooperationId]);
    res.json({ success: true, message: '공급업체가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 공급명세 등록 API
app.post('/api/supply', async (req, res) => {
  try {
    const {
      Department_ID,
      Supply_date,
      Supply_price,
      Book_ID,
      staff_ID
    } = req.body;

    const query = `
      INSERT INTO Supply 
      (Department_ID, Supply_date, Supply_price, Book_ID, staff_ID)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      Department_ID,
      Supply_date,
      Supply_price,
      Book_ID,
      staff_ID
    ]);

    res.json({ success: true, message: '공급명세가 등록되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 공급명세 목록 조회 API
app.get('/api/supplies', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Supply');
    res.json({ success: true, supplies: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 공급명세 정보 수정 API
app.put('/api/supplies/:id', async (req, res) => {
  try {
    const supplyId = req.params.id;
    const { Department_ID, Supply_date, Supply_price, Book_ID } = req.body;

    const query = `
      UPDATE Supply
      SET
        Department_ID = ?,
        Supply_date = ?,
        Supply_price = ?,
        Book_ID = ?
      WHERE Supply_ID = ?
    `;

    await db.query(query, [
      Department_ID,
      Supply_date,
      Supply_price,
      Book_ID,
      supplyId
    ]);

    res.json({ success: true, message: '공급명세 정보가 수정되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 공급명세 삭제 API
app.delete('/api/supplies/:id', async (req, res) => {
  try {
    const supplyId = req.params.id;
    await db.query('DELETE FROM Supply WHERE Supply_ID = ?', [supplyId]);
    res.json({ success: true, message: '공급명세가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 콘텐츠 목록 조회 API 수정 (콘텐츠와 도서 인)
app.get('/api/contents', async (req, res) => {
  try {
    const query = `
      SELECT c.*, b.Book_name
      FROM Contents c
      JOIN Book b ON c.Book_ID = b.Book_ID
    `;
    const [rows] = await db.query(query);
    res.json({ success: true, contents: rows });
  } catch (error) {
    console.error('콘텐츠 조회 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// 콘텐츠 참여 API
app.post('/api/contents/:id/participate', async (req, res) => {
  try {
    if (!req.user || req.user.type !== 'customer') {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }
    const contentsId = req.params.id;
    const customerId = Number(req.user.id);

    // 콘텐츠 상태 확인
    const [contentsRows] = await db.query(
      'SELECT Contents_state, Book_ID FROM Contents WHERE Contents_ID = ?',
      [contentsId]
    );
    if (contentsRows.length === 0) {
      return res.status(404).json({ error: '콘텐츠를 찾을 수 없습니다.' });
    }
    const { Contents_state, Book_ID } = contentsRows[0];
    if (Contents_state !== '진행전') {
      return res.status(400).json({ error: '참여할 수 없는 상태의 콘텐츠입니다.' });
    }

    // 이미 참여했는지 확인
    const [existing] = await db.query(
      'SELECT * FROM Cust_Cont WHERE Customer_ID = ? AND Contents_ID = ?',
      [customerId, contentsId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: '이미 참여한 콘텐츠입니다.' });
    }

    // 참여 기록 생성
    await db.query(
      'INSERT INTO Cust_Cont (Customer_ID, Contents_ID, Book_ID) VALUES (?, ?, ?)',
      [customerId, contentsId, Book_ID]
    );

    res.json({ success: true, message: '콘텐츠에 참여하였습니다.' });
  } catch (error) {
    console.error('콘텐츠 참여 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// 고객의 콘텐츠 참여 내역 조회 API
app.get('/api/customers/:id/participations', async (req, res) => {
  try {
    const customerId = req.params.id;

    const query = `
      SELECT cc.*, c.Contents_name, b.Book_name
      FROM Cust_Cont cc
      JOIN Contents c ON cc.Contents_ID = c.Contents_ID
      JOIN Book b ON cc.Book_ID = b.Book_ID
      WHERE cc.Customer_ID = ?
    `;
    const [rows] = await db.query(query, [customerId]);

    res.json({ success: true, participations: rows });
  } catch (error) {
    console.error('참여 내역 조회 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// 콘텐츠 참여 취소 API
app.delete('/api/customers/:customerId/participations/:contentsId', async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const contentsId = req.params.contentsId;

    await db.query(
      'DELETE FROM Cust_Cont WHERE Customer_ID = ? AND Contents_ID = ?',
      [customerId, contentsId]
    );

    res.json({ success: true, message: '참여가 취소되었습니다.' });
  } catch (error) {
    console.error('참여 취소 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// URL 변환 함수
const convertToEmbedUrl = (url) => {
  const videoId = url.split('v=')[1];
  return `https://www.youtube.com/embed/${videoId}`;
};

// 영상자료 목록 조회 API 수정
app.get('/api/medias', async (req, res) => {
  try {
    const query = `
      SELECT m.*, b.Book_name
      FROM Media m
      JOIN Book b ON m.Book_ID = b.Book_ID
    `;
    const [rows] = await db.query(query);
    // URL 변환 적용
    const mediasWithEmbedUrl = rows.map(media => ({
      ...media,
      media_link: convertToEmbedUrl(media.media_link)
    }));
    res.json({ success: true, medias: mediasWithEmbedUrl });
  } catch (error) {
    console.error('영상자료 조회 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// 특정 도서의 영상자료 조회 API
app.get('/api/medias/book/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const query = `
      SELECT * FROM Media WHERE Book_ID = ?
    `;
    const [rows] = await db.query(query, [bookId]);
    res.json({ success: true, medias: rows });
  } catch (error) {
    console.error('영상자료 조회 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// 대출 처리 API
app.post('/api/borrow', async (req, res) => {
  try {
    const { Customer_ID, Book_ID, staff_ID } = req.body;

    // 현재 시간을 borrow_Date로 사용
    const borrow_Date = new Date();

    // Borrow 테이블에 새로운 레코드 추가
    const query = `
      INSERT INTO Borrow (Customer_ID, Book_ID, borrow_Date, staff_ID)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [Customer_ID, Book_ID, borrow_Date, staff_ID]);
    const borrow_ID = result.insertId;

    // Borrow_log에 데이터 추가
    const borrowLogQuery = `
      INSERT INTO Borrow_log (borrow_ID, Customer_ID, Book_ID, Return_ID, ReturnLo_ID)
      VALUES (?, ?, ?, NULL, NULL)
    `;
    await db.query(borrowLogQuery, [borrow_ID, Customer_ID, Book_ID]);

    // 해당 도서의 상태를 '대출중'으로 업데이트
    const updateBookQuery = `
      UPDATE Book
      SET Book_state = '대출중'
      WHERE Book_ID = ?
    `;
    await db.query(updateBookQuery, [Book_ID]);

    res.json({ success: true, message: '대출 처리가 완료되었습니다.' });
  } catch (error) {
    console.error('대출 처리 중 오류 발생:', error);
    res.status(500).json({ error: error.message });
  }
});

// 고객 대출 내역 조회 API
app.get('/api/borrow-log/:customerId', async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const query = `
      SELECT 
        Borrow_log_ID, 
        Book_ID, 
        IF(Return_ID IS NULL, '아니오', '예') AS Return_Status
      FROM Borrow_log
      WHERE Customer_ID = ?
    `;

    const [rows] = await db.query(query, [customerId]);

    res.json({ success: true, loans: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 반납 처리 API
app.post('/api/return', async (req, res) => {
  try {
    const { ReturnLo_ID, Customer_ID, Return_condition, staff_ID, Book_ID } = req.body;

    // 현재 시간을 Return_date로 사용
    const Return_date = new Date();

    // Return 테이블에 새로운 레코드 추가
    const insertReturnQuery = `
      INSERT INTO \`Return\` (ReturnLo_ID, Return_date, Return_condition, staff_ID, Customer_ID, Book_ID)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(insertReturnQuery, [
      ReturnLo_ID,
      Return_date,
      Return_condition,
      staff_ID,
      Customer_ID,
      Book_ID
    ]);

    const Return_ID = result.insertId;

    // Borrow_log에서 해당 고객의 반납되지 않은 대출 기록 가져오기
    const selectBorrowLogQuery = `
      SELECT Borrow_log_ID
      FROM Borrow_log
      WHERE Customer_ID = ? AND Book_ID = ? AND Return_ID IS NULL
      ORDER BY Borrow_log_ID DESC
      LIMIT 1
    `;

    const [borrowLogRows] = await db.query(selectBorrowLogQuery, [Customer_ID, Book_ID]);

    if (borrowLogRows.length === 0) {
      return res.status(400).json({ error: '반납 가능한 대출 기록이 없습니다.' });
    }

    const { Borrow_log_ID } = borrowLogRows[0];

    // Borrow_log 업데이트 (Return_ID, ReturnLo_ID)
    const updateBorrowLogQuery = `
      UPDATE Borrow_log
      SET Return_ID = ?, ReturnLo_ID = ?
      WHERE Borrow_log_ID = ?
    `;

    await db.query(updateBorrowLogQuery, [Return_ID, ReturnLo_ID, Borrow_log_ID]);

    // Book 상태를 '대출가능'으로 변경
    const updateBookQuery = `
      UPDATE Book
      SET Book_state = '대출가능'
      WHERE Book_ID = ?
    `;

    await db.query(updateBookQuery, [Book_ID]);

    res.json({ success: true, message: '반납 처리가 완료되었습니다.' });

  } catch (error) {
    console.error('반납 처리 중 오류 발생:', error);
    res.status(500).json({ error: error.message });
  }
});

// 특정 도서의 리뷰 목록 조회 API 수정
app.get('/api/books/:id/reviews', async (req, res) => {
  try {
    const bookId = req.params.id;
    const customerId = req.user?.id || 0;

    const reviewQuery = `
      SELECT r.*, c.Customer_name,
             r.Customer_ID = ? AS isOwn,
             r.isBlinded
      FROM Review r
      JOIN Customer c ON r.Customer_ID = c.Customer_ID
      WHERE r.Book_ID = ?
    `;
    const [reviews] = await db.query(reviewQuery, [customerId, bookId]);

    // 사용자가 이미 추천한 리뷰 ID 목록 가져오기
    const upvoteQuery = `
      SELECT Review_ID FROM ReviewUpvotes WHERE Customer_ID = ?
    `;
    const [upvotes] = await db.query(upvoteQuery, [customerId]);
    const upvoteIds = upvotes.map((u) => u.Review_ID);

    // 사용자가 이미 신고한 리 ID 목록 가져오기
    const reportQuery = `
      SELECT Review_ID FROM ReviewReports WHERE Customer_ID = ?
    `;
    const [reports] = await db.query(reportQuery, [customerId]);
    const reportIds = reports.map((r) => r.Review_ID);

    res.json({
      success: true,
      reviews,
      upvotes: upvoteIds,
      reports: reportIds,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 리뷰 추천 API 수정
app.post('/api/reviews/:id/upvote', async (req, res) => {
  try {
    if (!req.user || req.user.type !== 'customer') {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const reviewId = req.params.id;
    const customerId = req.user.id;

    // 이미 추천했는지 확인
    const [existing] = await db.query(
      'SELECT * FROM ReviewUpvotes WHERE Review_ID = ? AND Customer_ID = ?',
      [reviewId, customerId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: '이미 추천한 리뷰입니다.' });
    }

    // 본인 리뷰인지 확인
    const [reviewRows] = await db.query(
      'SELECT Customer_ID FROM Review WHERE Review_ID = ?',
      [reviewId]
    );
    if (reviewRows.length === 0) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    }
    if (reviewRows[0].Customer_ID === customerId) {
      return res.status(400).json({ error: '본인 리뷰는 추천할 수 없습니다.' });
    }

    // 추천 기록 추가
    await db.query(
      'INSERT INTO ReviewUpvotes (Review_ID, Customer_ID) VALUES (?, ?)',
      [reviewId, customerId]
    );

    // 리뷰의 추천수 증가
    await db.query(
      'UPDATE Review SET Review_upvotes = Review_upvotes + 1 WHERE Review_ID = ?',
      [reviewId]
    );

    res.json({ success: true, message: '추천이 반영되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 리뷰 신고 API 수정
app.post('/api/reviews/:id/report', async (req, res) => {
  try {
    if (!req.user || req.user.type !== 'customer') {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const reviewId = req.params.id;
    const customerId = req.user.id;

    // 이미 신고했는지 확인
    const [existing] = await db.query(
      'SELECT * FROM ReviewReports WHERE Review_ID = ? AND Customer_ID = ?',
      [reviewId, customerId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: '이미 신고한 리뷰입니다.' });
    }

    // 본인 리뷰인지 확인
    const [reviewRows] = await db.query(
      'SELECT Customer_ID FROM Review WHERE Review_ID = ?',
      [reviewId]
    );
    if (reviewRows.length === 0) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    }
    if (reviewRows[0].Customer_ID === customerId) {
      return res.status(400).json({ error: '본인 리뷰는 신고할 수 없습니다.' });
    }

    // 신고 기록 추가
    await db.query(
      'INSERT INTO ReviewReports (Review_ID, Customer_ID) VALUES (?, ?)',
      [reviewId, customerId]
    );

    // 리뷰의 신고수 증가
    await db.query(
      'UPDATE Review SET Review_issues = Review_issues + 1 WHERE Review_ID = ?',
      [reviewId]
    );

    res.json({ success: true, message: '신고가 접수되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 리뷰 신고 관리 API (직원용)
app.get('/api/reviews/reported', async (req, res) => {
  try {
    if (!req.user || req.user.type !== 'staff') {
      return res.status(401).json({ error: '권한이 없습니다.' });
    }

    const query = `
      SELECT r.*, c.Customer_name
      FROM Review r
      JOIN Customer c ON r.Customer_ID = c.Customer_ID
      WHERE r.Review_issues >= 1
      ORDER BY r.Review_issues DESC
    `;
    const [reviews] = await db.query(query);

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 리뷰 삭제 API (본인 리뷰 삭제)
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    if (!req.user || req.user.type !== 'customer') {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const reviewId = req.params.id;
    const customerId = Number(req.user.id); // 사용자 ID를 숫자로 변환

    // 본인 리뷰인지 확인
    const [reviewRows] = await db.query(
      'SELECT Customer_ID FROM Review WHERE Review_ID = ?',
      [reviewId]
    );
    if (reviewRows.length === 0) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    }
    const reviewCustomerId = reviewRows[0].Customer_ID;

    if (reviewCustomerId !== customerId) {
      return res.status(403).json({ error: '자신의 리뷰만 삭제할 수 있습니다.' });
    }

    await db.query('DELETE FROM Review WHERE Review_ID = ?', [reviewId]);

    res.json({ success: true, message: '리뷰가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 리뷰 수정 API (본인 리뷰 수정)
app.put('/api/reviews/:id', async (req, res) => {
  try {
    if (!req.user || req.user.type !== 'customer') {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const reviewId = req.params.id;
    const customerId = Number(req.user.id); // 사용자 ID를 숫자로 변환
    const { Review_title, Review_rating, Review_text } = req.body;

    // 본인 리뷰인지 확인
    const [reviewRows] = await db.query(
      'SELECT Customer_ID FROM Review WHERE Review_ID = ?',
      [reviewId]
    );
    if (reviewRows.length === 0) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    }
    const reviewCustomerId = reviewRows[0].Customer_ID;

    if (reviewCustomerId !== customerId) {
      return res.status(403).json({ error: '자신의 리뷰만 수정할 수 없습니다.' });
    }

    await db.query(
      'UPDATE Review SET Review_title = ?, Review_rating = ?, Review_text = ? WHERE Review_ID = ?',
      [Review_title, Review_rating, Review_text, reviewId]
    );

    res.json({ success: true, message: '리뷰가 수정되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 리뷰 블라인드 처리 API (직원용)
app.post('/api/reviews/:id/blind', async (req, res) => {
  try {
    if (!req.user || req.user.type !== 'staff') {
      return res.status(401).json({ error: '권한이 없습니다.' });
    }

    const reviewId = req.params.id;

    // 원본 리뷰 저장 (Undo를 위해)
    const [originalReview] = await db.query(
      'SELECT Review_title, Review_text FROM Review WHERE Review_ID = ?',
      [reviewId]
    );
    if (originalReview.length === 0) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    }

    const { Review_title, Review_text } = originalReview[0];

    // 블라인드 처리
    await db.query(
      'UPDATE Review SET Review_title = "블라인드 처리", Review_text = "신고수 누적으로 인해 블라인드 처리되었습니다", isBlinded = 1, Original_title = ?, Original_text = ? WHERE Review_ID = ?',
      [Review_title, Review_text, reviewId]
    );

    res.json({ success: true, message: '리뷰가 블라인드 처리되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 리뷰 블라인드 해제 API (직원용)
app.post('/api/reviews/:id/unblind', async (req, res) => {
  try {
    if (!req.user || req.user.type !== 'staff') {
      return res.status(401).json({ error: '권한이 없습니다.' });
    }

    const reviewId = req.params.id;

    // 원��� 리뷰 복원
    await db.query(
      'UPDATE Review SET Review_title = Original_title, Review_text = Original_text, isBlinded = 0, Original_title = NULL, Original_text = NULL WHERE Review_ID = ?',
      [reviewId]
    );

    res.json({ success: true, message: '리뷰가 블라인드 해제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 리뷰 작성 API
app.post('/api/books/:id/reviews', async (req, res) => {
  try {
    if (!req.user || req.user.type !== 'customer') {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const bookId = req.params.id;
    const customerId = Number(req.user.id);
    const {
      Review_title,
      Review_rating,
      Review_text
    } = req.body;

    const query = `
      INSERT INTO Review (
        Review_title,
        Review_rating,
        Review_text,
        Review_date,
        Review_upvotes,
        Review_issues,
        staff_ID,
        Customer_ID,
        Book_ID,
        isBlinded
      ) VALUES (?, ?, ?, CURDATE(), 0, 0, NULL, ?, ?, 0)
    `;

    await db.query(query, [
      Review_title,
      Review_rating,
      Review_text,
      customerId,
      bookId
    ]);

    res.json({ success: true, message: '리뷰가 등록되었습니다.' });
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