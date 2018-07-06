import React from 'react';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBoxContainer from '../ConfirmationBox/ConfirmationBoxContainer';
import StoreListContainer from '../StoreList/StoreListContainer';
import ErrorMessage from './../ErrorMessage/ErrorMessage';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.confirmMatch = this.confirmMatch.bind(this);
		this.changeCurrentUser = this.changeCurrentUser.bind(this);
	}

	confirmMatch(index, img) {
		this.setState(
			prevState =>
				prevState.prediction ? null : {prediction: {index, img}}
		);
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
				<WebcamCaptureContainer confirmMatch={this.confirmMatch} />
				{this.props.prediction && (
					<ConfirmationBoxContainer
						item={this.props.prediction.index}
						onYes={() => this.setState({prediction: null})}
						onNo={() => this.setState({showList: true})}>
						<img src={this.props.prediction.img} alt="" />
					</ConfirmationBoxContainer>
				)}
				{this.props.showList && (
					<StoreListContainer
						storeList={this.props.storeList}
						loadStoreListError={this.props.loadStoreListError}
					/>
				)}
				{this.props.slackUserFetchError && (
					<ErrorMessage text={'failed to fetch users'} />
				)}
			</div>
		);
	}
}

export default App;
