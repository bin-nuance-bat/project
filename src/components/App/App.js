import React from 'react';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBoxContainer from '../ConfirmationBox/ConfirmationBoxContainer';
import StoreListContainer from '../StoreList/StoreListContainer';
import ErrorMessage from './../ErrorMessage/ErrorMessage';

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
					value={this.props.currentUser}
					onChange={event =>
						this.changeCurrentUser(event.target.value)
					}
				/>
				<hr />
				<WebcamCaptureContainer confirmMatch={this.setPrediction} />
				{this.props.prediction && (
					<ConfirmationBox
						item={this.props.prediction.index}
						onYes={() => this.props.setPrediction(null)}
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
