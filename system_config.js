/**
 * الإعدادات المركزية لمنصة خِدمة تك
 * التحكم في السياسات العامة وحالة النظام
 */

export const SystemConfig = {
    // حالة النظام (تشغيل / صيانة)
    settings: {
        maintenanceMode: false, // إذا كان true، سيتحول التطبيق لصفحة "نحن في صيانة"
        allowNewProviders: true, // فتح أو غلق باب التسجيل للفنيين الجدد
        appVersion: "1.5.0",
        cityFocus: "Mansoura"
    },

    // السياسات المالية
    finance: {
        commissionRate: 0.10,   // عمولة المنصة 10%
        minWithdrawal: 100,      // أقل مبلغ يمكن للفني سحبه (جنيه)
        emergencyMultiplier: 1.5, // مضاعف سعر خدمات الطوارئ
        currency: "EGP"
    },

    // حدود الأمان
    security: {
        maxLoginAttempts: 5,
        sessionTimeout: 3600 * 24 // صلاحية الجلسة بالثواني (24 ساعة)
    },

    // تفعيل الميزات التجريبية
    features: {
        chatImages: true,
        voiceNotes: false, // ميزة قيد التطوير
        aiDiagnosis: false  // تشخيص الأعطال بالذكاء الاصطناعي
    },

    // دالة لتحديث الإعدادات برمجياً
    async updateSetting(key, value) {
        console.log(`[System] تم تحديث ${key} إلى ${value}`);
        // هنا يتم الربط مع Firestore لتحديث الإعدادات لحظياً لجميع المستخدمين
    }
};

window.KhedmaConfig = SystemConfig;