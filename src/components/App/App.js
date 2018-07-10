import React from 'react';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBox from '../ConfirmationBox/ConfirmationBox';
import StoreListContainer from '../StoreList/StoreListContainer';
import PropTypes from 'prop-types';
import {getUserSlackID, sendSlackMessage} from './../../utils/slack';
import {Notification} from './../Notification/Notification';

const NOTIFICATION_DURATION = 5000;

class App extends React.Component {
	constructor(props) {
		super(props);
		this.setPrediction = this.setPrediction.bind(this);
		this.changeCurrentUser = this.changeCurrentUser.bind(this);
		this.showNotification = this.showNotification.bind(this);
		this.handleYes = this.handleYes.bind(this);
		this.handleNo = this.handleNo.bind(this);

		this.state = {
			showNotification: false,
			notificationMessage: '',
			isError: false
		};
	}

	setPrediction(id, img) {
		if (!this.props.prediction) this.props.setPrediction({id, img});
	}

	changeCurrentUser = currentUser => {
		this.props.setCurrentUser(currentUser);
	};

	getStoreCode = name => {
		for (let item in this.props.storeList) {
			if (item.name === name) return item.index;
		}
	};

	showNotification = (notificationMessage, isError) => {
		this.setState({notificationMessage, showNotification: true, isError});

		setTimeout(() => {
			this.setState({showNotification: false});
		}, NOTIFICATION_DURATION);
	};

	componentDidMount() {
		this.props.loadUsers();
		this.props.getStoreList();
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.slackUserFetchError && this.props.slackUserFetchError) {
			this.showNotification('Error: failed to load users', true);
			setTimeout(() => {
				this.props.setSlackUserFetchError(false);
			}, NOTIFICATION_DURATION);
		}
	}

	handleYes = async () => {
		let id = getUserSlackID(this.props.currentUser, this.props.users);
		const name = this.props.storeList[this.props.prediction.id].name;
		let result = await sendSlackMessage(id, name, this.props.prediction.id);
		this.props.setPrediction(null);
		if (result) this.showNotification('Reminder sent to Slack', false);
		else this.showNotification('Failed to send reminder to Slack', true);
	};

	handleNo = () => {
		this.props.setPrediction(null);
		this.props.setShowList(true);
	};

	render() {
		return (
			<div>
				{this.state.showNotification && (
					<Notification
						message={this.state.notificationMessage}
						isError={this.state.isError}
					/>
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
						item={this.props.storeList[this.props.prediction.id]}
						onYes={this.handleYes}
						onNo={this.handleNo}>
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
		id: PropTypes.string.isRequired,
		img: PropTypes.string.isRequired
	}),
	setPrediction: PropTypes.func.isRequired,
	setCurrentUser: PropTypes.func.isRequired,
	loadUsers: PropTypes.func.isRequired,
	setShowList: PropTypes.func.isRequired,
	showList: PropTypes.bool.isRequired,
	getStoreList: PropTypes.func.isRequired,
	storeList: PropTypes.objectOf(PropTypes.object).isRequired,
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
	slackUserFetchError: PropTypes.bool.isRequired,
	currentUser: PropTypes.string.isRequired,
	setSlackUserFetchError: PropTypes.func
};

export default App;
