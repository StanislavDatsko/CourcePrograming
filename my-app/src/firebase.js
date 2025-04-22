import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


// Ваші Firebase налаштування, взяті з консолі Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_wQol5RCMSkbSW9fX1XZRhJXwuQUJ1Is",
  authDomain: "stasik-e0e41.firebaseapp.com",
  projectId: "stasik-e0e41",
  storageBucket: "stasik-e0e41.firebasestorage.app",
  messagingSenderId: "99849994153",
  appId: "1:99849994153:web:37daec32e8c176c2c88eb8",
  measurementId: "G-PPXVZBNPYQ"
};

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  export { auth, db, collection, addDoc };
