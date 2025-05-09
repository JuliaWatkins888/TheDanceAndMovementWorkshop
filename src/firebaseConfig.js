import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBp0OeujkD5EJfc-zwQaPhg1pmjPaBosaw",
    authDomain: "dance-and--movement-workshop.firebaseapp.com",
    projectId: "dance-and--movement-workshop",
    storageBucket: "dance-and--movement-workshop.appspot.com",
    messagingSenderId: "390256085706",
    appId: "1:390256085706:web:6c5afda8bfd14bf90e0233",
    measurementId: "G-GX95C28DJ3"
  };

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage(); 

export { db, storage }
