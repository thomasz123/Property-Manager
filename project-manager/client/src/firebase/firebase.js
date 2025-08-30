// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6-KqPt0ZxkcAvZrhtBpsLTOOyrMsU4Fk",
  authDomain: "cribs-project.firebaseapp.com",
  projectId: "cribs-project",
  storageBucket: "cribs-project.firebasestorage.app",
  messagingSenderId: "727512053673",
  appId: "1:727512053673:web:dcc11d3bf631f0f090b6b8",
  measurementId: "G-26M5YDK994"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)

export {app, auth}