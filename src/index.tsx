import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/style.css';
import App from './App';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyA_TUzL290S5I6cB1WeJ_Xczz1jjM5qdbQ",
  authDomain: "woman-up-test-firebase.firebaseapp.com",
  databaseURL: "https://woman-up-test-firebase-default-rtdb.firebaseio.com",
  projectId: "woman-up-test-firebase",
  storageBucket: "woman-up-test-firebase.appspot.com",
  messagingSenderId: "261896679780",
  appId: "1:261896679780:web:3d2638d4b37f6811c6ca71"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebase.database().ref(`/tasks`);
export const storageRef = firebase.storage().ref();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
