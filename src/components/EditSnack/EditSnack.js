import {connect} from 'react-redux';
import React from 'react';

class EditSnack extends React.Component {
	render() {
		return <div>edit snack</div>;
	}
}

const mapStateToProps = state => {
	return {
		storeList: state.storeList,
		showList: state.showList,
		slackUserFetchError: state.slackUserFetchError,
		users: state.users,
		prediction: state.prediction
	};
};

const mapDispatchToProps = {
	loadUsers,
	loadStoreList,
	setShowList,
	setSlackUserFetchError
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditSnack);
