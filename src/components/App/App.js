import React from 'react';
import './App.css';
import Logo from '../Logo/Logo';

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
							this.props.history.push('/scanitem');
						}}>
						Send a SnackChat
						{/* camera icon from: https://raw.githubusercontent.com/Keyamoon/IcoMoon-Free/master/SVG/016-camera.svg */}
						<svg
							id="cameraIcon"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 16 16">
							<path
								fill="#FFFFFF"
								d="M4.75 9.5c0 1.795 1.455 3.25 3.25 3.25s3.25-1.455 3.25-3.25-1.455-3.25-3.25-3.25-3.25 1.455-3.25 3.25zM15 4h-3.5c-0.25-1-0.5-2-1.5-2h-4c-1 0-1.25 1-1.5 2h-3.5c-0.55 0-1 0.45-1 1v9c0 0.55 0.45 1 1 1h14c0.55 0 1-0.45 1-1v-9c0-0.55-0.45-1-1-1zM8 13.938c-2.451 0-4.438-1.987-4.438-4.438s1.987-4.438 4.438-4.438c2.451 0 4.438 1.987 4.438 4.438s-1.987 4.438-4.438 4.438zM15 7h-2v-1h2v1z"
							/>
						</svg>
					</button>
					<button
						id="noPhotoButton"
						onClick={() => {
							this.props.setSendWithPhoto(false);
							this.props.history.push('/disclaimer');
						}}>
						Send a reminder without a photo
					</button>
				</div>
			</div>
		);
	}
}

export default App;
