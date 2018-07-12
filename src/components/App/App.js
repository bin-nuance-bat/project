import React from 'react';
import './App.css';

class App extends React.Component {
	componentDidMount() {
		this.props.loadStoreList();
	}

	render() {
		return (
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
		);
	}
}

export default App;
