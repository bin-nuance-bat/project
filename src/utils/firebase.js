import firebase from 'firebase/app';

const initFirebase = () => {
	if (firebase.apps.length === 0) {
		console.log(
			'Initialising firebase with API key',
			process.env.REACT_APP_FIREBASE_API_KEY
		);
		firebase.initializeApp({
			apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
			authDomain: 'honesty-store-kiosk.firebaseapp.com',
			projectId: 'honesty-store-kiosk'
		});
	}
};

export default initFirebase;
