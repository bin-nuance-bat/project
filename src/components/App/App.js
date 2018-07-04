import React, {Component} from 'react';
import './App.css';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBox from '../ConfirmationBox/ConfirmationBox';
import ButtonList from '../ButtonList/ButtonList';
import getStore from '../../utils/honestyStore.js';

class App extends Component {
	state = {
		prediction: null,
		showList: false,
		storeList: []
	};

	componentDidMount() {
		this.getStoreList();
	}

	getStoreList() {
		getStore((err, items) => {
			if (err) return;
			this.setState({
				storeList: items.map(item => ({
					name:
						item.name +
						(item.qualifier ? ' ' + item.qualifier : ''),
					index: item.id
				}))
			});
		});
	}

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
					<ButtonList
						items={this.state.storeList}
						onClick={storeCode => console.log(storeCode)}
					/>
				)}
			</div>
		);
	}
}

export default App;
