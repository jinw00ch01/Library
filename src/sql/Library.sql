CREATE TABLE `Book` (
	`Book_ID`	INT	NOT NULL,
	`Book_name`	VARCHAR(255)	NULL,
	`Book_publisher`	VARCHAR(255)	NULL,
	`Book_author`	VARCHAR(255)	NULL,
	`Book_genre`	VARCHAR(255)	NULL,
	`Book_language`	VARCHAR(255)	NULL,
	`Book_ISBN`	CHAR(17)	NULL,
	`Book_pages`	INT	NULL,
	`Book_published_date`	DATE	NULL,
	`Book_description`	VARCHAR(255)	NULL,
	`Book_state`	ENUM('대출중','예약중','연체중','대출가능')	NULL
);

CREATE TABLE `Borrow_log` (
	`Borrow_log_ID`	INT	NOT NULL,
	`borrow_ID`	INT	NOT NULL,
	`Customer_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	`Return_ID`	INT	NOT NULL,
	`ReturnLo_ID`	INT	NOT NULL
);

CREATE TABLE `Customer` (
	`Customer_ID`	INT	NOT NULL,
	`Customer_contact`	CHAR(20)	NULL,
	`Customer_email`	VARCHAR(255)	NULL,
	`Customer_Classification`	ENUM('학생','교수','외부인')	NULL,
	`Customer_Credit`	ENUM('일반','골드','플래티넘','VIP')	NULL,
	`Customer_address`	VARCHAR(255)	NULL,
	`Customer_birthdate`	DATE	NULL,
	`Customer_membership_date`	DATE	NULL,
	`Customer_preferences`	VARCHAR(255)	NULL,
	`Customer_InfoID`	VARCHAR(20)	NULL,
	`Customer_InfoPASSWORD`	VARCHAR(255)	NULL
);

CREATE TABLE`Cust_Cont` (
	`Cust_Cont_ID`	INT	NOT NULL,
	`Customer_ID`	INT	NOT NULL,
	`Contents_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL
);

CREATE TABLE `Cooperation` (
	`Cooperation_ID`	INT	NOT NULL,
	`Cooperation_name`	VARCHAR(255)	NULL,
	`Cooperation_address`	VARCHAR(255)	NULL,
	`Cooperation_pername`	VARCHAR(255)	NULL,
	`Cooperation_number`	CHAR(20)	NULL,
	`Cooperation_classification`	ENUM('출판사','복지관','학교')	NULL
);

CREATE TABLE `Supply` (
	`Supply_ID`	INT	NOT NULL,
	`Cooperation_ID`	INT	NOT NULL,
	`Supply_date`	DATE	NULL,
	`Supply_price`	INT	NULL,
	`staff_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL
);

CREATE TABLE `Return` (
	`Return_ID`	INT	NOT NULL,
	`ReturnLo_ID`	INT	NOT NULL,
	`Return_date`	DATE	NULL,
	`Return_condition`	ENUM('좋음','보통','나쁨')	NULL,
	`staff_ID`	INT	NOT NULL,
	`Customer_ID`	INT	NOT NULL
);

CREATE TABLE `Review` (
	`Review_ID`	INT	NOT NULL,
	`Review_title`	VARCHAR(255)	NULL,
	`Review_rating`	INT	NULL,
	`Review_text`	VARCHAR(255)	NULL,
	`Review_date`	DATE	NULL,
	`Review_upvotes`	INT	NULL,
	`Review_issues`	INT	NULL,
	`staff_ID`	INT	NOT NULL,
	`Customer_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL
);

CREATE TABLE `ReturnLo` (
	`ReturnLo_ID`	INT	NOT NULL,
	`ReturnLo_location`	VARCHAR(255)	NULL,
	`ReturnLo_number`	CHAR(20)	NULL,
	`ReturnLo_capacity`	INT	NULL
);

CREATE TABLE `Media` (
	`media_ID`	INT	NOT NULL,
	`media_link`	VARCHAR(255)	NULL,
	`media_date`	DATE	NULL,
	`Book_ID`	INT	NOT NULL,
	`staff_ID`	INT	NOT NULL
);

