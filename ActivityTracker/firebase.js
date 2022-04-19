import firebase from '@react-native-firebase/app';

const firebaseConfig = {};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialised")
}

export {firebase};