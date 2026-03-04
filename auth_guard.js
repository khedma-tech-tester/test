import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

export const AuthGuard = {
    checkAccess(requiredRole = 'user') {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = 'client_gate.html';
                return;
            }

            if (requiredRole !== 'user') {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.role !== requiredRole && userData.role !== 'admin') {
                        alert('غير مسموح لك بالدخول لهذه الصفحة');
                        window.location.href = 'index.html';
                    }
                } else {
                    window.location.href = 'client_gate.html';
                }
            }
        });
    },

    async getCurrentUserRole() {
        const user = auth.currentUser;
        if (!user) return null;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        return userDoc.exists() ? userDoc.data().role : null;
    }
};

window.Guard = AuthGuard;