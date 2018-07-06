import React, {Component} from 'react';
import {connect} from 'react-redux';
import App from './App';
import {loadUsers} from './../../utils/slack';
import {setUsers, setSlackUserFetchError, setCurrentUser} from './actions';

class AppContainer extends Component {
	state = {
		prediction: null,
		showList: true,
		currentUser: ''
	};

	constructor(props) {
		super(props);
		this.confirmMatch = this.confirmMatch.bind(this);
		this.changeCurrentUser = this.changeCurrentUser.bind(this);
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
			<App
				currentUser={this.props.currentUser}
				prediction={this.state.prediction}
				showList={this.state.showList}
				slackUserFetchError={this.props.slackUserFetchError}
				loadStoreListError={this.props.loadStoreListError}
				confirmMatch={this.confirmMatch}
				storeList={this.props.storeList}
				users={this.props.users}
				changeCurrentUser={this.changeCurrentUser}
			/>
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
)(AppContainer);
