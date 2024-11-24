# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


1. MySQL 데이터베이스 설정(MySQL 8.0 command line client)
CREATE DATABASE library_db;
USE library_db;

2. 서버 측 실행
cd server
npm install
npm run dev

3. 클라이언트 측 실행 (새 터미널에서)
npm install
npm run dev

ALTER TABLE Customer MODIFY COLUMN Customer_Classification VARCHAR(10);
ALTER TABLE 테이블명 MODIFY COLUMN 속성명 타입(타입값);

`staff_classification`	VARCHAR(10)	NULL

`department_ID`	INT	NOT NULL AUTO_INCREMENT

`staff_classification`	VARCHAR(10)	NULL

DESC `return`;