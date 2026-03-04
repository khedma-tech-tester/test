import { getFirestore, doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();

export const FactoryInventory = {
    // تحديث المخزون عند بيع كمية معينة
    async deductStock(productId, litersDeducted) {
        try {
            const productRef = doc(db, "factory_inventory", productId);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
                const currentStock = productSnap.data().stockLevel;
                const newStock = currentStock - litersDeducted;

                if (newStock < 0) throw new Error("المخزون غير كافٍ!");

                await updateDoc(productRef, {
                    stockLevel: newStock,
                    lastUpdated: new Date()
                });

                // فحص التنبيه
                if (newStock <= productSnap.data().minLimit) {
                    this.sendAlert(productSnap.data().name, newStock);
                }
            }
        } catch (err) {
            console.error("Inventory Error:", err.message);
        }
    },

    // تنبيه الإدارة عند قرب نفاذ مادة خام
    sendAlert(productName, currentLevel) {
        console.warn(`⚠️ تنبيه مخزن المنظفات: مادة [${productName}] أوشكت على النفاذ. الكمية الحالية: ${currentLevel} لتر فقط!`);
        // يمكن هنا ربطها بإرسال رسالة واتساب تلقائية لك
    },

    // مراقبة المخزن حياً (Real-time)
    monitorStock(callback) {
        return onSnapshot(doc(db, "app_settings", "inventory_summary"), (doc) => {
            callback(doc.data());
        });
    }
};

window.KhedmaInventory = FactoryInventory;