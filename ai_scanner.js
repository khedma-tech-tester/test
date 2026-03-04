import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();

export const AIScanner = {
    isScanning: false,
    videoElement: null,

    async initCamera(videoSelector) {
        this.videoElement = document.querySelector(videoSelector);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            this.videoElement.srcObject = stream;
            this.videoElement.play();
            return true;
        } catch (err) {
            console.error("Camera Error:", err);
            return false;
        }
    },

    async analyzeFrame() {
        if (!this.videoElement) return;
        
        console.log("AI is analyzing visual patterns...");
        
        return new Promise((resolve) => {
            setTimeout(async () => {
                const mockDetectedBrand = "Pepsi"; 
                const result = await this.checkBoycottStatus(mockDetectedBrand);
                resolve(result);
            }, 1500);
        });
    },

    async checkBoycottStatus(brandName) {
        const q = query(collection(db, "boycott_list"), where("name", "==", brandName));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            return {
                isBoycott: true,
                reason: data.reason,
                alternatives: data.alternatives // مصفوفة البدائل المصرية
            };
        }
        
        return { isBoycott: false };
    },

    stopCamera() {
        if (this.videoElement && this.videoElement.srcObject) {
            const tracks = this.videoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    }
};

window.KhedmaAI = AIScanner;