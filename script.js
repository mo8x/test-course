// زر تبديل الوضع الليلي والنهاري
var btn = document.getElementById("theme-btn");

// لما الصفحة تفتح: نشوف المستخدم كان مختار ايه قبل كده
if (btn && localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    btn.textContent = "☀️";
}

// لما يضغط على الزر: نبدل الوضع ونحفظ الاختيار
if (btn) {
    btn.onclick = function () {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            btn.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        } else {
            btn.textContent = "🌙";
            localStorage.setItem("theme", "light");
        }
    };
}


// ============================================
//  نظام التسجيل - يحفظ البيانات في localStorage
//  (يعمل كقاعدة بيانات محلية في المتصفح)
// ============================================

var form = document.getElementById("register-form");
var msg = document.getElementById("msg");

// دالة تجيب كل المستخدمين المحفوظين
function getUsers() {
    var data = localStorage.getItem("users");
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

// دالة تعرض المستخدمين في الصفحة
function showUsers() {
    var users = getUsers();
    var list = document.getElementById("users-list");
    if (!list) return;

    // لو مفيش مستخدمين
    if (users.length === 0) {
        list.innerHTML = "<p style='text-align:center;color:#888'>لا يوجد مستخدمين مسجلين بعد</p>";
        return;
    }

    // عرض كل مستخدم في بطاقة
    var html = "";
    for (var i = 0; i < users.length; i++) {
        html += "<div class='user-card'>";
        html += "<strong>👤 " + users[i].name + "</strong>";
        html += "<span>📧 " + users[i].email + "</span>";
        if (users[i].courses && users[i].courses.length > 0) {
            html += "<p style='font-size: 0.9em; color: gray; margin-top: 5px;'>الكورسات: " + users[i].courses.join("، ") + "</p>";
        }
        html += "</div>";
    }
    list.innerHTML = html;
}

// لما المستخدم يبعت الفورم
if (form) {
    form.onsubmit = function (e) {
        e.preventDefault(); // نمنع الصفحة من اعادة التحميل

        // نجيب البيانات من الحقول
        var name = document.getElementById("reg-name").value.trim();
        var email = document.getElementById("reg-email").value.trim();
        var password = document.getElementById("reg-password").value;
        if (!name || !email || !password) return;

        // نجيب المستخدمين الحاليين
        var users = getUsers();

        // نتأكد ان الايميل مش مسجل قبل كده
        for (var i = 0; i < users.length; i++) {
            if (users[i].email === email) {
                if (msg) {
                    msg.textContent = "⚠️ الايميل ده مسجل قبل كده!";
                    msg.style.color = "#e74c3c";
                }
                return;
            }
        }

        // نضيف المستخدم الجديد
        users.push({
            name: name,
            email: email,
            password: password, // في الواقع لازم تتشفر (بس ده للتعلم فقط)
            courses: [] // قائمة الكورسات المسجلة
        });

        // نحفظ في localStorage (قاعدة البيانات المحلية)
        localStorage.setItem("users", JSON.stringify(users));

        // نظهر رسالة نجاح
        if (msg) {
            msg.textContent = "✅ تم التسجيل بنجاح يا " + name + "!";
            msg.style.color = "#27ae60";
        }

        // نفضي الفورم
        form.reset();

        // نحدث قائمة المستخدمين
        showUsers();
    };
}

// ============================================
// نظام تسجيل الدخول والكورسات
// ============================================

var loginForm = document.getElementById("login-form");
var loginMsg = document.getElementById("login-msg");
var logoutBtn = document.getElementById("logout-btn");

var navLoginBtn = document.getElementById("nav-login-btn");
var navRegisterBtn = document.getElementById("nav-register-btn");
var userGreeting = document.getElementById("user-greeting");

var loginSection = document.getElementById("login");
var registerSection = document.getElementById("register");
var myCoursesSection = document.getElementById("my-courses-section");
var myCoursesList = document.getElementById("my-courses-list");

// للحصول على المستخدم المسجل حالياً من الجلسة
function getCurrentUser() {
    var userDetails = sessionStorage.getItem("loggedInUser");
    return userDetails ? JSON.parse(userDetails) : null;
}

function updateUI() {
    var currentUser = getCurrentUser();
    if (currentUser) {
        // تحديث شريط التنقل
        if (navLoginBtn) navLoginBtn.style.display = "none";
        if (navRegisterBtn) navRegisterBtn.style.display = "none";
        if (userGreeting) {
            userGreeting.textContent = "👋 أهلاً يا " + currentUser.name;
            userGreeting.style.display = "inline";
        }
        if (logoutBtn) logoutBtn.style.display = "inline-block";

        // إخفاء نماذج الدخول والتسجيل
        if (loginSection) loginSection.style.display = "none";
        if (registerSection) registerSection.style.display = "none";

        // إظهار قسم كورساتي
        if (myCoursesSection) {
            myCoursesSection.style.display = "block";
            showMyCourses();
        }
    } else {
        // تحديث شريط التنقل
        if (navLoginBtn) navLoginBtn.style.display = "inline-block";
        if (navRegisterBtn) navRegisterBtn.style.display = "inline-block";
        if (userGreeting) userGreeting.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";

        // إظهار نماذج الدخول والتسجيل
        if (loginSection) loginSection.style.display = "block";
        if (registerSection) registerSection.style.display = "block";

        // إخفاء قسم كورساتي
        if (myCoursesSection) myCoursesSection.style.display = "none";
    }
}

// دالة تسجيل الدخول
if (loginForm) {
    loginForm.onsubmit = function (e) {
        e.preventDefault();
        var email = document.getElementById("login-email").value.trim();
        var password = document.getElementById("login-password").value;
        var users = getUsers();
        
        var foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
            sessionStorage.setItem("loggedInUser", JSON.stringify(foundUser));
            if (loginMsg) {
                loginMsg.textContent = "✅ تم تسجيل الدخول بنجاح!";
                loginMsg.style.color = "green";
            }
            loginForm.reset();
            updateUI();
        } else {
            if (loginMsg) {
                loginMsg.textContent = "❌ البريد الإلكتروني أو كلمة المرور غير صحيحة";
                loginMsg.style.color = "red";
            }
        }
    };
}

