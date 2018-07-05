import React, {Component} from 'react';
import './App.css';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBoxContainer from '../ConfirmationBox/ConfirmationBoxContainer';
import StoreList from './../StoreList/StoreList';
import ErrorMessage from './../ErrorMessage/ErrorMessage';

const token = process.env.SLACK_TOKEN;

class App extends Component {
	state = {
		prediction: null,
		showList: false,
		users: [],
		currentUser: ''
	};

	constructor(props) {
		super(props);
		this.confirmMatch = this.confirmMatch.bind(this);
	}

	confirmMatch(index, img) {
		if (!this.state.prediction) this.setState({prediction: {index, img}});
	}

	loadUsers() {
		fetch(`https://slack.com/api/users.list?token=${token}`)
			.then(res => res.json())
			.then(data => {
				if (!data.ok) throw new Error();
				this.setState({users: data.members});
			})
			.catch(err => this.setState({fetchUserSlackError: true}));
	}

	componentDidMount() {
		this.loadUsers();
	}

	render() {
		return (
			<div>
				<header>
					<h1> Honesty Store Kiosk</h1>
					Please take an item and show it to the camera
				</header>
				<hr />
				Slack Username:
				<input
					value={this.state.currentUser}
					onChange={event => {
						this.setState({currentUser: event.target.value});
					}}
				/>
				<hr />
				<WebcamCaptureContainer confirmMatch={this.confirmMatch} />
				{this.state.prediction && (
					<ConfirmationBoxContainer
						item={this.state.prediction.index}
						onYes={() => this.setState({prediction: null})}
						onNo={() => this.setState({showList: true})}>
						<img src={this.state.prediction.img} alt="" />
					</ConfirmationBoxContainer>
				)}
				{this.state.showList && (
					<StoreList
						username={this.state.currentUser}
						users={this.state.users}
						slackToken={token}
					/>
				)}
				{this.state.fetchUserSlackError && (
					<ErrorMessage text={'failed to fetch users'} />
				)}
			</div>
		);
	}
}

export default App;
