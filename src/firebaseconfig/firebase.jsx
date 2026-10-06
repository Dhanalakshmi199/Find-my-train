// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-Y8Do8cAzt4L6yXyHol-s9EwvZmAH3PA",
  authDomain: "find-my-train-9db88.firebaseapp.com",
  projectId: "find-my-train-9db88",
  storageBucket: "find-my-train-9db88.appspot.com",
  messagingSenderId: "225243399712",
  appId: "1:225243399712:web:d8613efba30e126e0f5e45",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export default auth;