// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBSyXS693Q2u-ZSYDLUEK_ayQg_my1LOk",
  authDomain: "test-firebase-auth-hh.firebaseapp.com",
  projectId: "test-firebase-auth-hh",
  storageBucket: "test-firebase-auth-hh.appspot.com",
  messagingSenderId: "480281962748",
  appId: "1:480281962748:web:e10bc55c70d40813e70f79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Initialize Firebase
// let app;
// if (firebase.apps?.length === 0) {
// 	app = firebase.initializeApp(firebaseConfig);
// } else {
// 	app = firebase.app();
// }

// const auth = firebase.auth();
export { auth };
// const app = initializeApp(firebaseConfig);