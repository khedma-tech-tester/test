import { getFirestore, collection, query, getDocs, doc, updateDoc, deleteDoc, where, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();

export const AdminEngine = {
    // جلب جميع الفنيين الذين ينتظرون التوثيق
    async getPendingProviders() {
        const q = query(collection(db, "users"), where("role", "==", "provider"), where("isVerified", "==", false));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // اعتماد فني وتفعيل حسابه للعمل
    async verifyProvider(uid) {
        try {
            await updateDoc(doc(db, "users", uid), {
                isVerified: true,
                verificationDate: new Date()
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    // حظر مستخدم (عميل أو فني)
    async banUser(uid) {
        try {
            await updateDoc(doc(db, "users", uid), {
                status: 'banned',
                banDate: new Date()
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    // حساب إجمالي أرباح المنصة من العمولات
    async getPlatformRevenue() {
        const q = query(collection(db, "transactions"), where("type", "==", "commission"));
        const snapshot = await getDocs(q);
        let total = 0;
        snapshot.forEach(doc => total += doc.data().amount);
        return total;
    },

    // حذف طلب صيانة (في حال كان وهمياً أو مخالفاً)
    async deleteOrder(orderId) {
        try {
            await deleteDoc(doc(db, "orders", orderId));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
};

window.KhedmaAdmin = AdminEngine;