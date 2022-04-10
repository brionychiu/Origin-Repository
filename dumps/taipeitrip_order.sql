CREATE DATABASE  IF NOT EXISTS `website` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `website`;
-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: website
-- ------------------------------------------------------
-- Server version	8.0.27

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
-- Table structure for table `taipeitrip_order`
--

DROP TABLE IF EXISTS `taipeitrip_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taipeitrip_order` (
  `member_id` bigint NOT NULL,
  `order_number` varchar(70) DEFAULT NULL,
  `attraction_id` int NOT NULL,
  `attraction_image` varchar(500) DEFAULT NULL,
  `order_date` varchar(20) NOT NULL,
  `order_time` varchar(20) NOT NULL,
  `order_price` int NOT NULL,
  `contact_name` varchar(20) NOT NULL,
  `contact_mail` varchar(50) NOT NULL,
  `contact_phone` int NOT NULL,
  UNIQUE KEY `order_number` (`order_number`),
  KEY `member_id` (`member_id`),
  KEY `attraction_id` (`attraction_id`),
  KEY `order_number_2` (`order_number`),
  KEY `order_number_3` (`order_number`),
  CONSTRAINT `taipeitrip_order_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `taipeitrip_member` (`id`) ON DELETE CASCADE,
  CONSTRAINT `taipeitrip_order_ibfk_2` FOREIGN KEY (`attraction_id`) REFERENCES `taipei_attrs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taipeitrip_order`
--

LOCK TABLES `taipeitrip_order` WRITE;
/*!40000 ALTER TABLE `taipeitrip_order` DISABLE KEYS */;
INSERT INTO `taipeitrip_order` VALUES (1,'20220405204545294322383086705',10,'https://yourdomain.com/images/attraction/10.jpg','2022-01-31','afternoon',2000,'彭彭彭','ply@ply.com',912345678),(1,'2022040723531',2,'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2022-04-06','day',2000,'123','123',123),(2,'2022040812152',11,'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D226/E920/F665/1f26af86-e907-44c9-b4d7-5c498dacfc6c.jpg','2022-04-27','night',2500,'234','234',234),(1,'2022040812191',26,'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000358.jpg','2022-04-14','day',2000,'123','123',123),(12,'20220409235612',7,'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000979.jpg','2022-04-27','day',2000,'小肥','werwer@com.tw',987600000),(12,'20220410150012',2,'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2022-04-05','day',2000,'阿吉','4545@mail.com',987666444),(12,'20220410151412',7,'https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000979.jpg','2022-03-31','day',2000,'micky','fff@mail.com',965444333);
/*!40000 ALTER TABLE `taipeitrip_order` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-10 15:19:55
