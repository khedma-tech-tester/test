import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

export const EmergencySystem = {
    async triggerSOS(type, location) {
        const user = auth.currentUser;
        if (!user) return { success: false, error: "يجب تسجيل الدخول أولاً" };

        try {
            // 1. إنشاء طلب طوارئ في قاعدة البيانات بوضع "فوري"
            const sosRef = await addDoc(collection(db, "emergency_calls"), {
                clientId: user.uid,
                clientPhone: user.phoneNumber || "غير مسجل",
                emergencyType: type, // سباكة أو كهرباء
                location: location,
                status: "searching",
                timestamp: serverTimestamp()
            });

            // 2. البحث عن أقرب فنيين متاحين (محاكاة البحث الجغرافي)
            const providersQ = query(
                collection(db, "users"),
                where("role", "==", "provider"),
                where("isAvailable", "==", true),
                where("specialty", "==", type)
            );

            const snapshot = await getDocs(providersQ);
            
            // 3. إرسال إشعارات دفع (Push Notifications) للفنيين
            snapshot.forEach(async (doc) => {
                await addDoc(collection(db, "notifications"), {
                    recipientId: doc.id,
                    message: `🚨 بلاغ طوارئ فوري: ${type} في ${location}`,
                    type: "SOS",
                    orderId: sosRef.id,
                    timestamp: serverTimestamp()
                });
            });

            return { success: true, callId: sosRef.id };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
};

window.KhedmaSOS = EmergencySystem;