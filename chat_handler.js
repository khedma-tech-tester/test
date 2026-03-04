import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();

export const ChatEngine = {
    // إرسال رسالة جديدة
    async sendMessage(orderId, senderId, text, type = "text") {
        try {
            await addDoc(collection(db, "chats"), {
                orderId: orderId,       // ربط المحادثة بطلب الصيانة
                senderId: senderId,     // معرف الراسل (فني أو عميل)
                message: text,
                type: type,             // نص أو صورة
                timestamp: serverTimestamp()
            });
            return { success: true };
        } catch (err) {
            console.error("خطأ في الإرسال:", err);
            return { success: false, error: err.message };
        }
    },

    // الاستماع للرسائل الجديدة (Real-time)
    listenToMessages(orderId, callback) {
        const q = query(
            collection(db, "chats"),
            where("orderId", "==", orderId),
            orderBy("timestamp", "asc")
        );

        // هذا الجزء يحدث الواجهة تلقائياً عند وصول أي رسالة
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    }
};

window.KhedmaChat = ChatEngine;