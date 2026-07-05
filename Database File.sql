-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: university_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int NOT NULL,
  `class_date` date NOT NULL,
  `status` enum('Present','Absent','Late','Excused') DEFAULT 'Present',
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`attendance_id`),
  UNIQUE KEY `unique_attendance` (`enrollment_id`,`class_date`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_offerings`
--

DROP TABLE IF EXISTS `course_offerings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_offerings` (
  `offering_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `semester_id` int NOT NULL,
  `section` varchar(5) DEFAULT 'A',
  `max_capacity` int DEFAULT '40',
  `enrolled_count` int DEFAULT '0',
  `room_no` varchar(20) DEFAULT NULL,
  `schedule` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`offering_id`),
  KEY `course_id` (`course_id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `semester_id` (`semester_id`),
  CONSTRAINT `course_offerings_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `course_offerings_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE RESTRICT,
  CONSTRAINT `course_offerings_ibfk_3` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`semester_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_offerings`
--

LOCK TABLES `course_offerings` WRITE;
/*!40000 ALTER TABLE `course_offerings` DISABLE KEYS */;
INSERT INTO `course_offerings` VALUES (1,5,1,2,'A',40,0,'CS-101','Mon/Wed 9:00-10:30','2026-05-03 21:19:40'),(2,5,2,2,'B',35,0,'CS-102','Tue/Thu 11:00-12:30','2026-05-03 21:19:40'),(3,6,1,2,'A',40,0,'CS-103','Mon/Wed 11:00-12:30','2026-05-03 21:19:40'),(4,1,2,2,'A',45,0,'CS-201','Tue/Thu 9:00-10:30','2026-05-03 21:19:40');
/*!40000 ALTER TABLE `course_offerings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_prerequisites`
--

DROP TABLE IF EXISTS `course_prerequisites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_prerequisites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `prerequisite_course_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_prereq` (`course_id`,`prerequisite_course_id`),
  KEY `prerequisite_course_id` (`prerequisite_course_id`),
  CONSTRAINT `course_prerequisites_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `course_prerequisites_ibfk_2` FOREIGN KEY (`prerequisite_course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_prerequisites`
--

LOCK TABLES `course_prerequisites` WRITE;
/*!40000 ALTER TABLE `course_prerequisites` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_prerequisites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_code` varchar(15) NOT NULL,
  `course_name` varchar(150) NOT NULL,
  `credit_hours` int NOT NULL DEFAULT '3',
  `course_type` enum('Theory','Lab','Theory+Lab') DEFAULT 'Theory',
  `dept_id` int NOT NULL,
  `semester_level` int NOT NULL DEFAULT '1',
  `description` text,
  `is_elective` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `course_code` (`course_code`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'CS101','Introduction to Computing',3,'Theory',1,1,NULL,0,'2026-05-03 21:19:40'),(2,'CS102','Programming Fundamentals',3,'Theory+Lab',1,1,NULL,0,'2026-05-03 21:19:40'),(3,'CS201','Object Oriented Programming',3,'Theory+Lab',1,2,NULL,0,'2026-05-03 21:19:40'),(4,'CS202','Data Structures',3,'Theory',1,2,NULL,0,'2026-05-03 21:19:40'),(5,'CS301','Database Systems',3,'Theory+Lab',1,3,NULL,0,'2026-05-03 21:19:40'),(6,'CS302','Operating Systems',3,'Theory',1,3,NULL,0,'2026-05-03 21:19:40'),(7,'MATH101','Calculus I',3,'Theory',4,1,NULL,0,'2026-05-03 21:19:40'),(8,'MATH102','Linear Algebra',3,'Theory',4,2,NULL,0,'2026-05-03 21:19:40');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `dept_id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(100) NOT NULL,
  `dept_code` varchar(10) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `established_year` int DEFAULT '2000',
  `dept_head_id` int DEFAULT NULL,
  `office_location` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  PRIMARY KEY (`dept_id`),
  UNIQUE KEY `dept_code` (`dept_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Computer Science','CS','Computer Science aur Software Engineering ki education','2026-05-03 21:19:40',2005,NULL,'Block A, Room 101','061-1234501','cs@university.edu','Active'),(2,'Business Administration','BBA','Business Administration aur Management sciences','2026-05-03 21:19:40',2003,NULL,'Block B, Room 201','061-1234502','bba@university.edu','Active'),(3,'Electrical Engineering','EE','Electrical Engineering aur Electronics','2026-05-03 21:19:40',2007,NULL,'Block C, Room 301','061-1234503','ee@university.edu','Active'),(4,'Mathematics','MATH','Mathematics aur Statistics','2026-05-03 21:19:40',2004,NULL,'Block D, Room 401','061-1234504','math@university.edu','Active');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `enrollment_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `offering_id` int NOT NULL,
  `enrollment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Enrolled','Dropped','Completed','Failed') DEFAULT 'Enrolled',
  `midterm_marks` decimal(5,2) DEFAULT NULL,
  `final_marks` decimal(5,2) DEFAULT NULL,
  `assignment_marks` decimal(5,2) DEFAULT NULL,
  `total_marks` decimal(5,2) GENERATED ALWAYS AS (((coalesce(`midterm_marks`,0) + coalesce(`final_marks`,0)) + coalesce(`assignment_marks`,0))) STORED,
  `grade` varchar(3) DEFAULT NULL,
  `grade_points` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`enrollment_id`),
  UNIQUE KEY `unique_enrollment` (`student_id`,`offering_id`),
  KEY `offering_id` (`offering_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings` (`offering_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` (`enrollment_id`, `student_id`, `offering_id`, `enrollment_date`, `status`, `midterm_marks`, `final_marks`, `assignment_marks`, `grade`, `grade_points`) VALUES (1,1,1,'2026-05-03 21:19:40','Enrolled',NULL,NULL,NULL,NULL,NULL),(2,2,1,'2026-05-03 21:19:40','Enrolled',NULL,NULL,NULL,NULL,NULL),(3,3,2,'2026-05-03 21:19:40','Enrolled',NULL,NULL,NULL,NULL,NULL),(4,1,3,'2026-05-03 21:19:40','Enrolled',NULL,NULL,NULL,NULL,NULL),(5,5,4,'2026-05-03 21:19:40','Enrolled',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `exam_id` int NOT NULL AUTO_INCREMENT,
  `exam_name` varchar(100) NOT NULL,
  `exam_type` enum('Midterm','Final','Quiz','Assignment','Lab') DEFAULT 'Midterm',
  `course_offering_id` int DEFAULT NULL,
  `exam_date` date DEFAULT NULL,
  `total_marks` decimal(5,2) DEFAULT '100.00',
  `passing_marks` decimal(5,2) DEFAULT '50.00',
  `duration_minutes` int DEFAULT '180',
  `status` enum('Scheduled','Ongoing','Completed') DEFAULT 'Scheduled',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`exam_id`),
  KEY `course_offering_id` (`course_offering_id`),
  CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`course_offering_id`) REFERENCES `course_offerings` (`offering_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES (1,'CS101 Midterm Spring 2024','Midterm',1,'2024-03-15',50.00,25.00,90,'Completed','2026-05-07 20:12:32'),(2,'CS101 Final Spring 2024','Final',1,'2024-05-20',100.00,50.00,180,'Completed','2026-05-07 20:12:32'),(3,'CS201 Midterm Spring 2024','Midterm',2,'2024-03-16',50.00,25.00,90,'Completed','2026-05-07 20:12:32'),(4,'CS201 Final Spring 2024','Final',2,'2024-05-21',100.00,50.00,180,'Completed','2026-05-07 20:12:32'),(5,'MATH101 Midterm Spring 2024','Midterm',3,'2024-03-17',50.00,25.00,90,'Completed','2026-05-07 20:12:32'),(6,'CS101 Quiz 1','Quiz',1,'2024-02-10',20.00,10.00,30,'Completed','2026-05-07 20:12:32'),(7,'CS201 Assignment 1','Assignment',2,'2024-02-20',30.00,15.00,NULL,'Completed','2026-05-07 20:12:32'),(8,'CS301 Midterm Fall 2024','Midterm',4,'2024-10-15',50.00,25.00,90,'Scheduled','2026-05-07 20:12:32');
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_payments`
--

DROP TABLE IF EXISTS `fee_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `structure_id` int DEFAULT NULL,
  `fee_type` enum('Tuition','Admission','Exam','Library','Sports','Hostel','Other') DEFAULT 'Tuition',
  `amount` decimal(10,2) NOT NULL,
  `due_date` date NOT NULL,
  `paid_date` date DEFAULT NULL,
  `payment_method` enum('Cash','Bank Transfer','Online','Cheque') DEFAULT 'Cash',
  `receipt_no` varchar(30) DEFAULT NULL,
  `status` enum('Pending','Paid','Overdue','Partial') DEFAULT 'Pending',
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `student_id` (`student_id`),
  KEY `structure_id` (`structure_id`),
  CONSTRAINT `fee_payments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `fee_payments_ibfk_2` FOREIGN KEY (`structure_id`) REFERENCES `fee_structures` (`structure_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_payments`
--

LOCK TABLES `fee_payments` WRITE;
/*!40000 ALTER TABLE `fee_payments` DISABLE KEYS */;
INSERT INTO `fee_payments` VALUES (1,1,NULL,'Tuition',35000.00,'2024-09-15','2024-09-10','Bank Transfer','REC-2024-001','Paid',NULL,'2026-05-07 19:29:12'),(2,1,NULL,'Exam',3000.00,'2024-12-01','2024-11-28','Cash','REC-2024-002','Paid',NULL,'2026-05-07 19:29:12'),(3,2,NULL,'Tuition',35000.00,'2024-09-15','2024-09-20','Online','REC-2024-003','Paid',NULL,'2026-05-07 19:29:12'),(4,2,NULL,'Exam',3000.00,'2024-12-01',NULL,NULL,NULL,'Pending',NULL,'2026-05-07 19:29:12'),(5,3,NULL,'Tuition',35000.00,'2024-09-15',NULL,NULL,NULL,'Overdue',NULL,'2026-05-07 19:29:12'),(6,4,NULL,'Tuition',30000.00,'2024-09-15','2024-09-12','Cash','REC-2024-004','Paid',NULL,'2026-05-07 19:29:12'),(7,5,NULL,'Tuition',35000.00,'2025-02-15',NULL,NULL,NULL,'Pending',NULL,'2026-05-07 19:29:12');
/*!40000 ALTER TABLE `fee_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_structures`
--

DROP TABLE IF EXISTS `fee_structures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_structures` (
  `structure_id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `semester_no` int NOT NULL,
  `tuition_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `admission_fee` decimal(10,2) DEFAULT '0.00',
  `exam_fee` decimal(10,2) DEFAULT '0.00',
  `library_fee` decimal(10,2) DEFAULT '0.00',
  `sports_fee` decimal(10,2) DEFAULT '0.00',
  `total_fee` decimal(10,2) GENERATED ALWAYS AS (((((`tuition_fee` + `admission_fee`) + `exam_fee`) + `library_fee`) + `sports_fee`)) STORED,
  `academic_year` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`structure_id`),
  UNIQUE KEY `unique_fee` (`program_id`,`semester_no`,`academic_year`),
  CONSTRAINT `fee_structures_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_structures`
--

LOCK TABLES `fee_structures` WRITE;
/*!40000 ALTER TABLE `fee_structures` DISABLE KEYS */;
INSERT INTO `fee_structures` (`structure_id`, `program_id`, `semester_no`, `tuition_fee`, `admission_fee`, `exam_fee`, `library_fee`, `sports_fee`, `academic_year`, `created_at`) VALUES (1,1,1,35000.00,15000.00,3000.00,2000.00,1000.00,'2024-25','2026-05-07 19:29:12'),(2,1,2,35000.00,0.00,3000.00,2000.00,1000.00,'2024-25','2026-05-07 19:29:12'),(3,1,3,35000.00,0.00,3000.00,2000.00,1000.00,'2024-25','2026-05-07 19:29:12'),(4,2,1,30000.00,12000.00,2500.00,1500.00,1000.00,'2024-25','2026-05-07 19:29:12'),(5,2,2,30000.00,0.00,2500.00,1500.00,1000.00,'2024-25','2026-05-07 19:29:12'),(6,3,1,40000.00,18000.00,3500.00,2000.00,1000.00,'2024-25','2026-05-07 19:29:12'),(7,4,1,45000.00,20000.00,4000.00,2500.00,1500.00,'2024-25','2026-05-07 19:29:12');
/*!40000 ALTER TABLE `fee_structures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade_policy`
--

DROP TABLE IF EXISTS `grade_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade_policy` (
  `policy_id` int NOT NULL AUTO_INCREMENT,
  `grade` varchar(2) NOT NULL,
  `min_percentage` decimal(5,2) NOT NULL,
  `max_percentage` decimal(5,2) NOT NULL,
  `grade_points` decimal(3,2) NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`policy_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_policy`
--

LOCK TABLES `grade_policy` WRITE;
/*!40000 ALTER TABLE `grade_policy` DISABLE KEYS */;
INSERT INTO `grade_policy` VALUES (1,'A+',95.00,100.00,4.00,'Exceptional'),(2,'A',90.00,94.99,4.00,'Excellent'),(3,'A-',85.00,89.99,3.70,'Very Good'),(4,'B+',80.00,84.99,3.30,'Good'),(5,'B',75.00,79.99,3.00,'Above Average'),(6,'B-',70.00,74.99,2.70,'Average'),(7,'C+',65.00,69.99,2.30,'Below Average'),(8,'C',60.00,64.99,2.00,'Satisfactory'),(9,'C-',55.00,59.99,1.70,'Pass'),(10,'D',50.00,54.99,1.00,'Minimum Pass'),(11,'F',0.00,49.99,0.00,'Fail');
/*!40000 ALTER TABLE `grade_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hostel_allocations`
--

DROP TABLE IF EXISTS `hostel_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hostel_allocations` (
  `allocation_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `room_id` int NOT NULL,
  `hostel_id` int NOT NULL,
  `allocation_date` date NOT NULL,
  `vacating_date` date DEFAULT NULL,
  `monthly_fee` decimal(10,2) DEFAULT NULL,
  `status` enum('Active','Vacated') DEFAULT 'Active',
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`allocation_id`),
  KEY `student_id` (`student_id`),
  KEY `room_id` (`room_id`),
  KEY `hostel_id` (`hostel_id`),
  CONSTRAINT `hostel_allocations_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `hostel_allocations_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `hostel_rooms` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `hostel_allocations_ibfk_3` FOREIGN KEY (`hostel_id`) REFERENCES `hostels` (`hostel_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hostel_allocations`
--

LOCK TABLES `hostel_allocations` WRITE;
/*!40000 ALTER TABLE `hostel_allocations` DISABLE KEYS */;
INSERT INTO `hostel_allocations` VALUES (1,1,1,1,'2024-09-01',NULL,8000.00,'Active',NULL,'2026-05-07 20:39:15'),(2,2,2,1,'2024-09-01',NULL,6000.00,'Active',NULL,'2026-05-07 20:39:15'),(3,3,2,1,'2024-09-01',NULL,6000.00,'Active',NULL,'2026-05-07 20:39:15'),(4,4,9,2,'2024-09-01',NULL,9000.00,'Active',NULL,'2026-05-07 20:39:15'),(5,5,3,1,'2024-09-05',NULL,6000.00,'Active',NULL,'2026-05-07 20:39:15');
/*!40000 ALTER TABLE `hostel_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hostel_complaints`
--

DROP TABLE IF EXISTS `hostel_complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hostel_complaints` (
  `complaint_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `hostel_id` int NOT NULL,
  `complaint_type` enum('Maintenance','Cleanliness','Security','Food','Other') DEFAULT 'Other',
  `description` text,
  `status` enum('Pending','In Progress','Resolved') DEFAULT 'Pending',
  `filed_date` date DEFAULT (curdate()),
  `resolved_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`complaint_id`),
  KEY `student_id` (`student_id`),
  KEY `hostel_id` (`hostel_id`),
  CONSTRAINT `hostel_complaints_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `hostel_complaints_ibfk_2` FOREIGN KEY (`hostel_id`) REFERENCES `hostels` (`hostel_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hostel_complaints`
--

LOCK TABLES `hostel_complaints` WRITE;
/*!40000 ALTER TABLE `hostel_complaints` DISABLE KEYS */;
INSERT INTO `hostel_complaints` VALUES (1,1,1,'Maintenance','Fan not working in room 101','Resolved','2024-10-01',NULL,'2026-05-07 20:39:15'),(2,2,1,'Cleanliness','Common bathroom needs cleaning','In Progress','2024-10-10',NULL,'2026-05-07 20:39:15'),(3,4,2,'Security','Main gate lock is broken','Pending','2024-10-15',NULL,'2026-05-07 20:39:15');
/*!40000 ALTER TABLE `hostel_complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hostel_rooms`
--

DROP TABLE IF EXISTS `hostel_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hostel_rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `hostel_id` int NOT NULL,
  `room_number` varchar(20) NOT NULL,
  `room_type` enum('Single','Double','Triple','Quad') DEFAULT 'Double',
  `capacity` int DEFAULT '2',
  `occupied` int DEFAULT '0',
  `monthly_fee` decimal(10,2) DEFAULT '5000.00',
  `floor_number` int DEFAULT '1',
  `has_ac` tinyint(1) DEFAULT '0',
  `has_attached_bath` tinyint(1) DEFAULT '0',
  `status` enum('Available','Full','Maintenance') DEFAULT 'Available',
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `unique_room` (`hostel_id`,`room_number`),
  CONSTRAINT `hostel_rooms_ibfk_1` FOREIGN KEY (`hostel_id`) REFERENCES `hostels` (`hostel_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hostel_rooms`
--

LOCK TABLES `hostel_rooms` WRITE;
/*!40000 ALTER TABLE `hostel_rooms` DISABLE KEYS */;
INSERT INTO `hostel_rooms` VALUES (1,1,'101','Single',1,1,8000.00,1,1,1,'Full'),(2,1,'102','Double',2,2,6000.00,1,0,0,'Full'),(3,1,'103','Double',2,1,6000.00,1,0,0,'Available'),(4,1,'104','Triple',3,0,4500.00,1,0,0,'Available'),(5,1,'201','Single',1,0,8000.00,2,1,1,'Available'),(6,1,'202','Double',2,2,6000.00,2,1,0,'Full'),(7,1,'203','Triple',3,3,4500.00,2,0,0,'Full'),(8,1,'204','Quad',4,0,3500.00,2,0,0,'Available'),(9,2,'G101','Single',1,1,9000.00,1,1,1,'Full'),(10,2,'G102','Double',2,2,7000.00,1,1,1,'Full'),(11,2,'G103','Double',2,0,7000.00,1,0,1,'Available'),(12,2,'G104','Triple',3,2,5000.00,1,0,0,'Available'),(13,2,'G201','Double',2,0,7000.00,2,1,1,'Available'),(14,2,'G202','Triple',3,0,5000.00,2,0,0,'Available'),(15,1,'10','Double',2,0,5000.00,1,0,1,'Available'),(16,2,'110','Double',2,0,5000.00,1,0,1,'Available'),(18,1,'111','Double',2,0,5000.00,1,1,0,'Available'),(19,1,'120','Triple',3,0,5000.00,3,1,1,'Available'),(20,2,'123','Quad',4,0,5000.00,3,1,1,'Available'),(21,2,'132','Double',3,0,5000.00,3,1,0,'Available'),(22,1,'212','Double',2,0,5000.00,4,0,0,'Available');
/*!40000 ALTER TABLE `hostel_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hostels`
--

DROP TABLE IF EXISTS `hostels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hostels` (
  `hostel_id` int NOT NULL AUTO_INCREMENT,
  `hostel_name` varchar(100) NOT NULL,
  `hostel_type` enum('Boys','Girls') NOT NULL,
  `total_rooms` int DEFAULT '0',
  `warden_name` varchar(100) DEFAULT NULL,
  `warden_phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hostel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hostels`
--

LOCK TABLES `hostels` WRITE;
/*!40000 ALTER TABLE `hostels` DISABLE KEYS */;
INSERT INTO `hostels` VALUES (1,'Al-Farabi Boys Hostel','Boys',50,'Mr. Tariq Mehmood','0300-1234567','Block A, University Campus','Active','2026-05-07 20:39:15'),(2,'Razia Sultana Girls Hostel','Girls',40,'Ms. Nadia Hussain','0301-9876543','Block B, University Campus','Active','2026-05-07 20:39:15');
/*!40000 ALTER TABLE `hostels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `program_id` int NOT NULL AUTO_INCREMENT,
  `program_name` varchar(100) NOT NULL,
  `program_code` varchar(10) NOT NULL,
  `degree_type` enum('BS','MS','PhD','Associate') NOT NULL,
  `duration_years` int NOT NULL DEFAULT '4',
  `total_credit_hours` int NOT NULL DEFAULT '130',
  `dept_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`program_id`),
  UNIQUE KEY `program_code` (`program_code`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `programs_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES (1,'Bachelor of Science in Computer Science','BSCS','BS',4,130,1,'2026-05-03 21:19:40'),(2,'Bachelor of Business Administration','BBA','BS',4,120,2,'2026-05-03 21:19:40'),(3,'Bachelor of Science in Electrical Engineering','BSEE','BS',4,140,3,'2026-05-03 21:19:40'),(4,'Master of Science in Computer Science','MSCS','MS',2,60,1,'2026-05-03 21:19:40');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `results` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `exam_id` int NOT NULL,
  `obtained_marks` decimal(5,2) DEFAULT '0.00',
  `grade` varchar(2) DEFAULT NULL,
  `grade_points` decimal(3,2) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`),
  UNIQUE KEY `unique_result` (`student_id`,`exam_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `results_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` VALUES (1,1,1,42.00,'A',4.00,'Excellent performance','2026-05-07 20:12:32'),(2,1,2,88.00,'A-',3.70,'Very good','2026-05-07 20:12:32'),(3,1,6,18.00,'A+',4.00,'Perfect','2026-05-07 20:12:32'),(4,2,1,35.00,'B+',3.30,'Good','2026-05-07 20:12:32'),(5,2,2,74.00,'B-',2.70,'Average','2026-05-07 20:12:32'),(6,2,3,40.00,'A-',3.70,'Very good','2026-05-07 20:12:32'),(7,2,4,85.00,'A-',3.70,'Very good','2026-05-07 20:12:32'),(8,3,1,28.00,'C+',2.30,'Needs improvement','2026-05-07 20:12:32'),(9,3,5,43.00,'A+',4.00,'Excellent','2026-05-07 20:12:32'),(10,4,2,92.00,'A+',4.00,'Outstanding','2026-05-07 20:12:32'),(11,5,1,45.00,'A+',4.00,'Excellent','2026-05-07 20:12:32'),(12,5,3,36.00,'B+',3.30,'Good','2026-05-07 20:12:32');
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semesters`
--

DROP TABLE IF EXISTS `semesters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semesters` (
  `semester_id` int NOT NULL AUTO_INCREMENT,
  `semester_name` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `academic_year` varchar(10) NOT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`semester_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semesters`
--

LOCK TABLES `semesters` WRITE;
/*!40000 ALTER TABLE `semesters` DISABLE KEYS */;
INSERT INTO `semesters` VALUES (1,'Fall 2024','2024-09-01','2025-01-31','2024-25',0,'2026-05-03 21:19:40'),(2,'Spring 2025','2025-02-01','2025-06-30','2024-25',1,'2026-05-03 21:19:40');
/*!40000 ALTER TABLE `semesters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `reg_no` varchar(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` text,
  `city` varchar(50) DEFAULT NULL,
  `program_id` int NOT NULL,
  `admission_date` date NOT NULL,
  `current_semester` int DEFAULT '1',
  `cgpa` decimal(3,2) DEFAULT '0.00',
  `status` enum('Active','Inactive','Graduated','Expelled') DEFAULT 'Active',
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `reg_no` (`reg_no`),
  UNIQUE KEY `email` (`email`),
  KEY `program_id` (`program_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'BSCS-2021-001','Ali','Raza','ali.raza@student.edu','0311-1111111','Male','2002-05-15',NULL,NULL,1,'2021-09-01',5,0.00,'Active',NULL,'2026-05-03 21:19:40','2026-05-03 21:19:40'),(2,'BSCS-2021-002','Ayesha','Noor','ayesha.noor@student.edu','0311-2222222','Female','2002-08-20',NULL,NULL,1,'2021-09-01',5,0.00,'Active',NULL,'2026-05-03 21:19:40','2026-05-03 21:19:40'),(3,'BSCS-2022-001','Usman','Tariq','usman.tariq@student.edu','0311-3333333','Male','2003-01-10',NULL,NULL,1,'2022-09-01',3,0.00,'Active',NULL,'2026-05-03 21:19:40','2026-05-03 21:19:40'),(4,'BBA-2022-001','Hina','Shah','hina.shah@student.edu','0311-4444444','Female','2003-03-25',NULL,NULL,2,'2022-09-01',3,0.00,'Active',NULL,'2026-05-03 21:19:40','2026-05-03 21:19:40'),(5,'BSCS-2023-001','Zaid','Iqbal','zaid.iqbal@student.edu','0311-5555555','Male','2004-07-30',NULL,NULL,1,'2023-09-01',1,0.00,'Active',NULL,'2026-05-03 21:19:40','2026-05-03 21:19:40');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_attendance`
--

DROP TABLE IF EXISTS `teacher_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('Present','Absent','Leave') DEFAULT 'Present',
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_teacher_date` (`teacher_id`,`attendance_date`),
  CONSTRAINT `teacher_attendance_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_attendance`
--

LOCK TABLES `teacher_attendance` WRITE;
/*!40000 ALTER TABLE `teacher_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_subjects`
--

DROP TABLE IF EXISTS `teacher_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_teacher_course` (`teacher_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `teacher_subjects_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE CASCADE,
  CONSTRAINT `teacher_subjects_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_subjects`
--

LOCK TABLES `teacher_subjects` WRITE;
/*!40000 ALTER TABLE `teacher_subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `emp_no` varchar(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `qualification` varchar(100) DEFAULT NULL,
  `designation` enum('Lecturer','Assistant Professor','Associate Professor','Professor') DEFAULT 'Lecturer',
  `dept_id` int NOT NULL,
  `joining_date` date DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`teacher_id`),
  UNIQUE KEY `emp_no` (`emp_no`),
  UNIQUE KEY `email` (`email`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,'EMP001','Ahmad','Hassan','ahmad.hassan@university.edu','0300-1234567','PhD Computer Science','Professor',1,'2015-01-10','Active','2026-05-03 21:19:40'),(2,'EMP002','Sara','Khan','sara.khan@university.edu','0301-2345678','MS Software Engineering','Assistant Professor',1,'2018-03-15','Active','2026-05-03 21:19:40'),(3,'EMP003','Bilal','Ahmed','bilal.ahmed@university.edu','0302-3456789','PhD Mathematics','Associate Professor',4,'2016-08-01','Active','2026-05-03 21:19:40'),(4,'EMP004','Fatima','Malik','fatima.malik@university.edu','0303-4567890','MS Business Admin','Lecturer',2,'2020-02-20','Active','2026-05-03 21:19:40'),(5,'EMP005','Kamran','Ali','kamran.ali@university.edu','0304-5678901','MS Computer Science','Assistant Professor',1,'2019-01-15','Active','2026-05-03 21:56:06'),(6,'EMP006','Nadia','Hussain','nadia.hussain@university.edu','0305-6789012','PhD Mathematics','Professor',4,'2014-06-01','Active','2026-05-03 21:56:06'),(7,'EMP007','Zubair','Khan','zubair.khan@university.edu','0306-7890123','MS Electrical Engineering','Lecturer',3,'2021-09-01','Active','2026-05-03 21:56:06');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Teacher','Student') NOT NULL DEFAULT 'Student',
  `student_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `student_id` (`student_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE SET NULL,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$Moknk95r1kC.YxfUw8g/feQUlO/zchDZeC2KvrTMR/mPwvIMg5Lnq','Admin',NULL,NULL,'System Administrator','admin@university.edu',1,'2026-05-08 07:46:47','2026-05-08 05:27:36'),(2,'ahmad.hassan','$2b$10$YhEMfYt5blRE9kYx6.EtF.Cv3zmCmNzVeTxuaefbOT1Loc0dAvuRm','Teacher',NULL,1,'Ahmad Hassan','ahmad.hassan@university.edu',1,'2026-05-08 07:51:41','2026-05-08 05:27:36'),(3,'sara.khan','$2b$10$rBnqFfGzB.bF7eJ6R5y2xOxkwLJfzX1K8m3hUmN2jPz4dVqYkq9Wy','Teacher',NULL,2,'Sara Khan','sara.khan@university.edu',1,NULL,'2026-05-08 05:27:36'),(4,'ali.raza','$2b$10$2XcHSgHi1heatvkvlOrDIOcoS7ZFF4lGWBhSJgrTMWH6eFMrsQgDW','Student',1,NULL,'Ali Raza','ali.raza@student.edu',1,'2026-05-08 07:52:14','2026-05-08 05:27:36'),(5,'ayesha.noor','$2b$10$rBnqFfGzB.bF7eJ6R5y2xOxkwLJfzX1K8m3hUmN2jPz4dVqYkq9Wy','Student',2,NULL,'Ayesha Noor','ayesha.noor@student.edu',1,NULL,'2026-05-08 05:27:36');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_allocation_details`
--

DROP TABLE IF EXISTS `v_allocation_details`;
/*!50001 DROP VIEW IF EXISTS `v_allocation_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_allocation_details` AS SELECT 
 1 AS `allocation_id`,
 1 AS `allocation_date`,
 1 AS `vacating_date`,
 1 AS `monthly_fee`,
 1 AS `status`,
 1 AS `remarks`,
 1 AS `student_id`,
 1 AS `student_name`,
 1 AS `reg_no`,
 1 AS `gender`,
 1 AS `room_number`,
 1 AS `room_type`,
 1 AS `floor_number`,
 1 AS `hostel_id`,
 1 AS `hostel_name`,
 1 AS `hostel_type`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_department_details`
--

DROP TABLE IF EXISTS `v_department_details`;
/*!50001 DROP VIEW IF EXISTS `v_department_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_department_details` AS SELECT 
 1 AS `dept_id`,
 1 AS `dept_name`,
 1 AS `dept_code`,
 1 AS `established_year`,
 1 AS `office_location`,
 1 AS `phone`,
 1 AS `email`,
 1 AS `status`,
 1 AS `description`,
 1 AS `dept_head_id`,
 1 AS `dept_head_name`,
 1 AS `head_designation`,
 1 AS `total_students`,
 1 AS `total_teachers`,
 1 AS `total_courses`,
 1 AS `total_programs`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_enrollment_details`
--

DROP TABLE IF EXISTS `v_enrollment_details`;
/*!50001 DROP VIEW IF EXISTS `v_enrollment_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_enrollment_details` AS SELECT 
 1 AS `enrollment_id`,
 1 AS `student_name`,
 1 AS `reg_no`,
 1 AS `course_name`,
 1 AS `course_code`,
 1 AS `credit_hours`,
 1 AS `teacher_name`,
 1 AS `semester_name`,
 1 AS `section`,
 1 AS `midterm_marks`,
 1 AS `final_marks`,
 1 AS `assignment_marks`,
 1 AS `total_marks`,
 1 AS `grade`,
 1 AS `status`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_fee_details`
--

DROP TABLE IF EXISTS `v_fee_details`;
/*!50001 DROP VIEW IF EXISTS `v_fee_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_fee_details` AS SELECT 
 1 AS `payment_id`,
 1 AS `student_id`,
 1 AS `student_name`,
 1 AS `reg_no`,
 1 AS `program_name`,
 1 AS `fee_type`,
 1 AS `amount`,
 1 AS `due_date`,
 1 AS `paid_date`,
 1 AS `payment_method`,
 1 AS `receipt_no`,
 1 AS `status`,
 1 AS `remarks`,
 1 AS `days_overdue`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_result_details`
--

DROP TABLE IF EXISTS `v_result_details`;
/*!50001 DROP VIEW IF EXISTS `v_result_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_result_details` AS SELECT 
 1 AS `result_id`,
 1 AS `student_id`,
 1 AS `student_name`,
 1 AS `reg_no`,
 1 AS `exam_id`,
 1 AS `exam_name`,
 1 AS `exam_type`,
 1 AS `exam_date`,
 1 AS `total_marks`,
 1 AS `obtained_marks`,
 1 AS `percentage`,
 1 AS `grade`,
 1 AS `grade_points`,
 1 AS `remarks`,
 1 AS `course_name`,
 1 AS `course_code`,
 1 AS `teacher_name`,
 1 AS `semester_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_room_details`
--

DROP TABLE IF EXISTS `v_room_details`;
/*!50001 DROP VIEW IF EXISTS `v_room_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_room_details` AS SELECT 
 1 AS `room_id`,
 1 AS `room_number`,
 1 AS `room_type`,
 1 AS `capacity`,
 1 AS `occupied`,
 1 AS `available_beds`,
 1 AS `monthly_fee`,
 1 AS `floor_number`,
 1 AS `has_ac`,
 1 AS `has_attached_bath`,
 1 AS `status`,
 1 AS `hostel_id`,
 1 AS `hostel_name`,
 1 AS `hostel_type`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_student_details`
--

DROP TABLE IF EXISTS `v_student_details`;
/*!50001 DROP VIEW IF EXISTS `v_student_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_student_details` AS SELECT 
 1 AS `student_id`,
 1 AS `reg_no`,
 1 AS `full_name`,
 1 AS `email`,
 1 AS `phone`,
 1 AS `gender`,
 1 AS `cgpa`,
 1 AS `current_semester`,
 1 AS `status`,
 1 AS `program_name`,
 1 AS `degree_type`,
 1 AS `dept_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_student_gpa`
--

DROP TABLE IF EXISTS `v_student_gpa`;
/*!50001 DROP VIEW IF EXISTS `v_student_gpa`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_student_gpa` AS SELECT 
 1 AS `student_id`,
 1 AS `student_name`,
 1 AS `reg_no`,
 1 AS `total_exams`,
 1 AS `cgpa`,
 1 AS `avg_percentage`,
 1 AS `failed_exams`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_teacher_details`
--

DROP TABLE IF EXISTS `v_teacher_details`;
/*!50001 DROP VIEW IF EXISTS `v_teacher_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_teacher_details` AS SELECT 
 1 AS `teacher_id`,
 1 AS `emp_no`,
 1 AS `full_name`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `email`,
 1 AS `phone`,
 1 AS `qualification`,
 1 AS `designation`,
 1 AS `joining_date`,
 1 AS `status`,
 1 AS `dept_name`,
 1 AS `dept_id`,
 1 AS `total_courses_assigned`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_allocation_details`
--

/*!50001 DROP VIEW IF EXISTS `v_allocation_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_allocation_details` AS select `a`.`allocation_id` AS `allocation_id`,`a`.`allocation_date` AS `allocation_date`,`a`.`vacating_date` AS `vacating_date`,`a`.`monthly_fee` AS `monthly_fee`,`a`.`status` AS `status`,`a`.`remarks` AS `remarks`,`s`.`student_id` AS `student_id`,concat(`s`.`first_name`,' ',`s`.`last_name`) AS `student_name`,`s`.`reg_no` AS `reg_no`,`s`.`gender` AS `gender`,`r`.`room_number` AS `room_number`,`r`.`room_type` AS `room_type`,`r`.`floor_number` AS `floor_number`,`h`.`hostel_id` AS `hostel_id`,`h`.`hostel_name` AS `hostel_name`,`h`.`hostel_type` AS `hostel_type` from (((`hostel_allocations` `a` join `students` `s` on((`a`.`student_id` = `s`.`student_id`))) join `hostel_rooms` `r` on((`a`.`room_id` = `r`.`room_id`))) join `hostels` `h` on((`a`.`hostel_id` = `h`.`hostel_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_department_details`
--

/*!50001 DROP VIEW IF EXISTS `v_department_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_department_details` AS select `d`.`dept_id` AS `dept_id`,`d`.`dept_name` AS `dept_name`,`d`.`dept_code` AS `dept_code`,`d`.`established_year` AS `established_year`,`d`.`office_location` AS `office_location`,`d`.`phone` AS `phone`,`d`.`email` AS `email`,`d`.`status` AS `status`,`d`.`description` AS `description`,`d`.`dept_head_id` AS `dept_head_id`,concat(`t`.`first_name`,' ',`t`.`last_name`) AS `dept_head_name`,`t`.`designation` AS `head_designation`,count(distinct `s`.`student_id`) AS `total_students`,count(distinct `te`.`teacher_id`) AS `total_teachers`,count(distinct `c`.`course_id`) AS `total_courses`,count(distinct `p`.`program_id`) AS `total_programs` from (((((`departments` `d` left join `teachers` `t` on((`d`.`dept_head_id` = `t`.`teacher_id`))) left join `programs` `p` on((`d`.`dept_id` = `p`.`dept_id`))) left join `students` `s` on((`p`.`program_id` = `s`.`program_id`))) left join `teachers` `te` on((`d`.`dept_id` = `te`.`dept_id`))) left join `courses` `c` on((`d`.`dept_id` = `c`.`dept_id`))) group by `d`.`dept_id`,`d`.`dept_name`,`d`.`dept_code`,`d`.`established_year`,`d`.`office_location`,`d`.`phone`,`d`.`email`,`d`.`status`,`d`.`description`,`d`.`dept_head_id`,`t`.`first_name`,`t`.`last_name`,`t`.`designation` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_enrollment_details`
--

/*!50001 DROP VIEW IF EXISTS `v_enrollment_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_enrollment_details` AS select `e`.`enrollment_id` AS `enrollment_id`,concat(`s`.`first_name`,' ',`s`.`last_name`) AS `student_name`,`s`.`reg_no` AS `reg_no`,`c`.`course_name` AS `course_name`,`c`.`course_code` AS `course_code`,`c`.`credit_hours` AS `credit_hours`,concat(`t`.`first_name`,' ',`t`.`last_name`) AS `teacher_name`,`sem`.`semester_name` AS `semester_name`,`co`.`section` AS `section`,`e`.`midterm_marks` AS `midterm_marks`,`e`.`final_marks` AS `final_marks`,`e`.`assignment_marks` AS `assignment_marks`,`e`.`total_marks` AS `total_marks`,`e`.`grade` AS `grade`,`e`.`status` AS `status` from (((((`enrollments` `e` join `students` `s` on((`e`.`student_id` = `s`.`student_id`))) join `course_offerings` `co` on((`e`.`offering_id` = `co`.`offering_id`))) join `courses` `c` on((`co`.`course_id` = `c`.`course_id`))) join `teachers` `t` on((`co`.`teacher_id` = `t`.`teacher_id`))) join `semesters` `sem` on((`co`.`semester_id` = `sem`.`semester_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_fee_details`
--

/*!50001 DROP VIEW IF EXISTS `v_fee_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_fee_details` AS select `fp`.`payment_id` AS `payment_id`,`fp`.`student_id` AS `student_id`,concat(`s`.`first_name`,' ',`s`.`last_name`) AS `student_name`,`s`.`reg_no` AS `reg_no`,`p`.`program_name` AS `program_name`,`fp`.`fee_type` AS `fee_type`,`fp`.`amount` AS `amount`,`fp`.`due_date` AS `due_date`,`fp`.`paid_date` AS `paid_date`,`fp`.`payment_method` AS `payment_method`,`fp`.`receipt_no` AS `receipt_no`,`fp`.`status` AS `status`,`fp`.`remarks` AS `remarks`,(to_days(curdate()) - to_days(`fp`.`due_date`)) AS `days_overdue` from ((`fee_payments` `fp` join `students` `s` on((`fp`.`student_id` = `s`.`student_id`))) join `programs` `p` on((`s`.`program_id` = `p`.`program_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_result_details`
--

/*!50001 DROP VIEW IF EXISTS `v_result_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_result_details` AS select `r`.`result_id` AS `result_id`,`r`.`student_id` AS `student_id`,concat(`s`.`first_name`,' ',`s`.`last_name`) AS `student_name`,`s`.`reg_no` AS `reg_no`,`r`.`exam_id` AS `exam_id`,`e`.`exam_name` AS `exam_name`,`e`.`exam_type` AS `exam_type`,`e`.`exam_date` AS `exam_date`,`e`.`total_marks` AS `total_marks`,`r`.`obtained_marks` AS `obtained_marks`,round(((`r`.`obtained_marks` / `e`.`total_marks`) * 100),2) AS `percentage`,`r`.`grade` AS `grade`,`r`.`grade_points` AS `grade_points`,`r`.`remarks` AS `remarks`,`c`.`course_name` AS `course_name`,`c`.`course_code` AS `course_code`,concat(`t`.`first_name`,' ',`t`.`last_name`) AS `teacher_name`,`sem`.`semester_name` AS `semester_name` from ((((((`results` `r` join `students` `s` on((`r`.`student_id` = `s`.`student_id`))) join `exams` `e` on((`r`.`exam_id` = `e`.`exam_id`))) left join `course_offerings` `co` on((`e`.`course_offering_id` = `co`.`offering_id`))) left join `courses` `c` on((`co`.`course_id` = `c`.`course_id`))) left join `teachers` `t` on((`co`.`teacher_id` = `t`.`teacher_id`))) left join `semesters` `sem` on((`co`.`semester_id` = `sem`.`semester_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_room_details`
--

/*!50001 DROP VIEW IF EXISTS `v_room_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_room_details` AS select `r`.`room_id` AS `room_id`,`r`.`room_number` AS `room_number`,`r`.`room_type` AS `room_type`,`r`.`capacity` AS `capacity`,`r`.`occupied` AS `occupied`,(`r`.`capacity` - `r`.`occupied`) AS `available_beds`,`r`.`monthly_fee` AS `monthly_fee`,`r`.`floor_number` AS `floor_number`,`r`.`has_ac` AS `has_ac`,`r`.`has_attached_bath` AS `has_attached_bath`,`r`.`status` AS `status`,`h`.`hostel_id` AS `hostel_id`,`h`.`hostel_name` AS `hostel_name`,`h`.`hostel_type` AS `hostel_type` from (`hostel_rooms` `r` join `hostels` `h` on((`r`.`hostel_id` = `h`.`hostel_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_student_details`
--

/*!50001 DROP VIEW IF EXISTS `v_student_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_student_details` AS select `s`.`student_id` AS `student_id`,`s`.`reg_no` AS `reg_no`,concat(`s`.`first_name`,' ',`s`.`last_name`) AS `full_name`,`s`.`email` AS `email`,`s`.`phone` AS `phone`,`s`.`gender` AS `gender`,`s`.`cgpa` AS `cgpa`,`s`.`current_semester` AS `current_semester`,`s`.`status` AS `status`,`p`.`program_name` AS `program_name`,`p`.`degree_type` AS `degree_type`,`d`.`dept_name` AS `dept_name` from ((`students` `s` join `programs` `p` on((`s`.`program_id` = `p`.`program_id`))) join `departments` `d` on((`p`.`dept_id` = `d`.`dept_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_student_gpa`
--

/*!50001 DROP VIEW IF EXISTS `v_student_gpa`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_student_gpa` AS select `s`.`student_id` AS `student_id`,concat(`s`.`first_name`,' ',`s`.`last_name`) AS `student_name`,`s`.`reg_no` AS `reg_no`,count(distinct `r`.`result_id`) AS `total_exams`,round(avg(`r`.`grade_points`),2) AS `cgpa`,round(avg(((`r`.`obtained_marks` / `e`.`total_marks`) * 100)),2) AS `avg_percentage`,sum((case when (`r`.`grade` = 'F') then 1 else 0 end)) AS `failed_exams` from ((`students` `s` left join `results` `r` on((`s`.`student_id` = `r`.`student_id`))) left join `exams` `e` on((`r`.`exam_id` = `e`.`exam_id`))) group by `s`.`student_id`,`s`.`first_name`,`s`.`last_name`,`s`.`reg_no` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_teacher_details`
--

/*!50001 DROP VIEW IF EXISTS `v_teacher_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_teacher_details` AS select `t`.`teacher_id` AS `teacher_id`,`t`.`emp_no` AS `emp_no`,concat(`t`.`first_name`,' ',`t`.`last_name`) AS `full_name`,`t`.`first_name` AS `first_name`,`t`.`last_name` AS `last_name`,`t`.`email` AS `email`,`t`.`phone` AS `phone`,`t`.`qualification` AS `qualification`,`t`.`designation` AS `designation`,`t`.`joining_date` AS `joining_date`,`t`.`status` AS `status`,`d`.`dept_name` AS `dept_name`,`d`.`dept_id` AS `dept_id`,(select count(0) from `course_offerings` `co` where (`co`.`teacher_id` = `t`.`teacher_id`)) AS `total_courses_assigned` from (`teachers` `t` join `departments` `d` on((`t`.`dept_id` = `d`.`dept_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-08 13:06:31
