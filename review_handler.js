import { getFirestore, collection, addDoc, doc, updateDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();

export const ReviewSystem = {
    /**
     * إرسال تقييم جديد لفني
     * @param {string} providerId - معرف الفني
     * @param {number} stars - عدد النجوم (1-5)
     * @param {string} comment - تعليق العميل
     */
    async submitReview(providerId, stars, comment, clientId) {
        try {
            // 1. إضافة التقييم لمجموعة التقييمات
            await addDoc(collection(db, "reviews"), {
                providerId,
                clientId,
                stars: Number(stars),
                comment,
                timestamp: serverTimestamp()
            });

            // 2. تحديث متوسط تقييم الفني
            await this.updateProviderRating(providerId);

            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    // دالة داخلية لحساب المتوسط
    async updateProviderRating(providerId) {
        const q = query(collection(db, "reviews"), where("providerId", "==", providerId));
        const snapshot = await getDocs(q);
        
        let totalStars = 0;
        snapshot.forEach(doc => totalStars += doc.data().stars);
        
        const average = (totalStars / snapshot.size).toFixed(1);

        // تحديث الرقم في ملف الفني الشخصي
        await updateDoc(doc(db, "users", providerId), {
            rating: Number(average),
            reviewsCount: snapshot.size
        });
    }
};

window.KhedmaReviews = ReviewSystem;