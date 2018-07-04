import React, {Component} from 'react';
import './App.css';
import WebcamCapture from '../WebcamCapture/WebcamCapture.js';
import getStore from '../../utils/honestyStore.js'

class App extends Component {

	render() {
		return (
			<div>
				<WebcamCapture />
			</div>
		);
	}
}

export default App;
