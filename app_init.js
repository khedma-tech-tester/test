/**
 * المحرك الرئيسي لربط صفحات خِدمة تك
 * وظيفة هذا الملف: الربط الإجباري والتأكد من هوية المستخدم
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./firebase_config.js"; // تأكد من وجود مفاتيحك هنا

// 1. تشغيل المحرك
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 2. فحص الأمان (إجباري)
// يمنع أي حد يدخل الصفحات الداخلية بدون تسجيل دخول
const protectedPages = [
    'main_dashboard.html', 
    'wallet.html', 
    'booking.html', 
    'admin_panel.html',
    'user_profile_edit.html'
];

const currentPage = window.location.pathname.split('/').pop();

onAuthStateChanged(auth, (user) => {
    if (protectedPages.includes(currentPage)) {
        if (!user) {
            console.warn("🚫 وصول غير مصرح به.. جاري التحويل لصفحة الدخول");
            window.location.href = 'login.html';
        } else {
            console.log("✅ المستخدم متصل: " + user.email);
            // هنا ممكن تضيف كود يظهر اسم المستخدم في الهيدر أوتوماتيك
            updateUI(user);
        }
    }
});

function updateUI(user) {
    const userNameElement = document.getElementById('user-display-name');
    if (userNameElement) {
        userNameElement.innerText = user.displayName || "عميل خِدمة تك";
    }
}

console.log("🚀 Khedma Tech System: Connected & Ready");