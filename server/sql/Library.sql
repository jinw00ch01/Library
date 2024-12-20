﻿CREATE TABLE `Department` (
	`department_ID`	INT	NOT NULL AUTO_INCREMENT,
	`department_name`	VARCHAR(20)	NULL,
	`department_classification`	VARCHAR(10) NULL,
	`department_location`	VARCHAR(255)	NULL,
	`department_number`	CHAR(20)	NULL,
	PRIMARY KEY (`department_ID`)
);

CREATE TABLE `Staff` (
	`staff_ID`	INT	NOT NULL AUTO_INCREMENT,
	`staff_name`	VARCHAR(255)	NULL,
	`staff_classification`	VARCHAR(10)	NULL,
	`staff_email`	VARCHAR(255)	NULL,
	`staff_number`	CHAR(20)	NULL,
	`staff_InfoID`	VARCHAR(20)	NULL,
	`staff_InfoPASSWORD`	VARCHAR(255)	NULL,
	`department_ID`	INT	NOT NULL,
	PRIMARY KEY (`staff_ID`),
	INDEX `idx_department_id` (`department_ID`),
	FOREIGN KEY (`department_ID`) REFERENCES `Department` (`department_ID`)
);

CREATE TABLE `Book` (
	`Book_ID`	INT	NOT NULL AUTO_INCREMENT,
	`Book_name`	VARCHAR(255)	NULL,
	`Book_publisher`	VARCHAR(255)	NULL,
	`Book_author`	VARCHAR(255)	NULL,
	`Book_genre`	VARCHAR(255)	NULL,
	`Book_language`	VARCHAR(255)	NULL,
	`Book_ISBN`	CHAR(17)	NULL,
	`Book_pages`	INT	NULL,
	`Book_published_date`	DATE	NULL,
	`Book_description`	VARCHAR(255)	NULL,
	`Book_state`	VARCHAR(10)	NULL,
	PRIMARY KEY (`Book_ID`)
);

CREATE TABLE `Customer` (
	`Customer_ID`	INT	NOT NULL AUTO_INCREMENT,
	`Customer_name`	VARCHAR(50)	NULL,
	`Customer_InfoID`	VARCHAR(20)	NULL,
	`Customer_InfoPASSWORD`	VARCHAR(255)	NULL,
	`Customer_contact`	CHAR(20)	NULL,
	`Customer_email`	VARCHAR(255)	NULL,
	`Customer_Classification`	VARCHAR(10)	NULL,
	`Customer_Credit`	VARCHAR(10)	DEFAULT '일반',
	`Customer_address`	VARCHAR(255)	NULL,
	`Customer_birthdate`	DATE	NULL,
	`Customer_membership_date`	DATETIME NULL,
	`Customer_preferences`	VARCHAR(255)	NULL,
	PRIMARY KEY (`Customer_ID`)
);

CREATE TABLE `Borrow` (
	`borrow_ID`	INT	NOT NULL AUTO_INCREMENT,
	`Customer_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	`borrow_Date`	DATETIME NOT NULL,
	`staff_ID`	INT	NOT NULL,
	PRIMARY KEY (`borrow_ID`, `Customer_ID`, `Book_ID`),
	INDEX `idx_customer` (`Customer_ID`),
	INDEX `idx_book` (`Book_ID`),
	INDEX `idx_staff` (`staff_ID`),
	FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
	FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`),
	FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`)
);

CREATE TABLE `Borrow_log` (
	`Borrow_log_ID`	INT	NOT NULL AUTO_INCREMENT,
	`borrow_ID`	INT	NOT NULL,
	`Customer_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	`Return_ID`	INT	NULL,
	`ReturnLo_ID`	INT	NULL
);

CREATE TABLE `Cust_Cont` (
	`Cust_Cont_ID`	INT	NOT NULL AUTO_INCREMENT,
	`Customer_ID`	INT	NOT NULL,
	`Contents_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	PRIMARY KEY (`Cust_Cont_ID`),
	FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
	FOREIGN KEY (`Contents_ID`) REFERENCES `Contents` (`Contents_ID`),
	FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`)
);

CREATE TABLE `Cooperation` (
	`Cooperation_ID`	INT	NOT NULL AUTO_INCREMENT,
	`Cooperation_name`	VARCHAR(255)	NULL,
	`Cooperation_address`	VARCHAR(255)	NULL,
	`Cooperation_pername`	VARCHAR(255)	NULL,
	`Cooperation_number`	VARCHAR(30)	NULL,
	`Cooperation_classification`	VARCHAR(10)	NULL
);