CREATE TABLE `Contents` (
	`Contents_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	`Contents_type`	ENUM('콘서트','대회','강연','기타')	NULL,
	`Contents_name`	VARCHAR(255)	NULL,
	`Contents_author`	VARCHAR(255)	NULL,
	`Contents_date`	DATE	NULL,
	`Contents_state`	ENUM('진행전','진행중','진행완료','취소')	NULL,
	`staff_ID`	INT	NOT NULL
);

CREATE TABLE `Reservation` (
	`Reservation_ID`	INT	NOT NULL,
	`Reservation_date`	DATE	NULL,
	`Reservation_number`	INT	NULL,
	`Book_ID`	INT	NOT NULL,
	`Customer_ID`	INT	NOT NULL
);

CREATE TABLE `Overdue` (
	`Overdue_ID`	INT	NOT NULL,
	`Overdue_starttime`	DATE	NULL,
	`Overdue_endtime`	DATE	NULL
);

CREATE TABLE `Staff` (
	`staff_ID`	INT	NOT NULL,
	`staff_name`	VARCHAR(255)	NULL,
	`staff_classification`	ENUM('인턴','사원','대리','과장','부장','사장')	NULL,
	`staff_email`	VARCHAR(255)	NULL,
	`staff_number`	CHAR(20)	NULL,
	`staff_InfoID`	VARCHAR(20)	NULL,
	`staff_InfoPASSWORD`	VARCHAR(255)	NULL,
	`department_ID`	INT	NOT NULL
);

CREATE TABLE `Department` (
	`department_ID`	INT	NOT NULL,
	`department_name`	VARCHAR(20)	NULL,
	`department_classification`	ENUM('콘텐츠운영','행정지원')	NULL,
	`department_location`	VARCHAR(255)	NULL,
	`department_number`	CHAR(20)	NULL
);

CREATE TABLE `Current_status` (
	`Current_Status_ID`	INT	NOT NULL,
	`Borrow_log_ID`	INT	NOT NULL,
	`borrow_ID`	INT	NOT NULL,
	`Customer_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	`Overdue_ID`	INT	NOT NULL
);

CREATE TABLE `Borrow` (
	`borrow_ID`	INT	NOT NULL,
	`Customer_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	`borrow_Date`	DATE	NOT NULL,
	`staff_ID`	INT	NOT NULL
);

ALTER TABLE `Book` ADD CONSTRAINT `PK_BOOK` PRIMARY KEY (
	`Book_ID`
);

ALTER TABLE `Borrow_log` ADD CONSTRAINT `PK_BORROW_LOG` PRIMARY KEY (
	`Borrow_log_ID`,
	`borrow_ID`,
	`Customer_ID`,
	`Book_ID`
);

ALTER TABLE `Customer` ADD CONSTRAINT `PK_CUSTOMER` PRIMARY KEY (
	`Customer_ID`
);

ALTER TABLE `Cust_Cont` ADD CONSTRAINT `PK_CUST_CONT` PRIMARY KEY (
	`Cust_Cont_ID`
);

ALTER TABLE `Cooperation` ADD CONSTRAINT `PK_COOPERATION` PRIMARY KEY (
	`Cooperation_ID`
);

ALTER TABLE `Supply` ADD CONSTRAINT `PK_SUPPLY` PRIMARY KEY (
	`Supply_ID`,
	`Cooperation_ID`
);

ALTER TABLE `Return` ADD CONSTRAINT `PK_RETURN` PRIMARY KEY (
	`Return_ID`,
	`ReturnLo_ID`
);

ALTER TABLE `Review` ADD CONSTRAINT `PK_REVIEW` PRIMARY KEY (
	`Review_ID`
);

ALTER TABLE `ReturnLo` ADD CONSTRAINT `PK_RETURNLO` PRIMARY KEY (
	`ReturnLo_ID`
);

ALTER TABLE `Media` ADD CONSTRAINT `PK_MEDIA` PRIMARY KEY (
	`media_ID`
);

ALTER TABLE `Contents` ADD CONSTRAINT `PK_CONTENTS` PRIMARY KEY (
	`Contents_ID`,
	`Book_ID`
);

ALTER TABLE `Reservation` ADD CONSTRAINT `PK_RESERVATION` PRIMARY KEY (
	`Reservation_ID`
);

ALTER TABLE `Overdue` ADD CONSTRAINT `PK_OVERDUE` PRIMARY KEY (
	`Overdue_ID`
);

ALTER TABLE `Staff` ADD CONSTRAINT `PK_STAFF` PRIMARY KEY (
	`staff_ID`
);

ALTER TABLE `Department` ADD CONSTRAINT `PK_DEPARTMENT` PRIMARY KEY (
	`department_ID`
);

ALTER TABLE `Current_status` ADD CONSTRAINT `PK_CURRENT_STATUS` PRIMARY KEY (
	`Current_Status_ID`,
	`Borrow_log_ID`,
	`borrow_ID`,
	`Customer_ID`,
	`Book_ID`,
	`Overdue_ID`
);

ALTER TABLE `Borrow` ADD CONSTRAINT `PK_BORROW` PRIMARY KEY (
	`borrow_ID`,
	`Customer_ID`,
	`Book_ID`
);

--Foreign Key--

--Borrow_log--
ALTER TABLE `Borrow_log` 
ADD CONSTRAINT `FK_Borrow_TO_Borrow_log_1` FOREIGN KEY (`borrow_ID`) REFERENCES `Borrow` (`borrow_ID`),
ADD CONSTRAINT `FK_Borrow_TO_Borrow_log_2` FOREIGN KEY (`Customer_ID`) REFERENCES `Borrow` (`Customer_ID`),
ADD CONSTRAINT `FK_Borrow_TO_Borrow_log_3` FOREIGN KEY (`Book_ID`) REFERENCES `Borrow` (`Book_ID`);

--Supply--
ALTER TABLE `Supply` 
ADD CONSTRAINT `FK_Cooperation_TO_Supply_1` FOREIGN KEY (`Cooperation_ID`) REFERENCES `Cooperation` (`Cooperation_ID`),
ADD CONSTRAINT `FK_Staff_TO_Supply_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`),
ADD CONSTRAINT `FK_Book_TO_Supply_1` FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`);

