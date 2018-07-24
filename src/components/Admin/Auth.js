import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
						if (user.exists && user.data().admin) {
							this.props.history.push('/admin');
						} else {
							if (!user.exists)
								userRef.set({
									name: result.user.displayName,
									admin: false
								});
							this.setState({status: 'You are not an administrator.'});
						}
					});
				} else {
					firebase
						.auth()
						.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
				}
			})
			.catch(function(error) {
				this.setState({status: error});
			});
	}

	render() {
		return <h1>{this.state.status}</h1>;
	}
}

Auth.propTypes = {
	history: PropTypes.object.isRequired
};

export default Auth;
