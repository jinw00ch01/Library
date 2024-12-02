# 도서관 관리 시스템

React와 Node.js를 사용한 도서관 관리 시스템입니다.

## 필수 설치 프로그램

1. [Node.js](https://nodejs.org/) (v18.0.0 이상)
2. [MySQL](https://dev.mysql.com/downloads/mysql/) (v8.0 이상)
3. [Git](https://git-scm.com/downloads)

## 시작하기

### 1. 저장소 클론
    ```bash
    git clone [repository-url]
    cd library
    ```

### 2. MySQL 데이터베이스 설정

MySQL 8.0 Command Line Client를 실행하여 다음 명령어를 실행:

```sql
CREATE DATABASE library_db;
USE library_db;
```

`server/sql/Library.sql` 파일의 내용을 MySQL에서 실행하여 테이블을 생성합니다.

### 3. 환경 변수 설정

server 폴더에 `.env` 파일을 생성하고 다음 내용을 입력:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_db
PORT=3001
```

### 4. 서버 설정 및 실행

```bash
# server 폴더로 이동
cd server

# 필요한 패키지 설치
npm install

# 서버 실행
npm run dev
```

### 5. 클라이언트 설정 및 실행

새 터미널을 열고:

```bash
# 프로젝트 루트 폴더에서
npm install

# 클라이언트 실행
npm run dev
```

## 사용된 주요 기술 및 라이브러리

### 프론트엔드
- React 18.3.1
- Ant Design (antd) 5.22.2
- Styled Components 6.1.13
- Axios 1.7.7
- Dayjs 1.11.13

### 백엔드
- Node.js
- Express 4.21.1
- MySQL2 3.11.4
- Cors 2.8.5
- Dotenv 16.4.5

## 주요 기능

1. 회원 관리
   - 고객/직원 회원가입
   - 로그인/로그아웃
   - 회원 정보 수정

2. 도서 관리
   - 도서 등록/수정/삭제
   - 도서 검색
   - 대출/반납 처리

3. 콘텐츠 관리
   - 콘텐츠 등록/수정/삭제
   - 콘텐츠 참여
   - 영상자료 관리

4. 기타 기능
   - 리뷰 작성/관리
   - 연체 관리
   - 공급업체 관리

## 문제 해결

### 데이터베이스 연결 오류
- MySQL 서비스가 실행 중인지 확인
- .env 파일의 데이터베이스 접속 정보가 올바른지 확인
- MySQL 사용자 권한 설정 확인

### 서버 실행 오류
- 포트(3001) 사용 여부 확인
- 필요한 패키지가 모두 설치되었는지 확인

## 라이선스

This project is licensed under the MIT License - see the LICENSE file for details