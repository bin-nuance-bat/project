import React from 'react';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBox from '../ConfirmationBox/ConfirmationBox';
import StoreListContainer from '../StoreList/StoreListContainer';
import ErrorMessage from './../ErrorMessage/ErrorMessage';
import {getUserSlackID, sendSlackMessage} from './../../utils/slack';
import labels from './../../utils/labels';
import {Notification} from './../Notification/Notification';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.setPrediction = this.setPrediction.bind(this);
		this.changeCurrentUser = this.changeCurrentUser.bind(this);

		this.state = {
			showNotification: false,
			notificationMessage: ''
		};
	}

	setPrediction(index, img) {
		if (!this.props.prediction) this.props.setPrediction({index, img});
	}

	changeCurrentUser = currentUser => {
		this.props.setCurrentUser(currentUser);
	};

	componentDidMount() {
		this.props.loadUsers();
		this.props.getStoreList();
	}

	getStoreCode = name => {
		for (let item in this.props.storeList) {
			if (item.name === name) return item.index;
		}
	};

	showNotification = message => {
		this.setState(
			{notificationMessage: message, showNotification: true},
			() => {
				setTimeout(() => {
					this.setState({showNotification: false});
				}, 5000);
			}
		);
	};

	render() {
		return (
			<div>
				{this.state.showNotification && (
					<Notification message={this.state.notificationMessage} />
				)}
				<header>
					<h1> Honesty Store Kiosk</h1>
					Please take an item and show it to the camera
				</header>
				<hr />
				Slack Username:
				<input
					value={this.props.currentUser}
					onChange={event =>
						this.changeCurrentUser(event.target.value)
					}
				/>
				<hr />
				<WebcamCaptureContainer
					loadModel
					confirmMatch={this.setPrediction}
				/>
				{this.props.prediction && (
					<ConfirmationBox
						itemIndex={this.props.prediction.index}
						onYes={() => {
							let id = getUserSlackID(
								this.props.currentUser,
								this.props.users
							);
							const name = labels[this.props.prediction.index][0];
							sendSlackMessage(id, name, this.getStoreCode(name));
							this.props.setPrediction(null);
							this.showNotification('Reminder sent to slack');
						}}
						onNo={() => {
							this.props.setPrediction(null);
							this.props.setShowList(true);
						}}>
						<img src={this.props.prediction.img} alt="" />
					</ConfirmationBox>
				)}
				{this.props.showList && <StoreListContainer />}
				{this.props.slackUserFetchError && (
					<ErrorMessage text="failed to fetch users" />
				)}
			</div>
		);
	}
}

export default App;
