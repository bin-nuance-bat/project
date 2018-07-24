import React, {Component} from 'react';
import PropTypes from 'prop-types';
import initFirebase from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import './Admin.css';

class Admin extends Component {
	state = {
		status: 'Loading...',
		loggedIn: false,
		admin: false
	};

	authenticate = () => {
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
						if (user.exists) {
							this.setState({loggedIn: true});
							if (user.data().admin) {
								this.setState({
									admin: true,
									status: 'Welcome, ' + user.data().name
								});
							} else {
								userRef.set({
									name: result.user.displayName,
									admin: false
								});
								this.setState({status: 'You are not an administrator.'});
							}
						} else {
							this.setState({status: 'You are not an administrator.'});
						}
					});
				} else {
					this.setState({status: 'You are not authenticated.'});
				}
			})
			.catch(function(error) {
				this.setState({status: error});
			});
	};

	login = () => {
		firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
	};

	logout = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				this.setState({loggedIn: false, admin: false});
			});
	};

	componentDidMount() {
		initFirebase();
		this.authenticate();
	}

	render() {
		return (
			<div>
				<h1>Admin Panel</h1>
				<p>{this.state.status}</p>
				{!this.state.loggedIn && (
					<button className="button button-admin" onClick={this.login}>
						Authenticate
					</button>
				)}
				{this.state.admin && (
					<div>
						<button
							className="button button-admin"
							onClick={() => this.props.history.push('/training')}>
							Model Training
						</button>
						<button
							className="button button-admin"
							onClick={() => this.props.history.push('/preview')}>
							Traing Data Review
						</button>
					</div>
				)}
				{this.state.loggedIn && (
					<button className="button button-admin" onClick={this.logout}>
						Logout
					</button>
				)}
			</div>
		);
	}
}

Admin.propTypes = {
	history: PropTypes.object.isRequired
};

export default Admin;
