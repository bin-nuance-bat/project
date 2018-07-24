import React, {Component} from 'react';
import initFirebase from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

class Auth extends Component {
	state = {
		status: 'Authenticating...'
	};

	componentDidMount() {
		initFirebase();
		firebase
			.auth()
			.getRedirectResult()
			.then(result => {
				if (result.user) {
					const userRef = firebase
						.firestore()
						.collection('users')
						.doc(result.user.uid);
					userRef.get().then(user => {
						if (!user.exists) {
							userRef.set({
								name: result.user.displayName,
								admin: false
							});
						} else if (!user.data().admin) {
							this.setStatus('You are not an administrator.');
						} else {
							this.props.history.push('/admin');
						}
					});
				} else {
					firebase
						.auth()
						.signInWithRedirect(
							new firebase.auth.GoogleAuthProvider()
						);
				}
			})
			.catch(function(error) {
				console.error(error);
			});
	}

	render() {
		return <h1>{this.state.status}</h1>;
	}
}

export default Auth;
