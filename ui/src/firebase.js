import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCwCe2p85PHBE92l-Bc4EnemVt4cHBvokk",
  authDomain: "theater-53375.firebaseapp.com",
  projectId: "theater-53375",
  storageBucket: "theater-53375.appspot.com",
  messagingSenderId: "107054276069",
  appId: "1:107054276069:web:6355c5db116222299a630c",
};

const fb = initializeApp(firebaseConfig);
export const fbStorage = getStorage(fb);
