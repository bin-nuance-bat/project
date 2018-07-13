import React from 'react';
import './App.css';
import Logo from '../Logo/Logo';
import {Glyphicon} from 'react-bootstrap';

class App extends React.Component {
	componentDidMount() {
		this.props.loadStoreList();
	}

	render() {
		return (
			<div>
				<Logo />
				<div id="homepage">
					<h2 id="heading">Paying later?</h2>
					<div id="subheading">
						Why not send yourself a reminder on Slack?
					</div>
					<button
						id="snackchatButton"
						onClick={() => {
							this.props.setSendWithPhoto(true);
							this.props.history.push('/disclaimer');
						}}>
						Send a SnackChat
						<Glyphicon id="cameraIcon" glyph="camera" />
					</button>
					<button
						id="noPhotoButton"
						onClick={() => {
							this.props.setSendWithPhoto(false);
							this.props.history.push('/scanitem');
						}}>
						Send a reminder without a photo
					</button>
				</div>
			</div>
		);
	}
}

export default App;
