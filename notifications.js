import { getFirestore, collection, query, where, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

export const NotificationSystem = {
    init() {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(db, "notifications"),
            where("recipientId", "==", user.uid),
            where("read", "==", false)
        );

        onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    this.showToast(change.doc.data().message);
                    this.playSound();
                }
            });
        });
    },

    async send(recipientId, message, type = "info") {
        await addDoc(collection(db, "notifications"), {
            recipientId,
            message,
            type,
            read: false,
            timestamp: serverTimestamp()
        });
    },

    showToast(msg) {
        const toast = document.createElement('div');
        toast.className = "fixed bottom-5 right-5 bg-blue-600 text-white p-5 rounded-2xl shadow-2xl z-[9999] font-900 animate-bounce";
        toast.innerHTML = `<i class="fas fa-bell ml-2"></i> ${msg}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    },

    playSound() {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
        audio.play().catch(e => console.log("Audio play blocked"));
    }
};

window.KhedmaNotify = NotificationSystem;