import React, {Component} from 'react';
import {connect} from 'react-redux';
import WebcamCaptureContainer from '../WebcamCapture/WebcamCaptureContainer.js';
import ConfirmationBoxContainer from '../ConfirmationBox/ConfirmationBoxContainer';
import {StoreList} from './../StoreList/StoreList';
import ErrorMessage from './../ErrorMessage/ErrorMessage';
import {loadUsers} from './../../utils/slack';
import {setUsers, setSlackUserFetchError, setCurrentUser} from './actions';

class App extends Component {
	state = {
		prediction: null,
		showList: true,
		currentUser: ''
	};

	constructor(props) {
		super(props);
		this.confirmMatch = this.confirmMatch.bind(this);
	}

	confirmMatch(index, img) {
		this.setState(
			prevState =>
				prevState.prediction ? null : {prediction: {index, img}}
		);
	}

	changeCurrentUser = currentUser => {
		this.props.setCurrentUser(currentUser);
	};

	componentDidMount() {
		this.props
			.loadUsers()
			.catch(() => this.props.setSlackUserFetchError(true));
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
					value={this.props.currentUser}
					onChange={event =>
						this.changeCurrentUser(event.target.value)
					}
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
						storeList={this.props.storeList}
						username={this.props.currentUser}
						users={this.props.users}
					/>
				)}
				{this.state.fetchUserSlackError && (
					<ErrorMessage text={'failed to fetch users'} />
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		storeList: state.storeList,
		users: state.users,
		slackUserFetchError: state.slackUserFetchError,
		currentUser: state.currentUser
	};
};

const mapDispatchToProps = dispatch => {
	return {
		loadUsers: () =>
			loadUsers(users => {
				if (users) dispatch(setUsers(users));
				else dispatch(setSlackUserFetchError(true));
			}),
		setSlackUserFetchError: () => dispatch(setSlackUserFetchError(true)),
		setCurrentUser: currentUser => dispatch(setCurrentUser(currentUser))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
