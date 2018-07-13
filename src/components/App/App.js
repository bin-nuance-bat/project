import React from 'react';
import './App.css';

class App extends React.Component {
	componentDidMount() {
		this.props.loadStoreList();
	}

	render() {
		const {setSendWithPhoto, history} = this.props;
		const scanItem = (withPhoto = false) => {
			setSendWithPhoto(withPhoto);
			history.push('/scanitem');
		};
		return (
			<div id="homepage">
				<h2 id="heading">Paying later?</h2>
				<br />
				Send yourself a reminder on Slack
				<hr />
				<div>
					<button
						className="buttonBlue"
						onClick={() => scanItem(true)}>
						Send a SnackChat
					</button>
				</div>
				<hr />
				<div>
					<button className="buttonWhite" onClick={() => scanItem()}>
						Send a reminder without a photo
					</button>
				</div>
			</div>
		);
	}
}

export default App;
