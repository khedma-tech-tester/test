import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();

export const AdminStats = {
    /**
     * جلب إحصائيات عامة للنظام
     */
    async getGlobalStats() {
        try {
            const ordersSnap = await getDocs(collection(db, "orders"));
            const usersSnap = await getDocs(collection(db, "users"));
            
            let totalRevenue = 0;
            let completedOrders = 0;
            let activeProviders = 0;

            // 1. حساب الأرباح والطلبات المكتملة
            ordersSnap.forEach(doc => {
                const data = doc.data();
                if (data.status === 'completed') {
                    totalRevenue += (data.finalPrice || 0);
                    completedOrders++;
                }
            });

            // 2. حساب عدد الفنيين النشطين
            usersSnap.forEach(doc => {
                if (doc.data().role === 'provider') activeProviders++;
            });

            return {
                revenue: totalRevenue,
                commission: totalRevenue * 0.10, // صافي ربحك 10%
                ordersCount: completedOrders,
                providersCount: activeProviders,
                usersCount: usersSnap.size
            };
        } catch (err) {
            console.error("Stats Error:", err);
            return null;
        }
    },

    /**
     * تحليل المناطق الأكثر طلباً في المنصورة
     */
    async getTopRegions() {
        const ordersSnap = await getDocs(collection(db, "orders"));
        const regions = {};

        ordersSnap.forEach(doc => {
            const region = doc.data().region || "غير محدد";
            regions[region] = (regions[region] || 0) + 1;
        });

        // ترتيب المناطق من الأكثر للأقل طلباً
        return Object.entries(regions).sort((a, b) => b[1] - a[1]);
    }
};

window.KhedmaAdminLogic = AdminStats;