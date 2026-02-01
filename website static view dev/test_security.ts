
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Config from lib/firebase.ts
const firebaseConfig = {
    apiKey: "AIzaSyBflxVL7tirRZVCZrD5xus_jibAiQAy8TI",
    authDomain: "teravolta-41afd.firebaseapp.com",
    projectId: "teravolta-41afd",
    storageBucket: "teravolta-41afd.firebasestorage.app",
    messagingSenderId: "60172356650",
    appId: "1:60172356650:web:b0f23efc1806297fd1c753"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testPublicWrite() {
    console.log("Attempting to write to 'quotes' as unauthenticated user...");
    try {
        await addDoc(collection(db, "quotes"), {
            test: "security_audit",
            timestamp: new Date()
        });
        console.log("FAIL: Write successful (expected failure)");
        process.exit(1);
    } catch (error: any) {
        if (error.code === 'permission-denied') {
            console.log("PASS: Write denied (permission-denied) as expected.");
            process.exit(0);
        } else {
            console.log("ERROR: Write failed with unexpected error:", error.code, error.message);
            process.exit(1);
        }
    }
}

testPublicWrite();
