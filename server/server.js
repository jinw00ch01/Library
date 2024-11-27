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
    await db.query('DELETE FROM Staff WHERE staff_ID = ?', [req.params.id]);
    res.json({ message: '직원 정보가 삭제되었습니다.' });
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

    res.json({ success: true, message: '회원정보가 수정되었습니다.' });
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

    res.json({ success: true, message: '도서 정보가 수정되었��니다.' });
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

// 부서 목록 조회 API
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

// 콘텐츠 목록 조회 API
app.get('/api/contents', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Contents');
    res.json({ success: true, contents: rows });
  } catch (error) {
    console.error('콘텐츠 조회 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// 콘텐츠 정보 수정 API
app.put('/api/contents/:id', async (req, res) => {
  try {
    const contentsId = req.params.id;
    const { Book_ID, Contents_type, Contents_name, Contents_author, Contents_date, Contents_state } = req.body;

    const query = `
      UPDATE Contents
      SET
        Book_ID = ?,
        Contents_type = ?,
        Contents_name = ?,
        Contents_author = ?,
        Contents_date = ?,
        Contents_state = ?
      WHERE Contents_ID = ?
    `;

    await db.query(query, [
      Book_ID,
      Contents_type,
      Contents_name,
      Contents_author,
      Contents_date,
      Contents_state,
      contentsId
    ]);

    res.json({ success: true, message: '콘텐츠 정보가 수정되었습니다.' });
  } catch (error) {
    console.error('콘텐츠 수정 에러:', error);
    res.status(500).json({ error: error.message });
  }
});

// 콘텐츠 삭제 API
app.delete('/api/contents/:id', async (req, res) => {
  try {
    const contentsId = req.params.id;
    await db.query('DELETE FROM Contents WHERE Contents_ID = ?', [contentsId]);
    res.json({ success: true, message: '콘텐츠가 삭제되었습니다.' });
  } catch (error) {
    console.error('콘텐츠 삭제 에러:', error);
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