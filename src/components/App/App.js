import React, {Component} from 'react';
import './App.css';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBox from '../ConfirmationBox/ConfirmationBox';

class App extends Component {
	state = {
		likelyItem: null
	};

	render() {
		return (
			<div>
				<header>
					<h1> Honesty Store Kiosk</h1>
					Please take and item and show it to the camera
				</header>
				<hr />
				<WebcamCaptureContainer />
				<ConfirmationBox
					text={'Did you choose: ' + this.state.likelyItem + '?'}
					// onYes={} hide confirmation box
					// onNo={} prompt user to select correct item
				/>
			</div>
		);
	}
}

export default App;
