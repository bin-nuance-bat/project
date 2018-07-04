import React, {Component} from 'react';
import './App.css';
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
				Slack Username:
				<input
					value={this.state.currentUser}
					onChange={event => {
						this.setState({currentUser: event.target.value});
					}}
				/>
				<hr />
				<WebcamCaptureContainer confirmMatch={this.confirmMatch} />
				{this.state.prediction && (
					<ConfirmationBoxContainer
						item={this.state.prediction.index}
						onYes={() => this.setState({prediction: null})}
						onNo={() => this.setState({showList: true})}>
						<img src={this.state.prediction.img} alt="" />
					</ConfirmationBoxContainer>
				)}
				{this.state.showList && (
					<StoreList username={this.state.currentUser} />
				)}
			</div>
		);
	}
}

export default App;
