import React from 'react';
import './App.css';

const App = props => {
	return (
		<div id="homepage">
			<h1>Paying Later?</h1>
			<br />
			<h3>Send yourself a reminder on Slack</h3>
			<div>
				<button
					className="buttonBlue"
					onClick={() => props.setSendWithPhoto(true)}>
					Send a SnackChat
				</button>
			</div>
			<div>
				<button
					className="buttonWhite"
					onClick={() => props.setSendWithPhoto(false)}>
					Send a reminder without a photo
				</button>
			</div>
		</div>
	);
};

export default App;