CREATE TABLE `Supply` (
	`Supply_ID`	INT	NOT NULL AUTO_INCREMENT,
	`Department_ID`	INT	NOT NULL,
	`Supply_date`	DATETIME NOT NULL,
	`Supply_price`	DECIMAL(10, 2)	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	`staff_ID`	INT	NOT NULL,
	PRIMARY KEY (`Supply_ID`),
	FOREIGN KEY (`Department_ID`) REFERENCES `Department`(`department_ID`),
	FOREIGN KEY (`Book_ID`) REFERENCES `Book`(`Book_ID`),
	FOREIGN KEY (`staff_ID`) REFERENCES `Staff`(`staff_ID`)
);

CREATE TABLE `Return` (
	`Return_ID`	INT	NOT NULL AUTO_INCREMENT,
	`ReturnLo_ID`	INT	NOT NULL,
	`Return_date`	DATETIME NULL,
	`Return_condition`	VARCHAR(10)	NULL,
	`staff_ID`	INT	NOT NULL,
	`Customer_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	PRIMARY KEY (`Return_ID`),
	FOREIGN KEY (`ReturnLo_ID`) REFERENCES `ReturnLo` (`ReturnLo_ID`),
	FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`),
	FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
	FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`)
);

CREATE TABLE `Review` (
	`Review_ID`	INT	NOT NULL AUTO_INCREMENT,
	`Review_title`	VARCHAR(255)	NULL,
	`Review_rating`	INT	NULL,
	`Review_text`	VARCHAR(255)	NULL,
	`Review_date`	DATETIME NULL,
	`Review_upvotes`	INT	DEFAULT 0,
	`Review_issues`	INT	DEFAULT 0,
	`staff_ID`	INT	NULL,
	`Customer_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	`isBlinded`	TINYINT(1) DEFAULT 0,
	`Original_title`	VARCHAR(255) NULL,
	`Original_text`	VARCHAR(255) NULL,
	PRIMARY KEY (`Review_ID`),
	FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
	FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`)
);

CREATE TABLE `ReturnLo` (
	`ReturnLo_ID`	INT	NOT NULL AUTO_INCREMENT,
	`ReturnLo_location`	VARCHAR(255)	NULL,
	`ReturnLo_number`	CHAR(20)	NULL,
	`ReturnLo_capacity`	INT	NULL
);

CREATE TABLE `Media` (
	`media_ID`	INT	NOT NULL AUTO_INCREMENT,
	`media_link`	VARCHAR(255)	NULL,
	`media_date`	DATETIME NULL,
	`Book_ID`	INT	NOT NULL,
	`staff_ID`	INT	NOT NULL,
	PRIMARY KEY (`media_ID`),
	FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`),
	FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`)
);

CREATE TABLE `Contents` (
	`Contents_ID`	INT	NOT NULL AUTO_INCREMENT,
	`Book_ID`	INT	NOT NULL,
	`Contents_type`	VARCHAR(10)	NULL,
	`Contents_name`	VARCHAR(255)	NULL,
	`Contents_author`	VARCHAR(255)	NULL,
	`Contents_date`	DATETIME NULL,
	`Contents_state`	VARCHAR(10)	NULL,
	`staff_ID`	INT	NOT NULL
);

CREATE TABLE `Overdue` (
	`Overdue_ID`	INT	NOT NULL AUTO_INCREMENT,
	`Overdue_starttime`	DATETIME	NULL,
	`Overdue_endtime`	DATETIME	NULL
);

CREATE TABLE `Current_status` (
	`Current_Status_ID`	INT	NOT NULL AUTO_INCREMENT,
	`Borrow_log_ID`	INT	NOT NULL,
	`borrow_ID`	INT	NOT NULL,
	`Customer_ID`	INT	NOT NULL,
	`Book_ID`	INT	NOT NULL,
	`Overdue_ID`	INT	NOT NULL
);

CREATE TABLE `ReviewUpvotes` (
	`Review_ID` INT NOT NULL,
	`Customer_ID` INT NOT NULL,
	PRIMARY KEY (`Review_ID`, `Customer_ID`),
	FOREIGN KEY (`Review_ID`) REFERENCES `Review` (`Review_ID`) ON DELETE CASCADE,
	FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`) ON DELETE CASCADE
);

