import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCkRJZ1YwN8Hqn501hAWwWeBI8_1x3o2Pk",
    authDomain: "khedma-tech-tester.firebaseapp.com",
    projectId: "khedma-tech-tester",
    storageBucket: "khedma-tech-tester.firebasestorage.app",
    messagingSenderId: "51468270453",
    appId: "1:51468270453:web:ec2e1cb0de753eceeab13c",
    measurementId: "G-9D8XG4Z6M7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

console.log("Khedma Tech: Firebase System Connected Successfully.");