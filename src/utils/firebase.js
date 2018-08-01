import firebase from 'firebase/app';

const initFirebase = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp({
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_PROJECT + '.firebaseapp.com',
      projectId: process.env.REACT_APP_FIREBASE_PROJECT,
      storageBucket: process.env.REACT_APP_FIREBASE_PROJECT + '.appspot.com'
    });
    firebase.firestore().settings({timestampsInSnapshots: true});
  }
};

export default initFirebase;
