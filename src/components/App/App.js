import React, {Component} from 'react';
import './App.css';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBoxContainer from '../ConfirmationBox/ConfirmationBoxContainer';
import StoreList from './../StoreList/StoreList';
import ErrorMessage from './../ErrorMessage/ErrorMessage';
import {loadUsers} from './../../utils/slack';

class App extends Component {
	state = {
		prediction: null,
		showList: false,
		users: [],
		currentUser: ''
	};

	constructor(props) {
		super(props);
		this.confirmMatch = this.confirmMatch.bind(this);
	}

	confirmMatch(index, img) {
		this.setState(
			prevState =>
				prevState.prediction ? null : {prediction: {index, img}}
		);
	}

	componentDidMount() {
		loadUsers(users => {
			if (users) this.setState({users: users});
			else this.setState({fetchUserSlackError: true});
		});
	}

	render() {
		return (
			<div>
				<header>
					<h1> Honesty Store Kiosk</h1>
					Please take an item and show it to the camera
				</header>
				<hr />
				Slack Username:
				<input
					value={this.state.currentUser}
					onChange={event => {
						this.setState({currentUser: event.target.value});
					}}
				/>
				<hr />
				<WebcamCaptureContainer confirmMatch={this.confirmMatch} />
				{this.state.prediction && (
					<ConfirmationBoxContainer
						item={this.state.prediction.index}
						onYes={() => this.setState({prediction: null})}
						onNo={() => this.setState({showList: true})}>
						<img src={this.state.prediction.img} alt="" />
					</ConfirmationBoxContainer>
				)}
				{this.state.showList && (
					<StoreList
						username={this.state.currentUser}
						users={this.state.users}
					/>
				)}
				{this.state.fetchUserSlackError && (
					<ErrorMessage text={'failed to fetch users'} />
				)}
			</div>
		);
	}
}

export default App;
