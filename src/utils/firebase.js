import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQlX9rN5bkm_t93_FSVsxCccs9LnU5YqA",
  authDomain: "financetracker-96055.firebaseapp.com",
  projectId: "financetracker-96055",
  storageBucket: "financetracker-96055.firebasestorage.app",
  messagingSenderId: "851174657666",
  appId: "1:851174657666:web:989f45367f8b621bd32e9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };