// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA6hAR3n1bx_-J5PzbhvMjS0LyPsN0o-TI",
    authDomain: "moviefinderforyou-abc3a.firebaseapp.com",
    projectId: "moviefinderforyou-abc3a",
    storageBucket: "moviefinderforyou-abc3a.firebasestorage.app",
    messagingSenderId: "770005926559",
    appId: "1:770005926559:web:e6eee5a148fe4d991758aa",
    measurementId: "G-67QFPGPQ8T",
};

// Prevent duplicate app init (Next.js hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Analytics only runs in browser (not SSR)
export async function initAnalytics() {
    const supported = await isSupported();
    if (supported) {
        const { getAnalytics } = await import("firebase/analytics");
        return getAnalytics(app);
    }
    return null;
}

export default app;