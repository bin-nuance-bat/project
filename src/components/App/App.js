import React, {Component} from 'react';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBoxContainer from '../ConfirmationBox/ConfirmationBoxContainer';
import StoreList from './../StoreList/StoreList';

class App extends Component {
	state = {
		prediction: null,
		showList: false,
		currentUser: ''
	};

	constructor(props) {
		super(props);
		this.confirmMatch = this.confirmMatch.bind(this);
	}

	confirmMatch(index, img) {
		if (!this.state.prediction) this.setState({prediction: {index, img}});
	}

	render() {
		return (
			<div>
				<header>
					<h1> Honesty Store Kiosk</h1>
					Please take an item and show it to the camera
				</header>
				<hr />
				<WebcamCaptureContainer
					loadModel={true}
					confirmMatch={this.confirmMatch}
				/>
				{this.state.prediction && (
					<ConfirmationBox
						item={this.state.prediction.index}
						onYes={() => this.setState({prediction: null})}
						onNo={() => this.setState({showList: true})}>
						<img src={this.state.prediction.img} alt="" />
					</ConfirmationBox>
				)}
				{this.state.showList && (
					<StoreList username={this.state.currentUser} />
				)}
			</div>
		);
	}
}

export default App;
