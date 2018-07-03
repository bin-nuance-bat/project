import React, {Component} from 'react';
import './App.css';
import WebcamCapture from '../WebcamCapture/WebcamCapture.js';

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
				<WebcamCapture />
			</div>
		);
	}
}

export default App;
