import React, {Component} from 'react';
import './App.css';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBox from '../ConfirmationBox/ConfirmationBox';
import StoreList from './../StoreList/StoreList';

class App extends Component {
	state = {
		prediction: null,
		showList: false,
		currentUser: ''
	};

	setPrediction = label => {
		if (!this.state.prediction) this.setState({prediction: label});
	};

	render() {
		return (
			<div>
				<header>
					<h1> Honesty Store Kiosk</h1>
					Please take and item and show it to the camera
				</header>
				<hr />
				<WebcamCaptureContainer confirmMatch={this.confirmMatch} />
				{this.state.prediction && (
					<ConfirmationBox
						text={'Did you choose: ' + this.state.prediction + '?'}
						onYes={() => this.setState({prediction: null})}
						onNo={() => this.setState({showList: true})}
					/>
				)}
				{this.state.showList && (
					<StoreList username={this.state.currentUser} />
				)}
			</div>
		);
	}
}

export default App;
