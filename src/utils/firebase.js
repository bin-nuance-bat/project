import firebase from 'firebase/app';

const initFirebase = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: 'honesty-store-kiosk-dev.firebaseapp.com',
      projectId: 'honesty-store-kiosk-dev',
      storageBucket: 'honesty-store-kiosk-dev.appspot.com'
    });
    firebase.firestore().settings({timestampsInSnapshots: true});
  }
};

export default initFirebase;