CREATE TABLE `ReviewReports` (
	`Review_ID` INT NOT NULL,
	`Customer_ID` INT NOT NULL,
	PRIMARY KEY (`Review_ID`, `Customer_ID`),
	FOREIGN KEY (`Review_ID`) REFERENCES `Review` (`Review_ID`) ON DELETE CASCADE,
	FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`) ON DELETE CASCADE
);

ALTER TABLE `Borrow_log` ADD CONSTRAINT `PK_BORROW_LOG` PRIMARY KEY (
	`Borrow_log_ID`,
	`borrow_ID`,
	`Customer_ID`,
	`Book_ID`
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

ALTER TABLE `Current_status` ADD CONSTRAINT `PK_CURRENT_STATUS` PRIMARY KEY (
	`Current_Status_ID`,
	`Borrow_log_ID`,
	`borrow_ID`,
	`Customer_ID`,
	`Book_ID`,
	`Overdue_ID`
);

# Foreign Key

# Borrow_log
ALTER TABLE `Borrow_log` 
ADD CONSTRAINT `FK_Borrow_TO_Borrow_log_1` FOREIGN KEY (`borrow_ID`) REFERENCES `Borrow` (`borrow_ID`),
ADD CONSTRAINT `FK_Borrow_TO_Borrow_log_2` FOREIGN KEY (`Customer_ID`) REFERENCES `Borrow` (`Customer_ID`),
ADD CONSTRAINT `FK_Borrow_TO_Borrow_log_3` FOREIGN KEY (`Book_ID`) REFERENCES `Borrow` (`Book_ID`);

# Supply
ALTER TABLE `Supply` 
ADD CONSTRAINT `FK_Cooperation_TO_Supply_1` FOREIGN KEY (`Cooperation_ID`) REFERENCES `Cooperation` (`Cooperation_ID`),
ADD CONSTRAINT `FK_Staff_TO_Supply_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`),
ADD CONSTRAINT `FK_Book_TO_Supply_1` FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`);

# Return
ALTER TABLE `Return` 
ADD CONSTRAINT `FK_ReturnLo_TO_Return_1` FOREIGN KEY (`ReturnLo_ID`) REFERENCES `ReturnLo` (`ReturnLo_ID`),
ADD CONSTRAINT `FK_Customer_TO_Return_1` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
ADD CONSTRAINT `FK_Staff_TO_Return_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`);

# Contents
ALTER TABLE `Contents` 
ADD CONSTRAINT `FK_Book_TO_Contents_1` FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`),
ADD CONSTRAINT `FK_Staff_TO_Contents_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`);

# Current_status
ALTER TABLE `Current_status` 
ADD CONSTRAINT `FK_Borrow_log_TO_Current_status_1` FOREIGN KEY (`Borrow_log_ID`) REFERENCES `Borrow_log` (`Borrow_log_ID`),
ADD CONSTRAINT `FK_Borrow_log_TO_Current_status_2` FOREIGN KEY (`borrow_ID`) REFERENCES `Borrow_log` (`borrow_ID`),
ADD CONSTRAINT `FK_Borrow_log_TO_Current_status_3` FOREIGN KEY (`Customer_ID`) REFERENCES `Borrow_log` (`Customer_ID`),
ADD CONSTRAINT `FK_Borrow_log_TO_Current_status_4` FOREIGN KEY (`Book_ID`) REFERENCES `Borrow_log` (`Book_ID`),
ADD CONSTRAINT `FK_Overdue_TO_Current_status_1` FOREIGN KEY (`Overdue_ID`) REFERENCES `Overdue` (`Overdue_ID`);

# Borrow
ALTER TABLE `Borrow` 
ADD CONSTRAINT `FK_Customer_TO_Borrow_1` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
ADD CONSTRAINT `FK_Book_TO_Borrow_1` FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`),
ADD CONSTRAINT `FK_Staff_TO_Borrow_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`);

# Review
ALTER TABLE `Review` 
ADD CONSTRAINT `FK_Staff_TO_Review_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`),
ADD CONSTRAINT `FK_Customer_TO_Review_1` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
ADD CONSTRAINT `FK_Book_TO_Review_1` FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`);

# Media
ALTER TABLE `Media` 
ADD CONSTRAINT `FK_Staff_TO_Media_1` FOREIGN KEY (`staff_ID`) REFERENCES `Staff` (`staff_ID`),
ADD CONSTRAINT `FK_Book_TO_Media_1` FOREIGN KEY (`Book_ID`) REFERENCES `Book` (`Book_ID`);

# Cust_Cont
ALTER TABLE `Cust_Cont` 
ADD CONSTRAINT `FK_Customer_TO_Cust_Cont_1` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
ADD CONSTRAINT `FK_Contents_TO_Cust_Cont_1` FOREIGN KEY (`Contents_ID`) REFERENCES `Contents` (`Contents_ID`),
ADD CONSTRAINT `FK_Book_TO_Cust_Cont_1` FOREIGN KEY (`Book_ID`) REFERENCES `Contents` (`Book_ID`);