--Return--
ALTER TABLE `Return` 
ADD CONSTRAINT `FK_ReturnLo_TO_Return_1` FOREIGN KEY (`ReturnLo_ID`) REFERENCES `ReturnLo` (`ReturnLo_ID`),
ADD CONSTRAINT `FK_Customer_TO_Return_1` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
ADD CONSTRAINT `FK_Staff_TO_Return_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`);

--Contents--
ALTER TABLE `Contents` 
ADD CONSTRAINT `FK_Book_TO_Contents_1` FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`),
ADD CONSTRAINT `FK_Staff_TO_Contents_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`);

--Current_status--
ALTER TABLE `Current_status` 
ADD CONSTRAINT `FK_Borrow_log_TO_Current_status_1` FOREIGN KEY (`Borrow_log_ID`) REFERENCES `Borrow_log` (`Borrow_log_ID`),
ADD CONSTRAINT `FK_Borrow_log_TO_Current_status_2` FOREIGN KEY (`borrow_ID`) REFERENCES `Borrow_log` (`borrow_ID`),
ADD CONSTRAINT `FK_Borrow_log_TO_Current_status_3` FOREIGN KEY (`Customer_ID`) REFERENCES `Borrow_log` (`Customer_ID`),
ADD CONSTRAINT `FK_Borrow_log_TO_Current_status_4` FOREIGN KEY (`Book_ID`) REFERENCES `Borrow_log` (`Book_ID`),
ADD CONSTRAINT `FK_Overdue_TO_Current_status_1` FOREIGN KEY (`Overdue_ID`) REFERENCES `Overdue` (`Overdue_ID`);

--Borrow--
ALTER TABLE `Borrow` 
ADD CONSTRAINT `FK_Customer_TO_Borrow_1` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
ADD CONSTRAINT `FK_Book_TO_Borrow_1` FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`),
ADD CONSTRAINT `FK_Staff_TO_Borrow_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`);

--Review--
ALTER TABLE `Review` 
ADD CONSTRAINT `FK_Staff_TO_Review_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`),
ADD CONSTRAINT `FK_Customer_TO_Review_1` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
ADD CONSTRAINT `FK_Book_TO_Review_1` FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`);

--Media--
ALTER TABLE `Media` 
ADD CONSTRAINT `FK_Staff_TO_Media_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`),
ADD CONSTRAINT `FK_Book_TO_Media_1` FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`);

--Staff--
ALTER TABLE `Staff` 
ADD CONSTRAINT `FK_Department_TO_Staff_1` FOREIGN KEY (`department_ID`) REFERENCES `Department` (`department_ID`);

--Cust_Cont--
ALTER TABLE `Cust_Cont` 
ADD CONSTRAINT `FK_Customer_TO_Cust_Cont_1` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
ADD CONSTRAINT `FK_Contents_TO_Cust_Cont_1` FOREIGN KEY (`Contents_ID`) REFERENCES `Contents` (`Contents_ID`);
ADD CONSTRAINT `FK_Book_TO_Cust_Cont_1` FOREIGN KEY (`Book_ID`) REFERENCES `Contents` (`Book_ID`);


