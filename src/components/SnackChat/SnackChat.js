import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/container';
import PropTypes from 'prop-types';

class SnackChat extends Component {
	initialTime = new Date();
	state = {counter: 5};

	componentDidMount() {
		this.timer = setInterval(this.tick, 1000);
	}

	tick = () => {
		this.setState(prevState => ({counter: prevState.counter - 1}));
	};

	handleImg = img => {
		if (this.state.counter <= 0) {
			this.props.setSnackChat(img.src);
			this.props.history.push('slackName');
		}
	};

	render() {
		return (
			<div>
				<header>
					Smile, you are on snackchat:
					{this.state.counter}
				</header>
				<WebcamCapture onImgLoad={this.handleImg} interval={333} />
			</div>
		);
	}
}

SnackChat.propTypes = {
	setSnackChat: PropTypes.func.isRequired
};

export default SnackChat;
