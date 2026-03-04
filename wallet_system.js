import { getFirestore, doc, updateDoc, increment, runTransaction, serverTimestamp, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();

export const WalletSystem = {
    
    async deposit(userId, amount, method = "fawry") {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                wallet: increment(amount)
            });
            await this.logTransaction(userId, "deposit", amount, `شحن عبر ${method}`);
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
    },

    async payForService(clientId, providerId, amount, orderId) {
        try {
            await runTransaction(db, async (transaction) => {
                const clientRef = doc(db, "users", clientId);
                const providerRef = doc(db, "users", providerId);
                const orderRef = doc(db, "orders", orderId);

                const clientSnap = await transaction.get(clientRef);
                if (clientSnap.data().wallet < amount) {
                    throw "رصيدك غير كافٍ لإتمام العملية";
                }

                transaction.update(clientRef, { wallet: increment(-amount) });
                transaction.update(providerRef, { wallet: increment(amount) });
                transaction.update(orderRef, { status: "paid" });
            });

            await this.logTransaction(clientId, "payment", -amount, `دفع مقابل خدمة رقم ${orderId}`);
            await this.logTransaction(providerId, "earning", amount, `استلام مستحقات خدمة رقم ${orderId}`);
            
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    },

    async logTransaction(userId, type, amount, note) {
        await addDoc(collection(db, "transactions"), {
            userId,
            type,
            amount,
            note,
            timestamp: serverTimestamp()
        });
    }
};

window.KhedmaWallet = WalletSystem;