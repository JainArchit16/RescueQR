// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCKFpT8lq2csZClDs8TJIp0ducX0_YNwCc",
  authDomain: "rescueqr-6b0e4.firebaseapp.com",
  projectId: "rescueqr-6b0e4",
  storageBucket: "rescueqr-6b0e4.appspot.com",
  messagingSenderId: "439777976113",
  appId: "1:439777976113:web:13cd43c6f6f051ffb75a10",
  measurementId: "G-H8M810W5X6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export default app;
export const db = getFirestore(app);
