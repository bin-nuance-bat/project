import {connect} from 'react-redux';
import UsernameEntry from './UsernameEntry';
import {setCurrentUser} from './actions';

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setCurrentUser: currentUser => dispatch(setCurrentUser(currentUser))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsernameEntry);
