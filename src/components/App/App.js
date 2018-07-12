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
				<br />
				Send yourself a reminder on Slack
				<hr />
				<div>
					<button
						className="buttonBlue"
						onClick={() => {
							this.props.setSendWithPhoto(true);
							this.props.history.push('/scanitem');
						}}>
						Send a SnackChat
					</button>
				</div>
				<hr />
				<div>
					<button
						className="buttonWhite"
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
