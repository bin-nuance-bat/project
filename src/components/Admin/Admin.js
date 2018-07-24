import React, {Component} from 'react';
import initFirebase from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import './Admin.css';

class Admin extends Component {
	state = {
		authed: 'Loading...'
	};

	componentDidMount() {
		initFirebase();
		firebase
			.auth()
			.getRedirectResult()
			.then(result => {
				if (result.user) {
					this.setState({
						authed: 'Welcome, ' + result.user.displayName
					});
				} else {
					this.setState({authed: 'You are not authenticated.'});
				}
			});
	}

	render() {
		return (
			<div>
				<h1>Admin Panel</h1>
				<p>{this.state.authed}</p>
				<button
					className="button button-admin"
					onClick={() => this.props.history.push('/auth')}>
					Authenticate
				</button>
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
		);
	}
}

export default Admin;
