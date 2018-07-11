import React from 'react';
import './App.css';

const App = props => {
	return (
		<div id="homepage">
			<h2 id="heading">
				<svg
					id="halo"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="1425 276.913 20.711 10.712">
					<path
						id="Path_169"
						data-name="Path 169"
						className="cls-1"
						d="M22.562,1.986C21.726-.594,14.746.235,10.98,1.5,7.214,2.776,1.11,5.763,2.168,8.917c.835,2.467,3.79,2.414,7.408,1.561V7.788c-3.321.872-4.2.535-4.848.257.408-.742,2.653-2.6,7.087-4.081s7.328-1.373,8.107-1.039c.472.05,1.6.576-1.98,1.986h3.617S23.336,4.3,22.562,1.986Z"
						transform="translate(1422.954 276.615)"
					/>
				</svg>
				Paying later?
			</h2>
			<br />
			Send yourself a reminder on Slack
			<hr />
			<div>
				<button
					className="buttonBlue"
					onClick={() => {
						props.setSendWithPhoto(true);
						props.history.push('/scanitem');
					}}>
					Send a SnackChat
				</button>
			</div>
			<hr />
			<div>
				<button
					className="buttonWhite"
					onClick={() => {
						props.setSendWithPhoto(false);
						props.history.push('/disclaimer');
					}}>
					Send a reminder without a photo
				</button>
			</div>
		</div>
	);
};

export default App;
