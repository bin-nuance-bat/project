import React from 'react';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBox from '../ConfirmationBox/ConfirmationBox';
import StoreListContainer from '../StoreList/StoreListContainer';
import ErrorMessage from './../ErrorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import {getUserSlackID, sendSlackMessage} from './../../utils/slack';
import labels from './../../utils/labels';
import {Notification} from './../Notification/Notification';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.setPrediction = this.setPrediction.bind(this);
		this.changeCurrentUser = this.changeCurrentUser.bind(this);
		this.showNotification = this.showNotification.bind(this);

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
		if (this.props.slackUserFetchError)
			setTimeout(() => {
				this.props.setSlackUserFetchError(false);
			}, 5000);

		return (
			<div>
				{this.state.showNotification && (
					<Notification message={this.state.notificationMessage} />
				)}
				{this.props.slackUserFetchError && (
					<ErrorMessage text="failed to fetch users" />
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
							this.showNotification('Reminder sent to Slack');
						}}
						onNo={() => {
							this.props.setPrediction(null);
							this.props.setShowList(true);
						}}>
						<img src={this.props.prediction.img} alt="" />
					</ConfirmationBox>
				)}
				{this.props.showList && (
					<StoreListContainer
						showNotification={this.showNotification}
					/>
				)}
			</div>
		);
	}
}

App.propTypes = {
	prediction: PropTypes.shape({
		index: PropTypes.number.isRequired,
		img: PropTypes.string.isRequired
	}),
	setPrediction: PropTypes.func.isRequired,
	setCurrentUser: PropTypes.func.isRequired,
	loadUsers: PropTypes.func.isRequired,
	setShowList: PropTypes.func.isRequired,
	showList: PropTypes.bool.isRequired,
	getStoreList: PropTypes.func.isRequired,
	storeList: PropTypes.arrayOf(PropTypes.object).isRequired,
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
	slackUserFetchError: PropTypes.bool.isRequired,
	currentUser: PropTypes.string
};

export default App;
