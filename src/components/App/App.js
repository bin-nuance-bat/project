import React from 'react';

const App = props => {
	return (
		<div>
			<h1>Paying Later?</h1>
			Send yourself a reminder on Slack
			<div>
				<button onClick={() => props.setSendWithPhoto(true)}>
					Send a SnackChat
				</button>
			</div>
			<div>
				<button onClick={() => props.setSendWithPhoto(false)}>
					Send a reminder without a photo
				</button>
			</div>
		</div>
	);
};

export default App;
