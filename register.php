<?php
// لو حد فتح الملف مباشرة نرجعه للصفحة الرئيسية
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.html");
    exit;
}

// اعدادات الاتصال
$host = "localhost";
$user = "root";
$pass = "";
$db   = "courses_db";

// اتصال MySQL بدون تحديد قاعدة بيانات (علشان ننشئها تلقائياً لو مش موجودة)
$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("❌ فشل الاتصال: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");

// انشاء قاعدة البيانات والجدول تلقائياً
$conn->query("CREATE DATABASE IF NOT EXISTS $db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
$conn->select_db($db);
$conn->query("CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
)");

// استقبال البيانات
$name     = trim($_POST["name"] ?? "");
$email    = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

if ($name === "" || $email === "" || $password === "") {
    die("⚠️ من فضلك املأ كل الحقول.");
}

// حفظ البيانات
$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashed);

if ($stmt->execute()) {
    echo "✅ تم التسجيل بنجاح يا " . htmlspecialchars($name) . " <br><a href='index.html'>رجوع للموقع</a>";
} else {
    echo "⚠️ الايميل مسجل قبل كده أو في مشكلة بالبيانات. <br><a href='index.html'>رجوع</a>";
}

$stmt->close();
$conn->close();
?>
