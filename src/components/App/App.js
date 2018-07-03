import React, {Component} from 'react';
import './App.css';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';

class App extends Component {
	state = {
		loading: true
	};

	componentDidMount() {
		this.setState({loading: false});
	}

	render() {
		if (this.state.loading) return <div>Loading...</div>;

		return (
			<div>
				<header>
					<h1> Honesty Store Kiosk</h1>
					Please take and item and show it to the camera
				</header>
				<hr />
				<WebcamCaptureContainer />
			</div>
		);
	}
}

export default App;
