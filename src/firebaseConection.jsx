import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAtXrQGLFcrwPBJpr6UW8AJMBpKMpig-mk",
    authDomain: "curso-93885.firebaseapp.com",
    projectId: "curso-93885",
    storageBucket: "curso-93885.appspot.com",
    messagingSenderId: "376055461629",
    appId: "1:376055461629:web:4766bde96a032371ca7094",
    measurementId: "G-0SC3TP5M2Z"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
