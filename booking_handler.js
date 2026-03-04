import { getFirestore, doc, updateDoc, arrayUnion, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { NotificationSystem } from "./notifications.js";

const db = getFirestore();

export const BookingHandler = {
    // تأكيد موعد بين العميل والفني
    async confirmSchedule(orderId, providerId, selectedDate) {
        try {
            const orderRef = doc(db, "orders", orderId);
            const providerRef = doc(db, "users", providerId);

            // 1. تحديث بيانات الطلب بالموعد النهائي
            await updateDoc(orderRef, {
                scheduledDate: selectedDate,
                status: "scheduled",
                updatedAt: serverTimestamp()
            });

            // 2. إضافة الموعد لجدول الفني لمنع الحجوزات المزدوجة
            await updateDoc(providerRef, {
                busySlots: arrayUnion(selectedDate)
            });

            // 3. إشعار العميل بتأكيد الموعد
            const orderSnap = await getDoc(orderRef);
            const clientId = orderSnap.data().clientId;
            
            await NotificationSystem.send(
                clientId, 
                `تم تأكيد موعد الزيارة بتاريخ ${selectedDate}. الفني في انتظارك.`,
                "success"
            );

            return { success: true };
        } catch (err) {
            console.error("Booking Error:", err);
            return { success: false, error: err.message };
        }
    },

    // التحقق من توافر الفني في وقت محدد
    async isProviderAvailable(providerId, dateString) {
        const docSnap = await getDoc(doc(db, "users", providerId));
        if (docSnap.exists()) {
            const busySlots = docSnap.data().busySlots || [];
            return !busySlots.includes(dateString);
        }
        return false;
    }
};

window.KhedmaBooking = BookingHandler;