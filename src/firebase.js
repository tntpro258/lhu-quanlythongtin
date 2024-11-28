
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';

// Cấu hình Firebase của bạn
const firebaseConfig = {
    apiKey: "AIzaSyAqTFMcmlxz_atXuIy-AsdEOp6m-7ejMpQ",
    authDomain: "quanlythongtin-lhu.firebaseapp.com",
    projectId: "quanlythongtin-lhu",
    storageBucket: "quanlythongtin-lhu.firebasestorage.app",
    messagingSenderId: "614082633752",
    appId: "1:614082633752:web:061fc30dffed7031bc236d",
    measurementId: "G-PL6N844M86"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ Firebase
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, createUserWithEmailAndPassword, signInWithEmailAndPassword, ref, set, get };
