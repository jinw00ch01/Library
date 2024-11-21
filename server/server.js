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

// 회원가입 API 엔드포인트
app.post('/api/signup', async (req, res) => {
  try {
    const {
      contact,
      email,
      classification,
      address,
      birthdate,
      preferences,
      infoId,
      password
    } = req.body;

    const query = `
      INSERT INTO Customer (
        Customer_contact,
        Customer_email,
        Customer_Classification,
        Customer_Credit,
        Customer_address,
        Customer_birthdate,
        Customer_membership_date,
        Customer_preferences,
        Customer_InfoID,
        Customer_InfoPASSWORD
      ) VALUES (?, ?, ?, '일반', ?, ?, CURDATE(), ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      contact,
      email,
      classification,
      address,
      birthdate,
      preferences,
      infoId,
      password
    ]);

    res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 