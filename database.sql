-- انشاء قاعدة البيانات
CREATE DATABASE courses_db;
USE courses_db;

-- انشاء جدول المستخدمين
CREATE TABLE users (
    id       INT AUTO_INCREMENT PRIMARY KEY,  -- رقم المستخدم (تلقائي)
    name     VARCHAR(100) NOT NULL,           -- الاسم
    email    VARCHAR(100) NOT NULL UNIQUE,    -- الايميل (لا يتكرر)
    password VARCHAR(255) NOT NULL            -- كلمة السر (مشفرة)
);