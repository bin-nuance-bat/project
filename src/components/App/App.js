import React from 'react';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBoxContainer from '../ConfirmationBox/ConfirmationBoxContainer';
import {StoreList} from './../StoreList/StoreList';
import ErrorMessage from './../ErrorMessage/ErrorMessage';

const App = props => {
	return (
		<div>
			<header>
				<h1> Honesty Store Kiosk</h1>
				Please take an item and show it to the camera
			</header>
			<hr />
			Slack Username:
			<input
				value={props.currentUser}
				onChange={event => this.changeCurrentUser(event.target.value)}
			/>
			<hr />
			<WebcamCaptureContainer confirmMatch={props.confirmMatch} />
			{props.prediction && (
				<ConfirmationBoxContainer
					item={this.state.prediction.index}
					onYes={() => this.setState({prediction: null})}
					onNo={() => this.setState({showList: true})}>
					<img src={this.state.prediction.img} alt="" />
				</ConfirmationBoxContainer>
			)}
			{props.showList && (
				<StoreList
					storeList={props.storeList}
					username={props.currentUser}
					users={props.users}
				/>
			)}
			{props.slackUserFetchError && (
				<ErrorMessage text={'failed to fetch users'} />
			)}
		</div>
	);
};

export default App;
