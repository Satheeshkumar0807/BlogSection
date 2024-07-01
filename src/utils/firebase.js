// Import the functions you need from the SDKs you need
import firebase  from "firebase/compat/app";

import "firebase/compat/auth";
import "firebase/compat/firestore";
import {doc , updateDoc} from "firebase/firestore";
import "firebase/compat/storage";



const firebaseConfig = {
  apiKey: "AIzaSyAQuhwXKC9ZU5iwJ8alfTiclfTqU-i9FiQ",
  authDomain: "nimitta-react-blogpage-project.firebaseapp.com",
  projectId: "nimitta-react-blogpage-project",
  storageBucket: "nimitta-react-blogpage-project.appspot.com",
  messagingSenderId: "732714727885",
  appId: "1:732714727885:web:b9b55f3f84cbd15d31ec84"
};

firebase.initializeApp(firebaseConfig);


const db = firebase.firestore();

const storage = firebase.storage();

const auth = firebase.auth();

export {db, storage,doc,updateDoc , auth};