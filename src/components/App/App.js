import React from 'react';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBox from '../ConfirmationBox/ConfirmationBox';
import StoreListContainer from '../StoreList/StoreListContainer';
import ErrorMessage from './../ErrorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import {getUserSlackID, sendSlackMessage} from './../../utils/slack';
import labels from './../../utils/labels';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.setPrediction = this.setPrediction.bind(this);
		this.changeCurrentUser = this.changeCurrentUser.bind(this);
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
						item={this.props.prediction.index}
						onYes={() => {
							let id = getUserSlackID(
								this.props.currentUser,
								this.props.users
							);
							const name = labels[this.props.prediction.index][0];
							sendSlackMessage(id, name, this.getStoreCode(name));
							this.props.setPrediction(null);
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
	users: PropTypes.arrayOf(PropTypes.string).isRequired,
	slackUserFetchError: PropTypes.bool.isRequired,
	currentUser: PropTypes.string
};

export default App;