// دالة تسجيل الخروج
if (logoutBtn) {
    logoutBtn.onclick = function () {
        sessionStorage.removeItem("loggedInUser");
        updateUI();
        if (loginMsg) loginMsg.textContent = "";
    };
}

// التسجيل في الكورسات
var enrollButtons = document.querySelectorAll(".enroll-btn");
enrollButtons.forEach(function (btn) {
    btn.onclick = function () {
        var currentUser = getCurrentUser();
        if (!currentUser) {
            alert("يرجى تسجيل الدخول أولاً لتتمكن من التسجيل في الكورسات!");
            window.location.href = "index.html#login";
            return;
        }

        var courseName = this.getAttribute("data-course");
        var users = getUsers();
        
        // البحث عن المستخدم في جميع المستخدمين لتحديث بياناته
        for (var i = 0; i < users.length; i++) {
            if (users[i].email === currentUser.email) {
                if (!users[i].courses) users[i].courses = [];
                
                if (users[i].courses.includes(courseName)) {
                    alert("لقد قمت بالتسجيل في هذا الكورس مسبقاً!");
                } else {
                    users[i].courses.push(courseName);
                    localStorage.setItem("users", JSON.stringify(users));
                    
                    // تحديث الجلسة
                    currentUser.courses = users[i].courses;
                    sessionStorage.setItem("loggedInUser", JSON.stringify(currentUser));
                    
                    alert("تم التسجيل في كورس " + courseName + " بنجاح!");
                    showMyCourses();
                    showUsers(); // تحديث قائمة المستخدمين تحت
                }
                break;
            }
        }
    };
});

// عرض كورسات المستخدم
function showMyCourses() {
    var currentUser = getCurrentUser();
    if (!currentUser || !myCoursesList) return;

    if (!currentUser.courses || currentUser.courses.length === 0) {
        myCoursesList.innerHTML = "<p>لم تقم بالتسجيل في أي كورس بعد.</p>";
        return;
    }

    var html = "";
    for (var i = 0; i < currentUser.courses.length; i++) {
        html += "<li style='margin:5px; padding:10px; font-weight:bold;'>📘 " + currentUser.courses[i] + "</li>";
    }
    myCoursesList.innerHTML = html;
}

// أول ما الصفحة تفتح
updateUI();

// لما الصفحة تفتح: نعرض المستخدمين المحفوظين
showUsers();

// ============================================
// عداد الزوار
// ============================================
var visitorCountEl = document.getElementById("visitor-count");
if (visitorCountEl) {
    var count = localStorage.getItem("siteVisitorCount");
    if (!count) {
        count = 1250; // رقم بداية مشجع
    } else {
        count = parseInt(count) + 1; // زيادة العداد مع كل زيارة
    }
    localStorage.setItem("siteVisitorCount", count);
    visitorCountEl.textContent = count;
}
