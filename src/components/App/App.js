import React, {Component} from 'react';
import './App.css';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBoxContainer from '../ConfirmationBox/ConfirmationBoxContainer';
import ButtonList from '../ButtonList/ButtonList';
import getStore from '../../utils/honestyStore.js';

class App extends Component {
	state = {
		prediction: null,
		showList: false,
		storeList: []
	};

	constructor(props) {
		super(props);
		this.getStoreList = this.getStoreList.bind(this);
		this.confirmMatch = this.confirmMatch.bind(this);
	}

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

	confirmMatch(index, img) {
		if (!this.state.prediction) this.setState({prediction: {index, img}});
	}

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
					<ConfirmationBoxContainer
						item={this.state.prediction.index}
						onYes={() => this.setState({prediction: null})}
						onNo={() => this.setState({showList: true})}>
						<img src={this.state.prediction.img} alt="" />
					</ConfirmationBoxContainer>
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
