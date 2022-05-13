import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCUu-WkyDWMg-dTmc50UaFRycprb11T7iU",
    authDomain: "whatsapp-mern-f713c.firebaseapp.com",
    projectId: "whatsapp-mern-f713c",
    storageBucket: "whatsapp-mern-f713c.appspot.com",
    messagingSenderId: "504106260071",
    appId: "1:504106260071:web:f681a564cbfdef2447e6c2"
  }; 

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();


  export {auth, provider};
  export default db;


