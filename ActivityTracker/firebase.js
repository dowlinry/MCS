import firebase from '@react-native-firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBZ9LwqUvAFJoZg5eQmiCyun0A17wCq4dc",
    authDomain: "mcs-activitytracker.firebaseapp.com",
    projectId: "mcs-activitytracker",
    storageBucket: "mcs-activitytracker.appspot.com",
    messagingSenderId: "721192366173",
    appId: "1:721192366173:web:687a2575f48a00e8cf1db4",
    measurementId: "G-E0DECDZ2DT",
    databaseURL: "https://mcs-activitytracker-default-rtdb.europe-west1.firebasedatabase.app/"
  };

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialised")
}

export {firebase};