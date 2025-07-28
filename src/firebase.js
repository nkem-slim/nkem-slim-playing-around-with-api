import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPUPiNK77Ax9WTrMiTuaao39d3CCbYtrs",
  authDomain: "ocr-ce.firebaseapp.com",
  projectId: "ocr-ce",
  storageBucket: "ocr-ce.appspot.com",
  messagingSenderId: "445591329077",
  appId: "1:445591329077:web:50acebafad07b9d693947c",
  measurementId: "G-7CBPD5L53B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
