import {connect} from 'react-redux';
import UsernameEntry from './UsernameEntry';
import {setCurrentUser} from './actions';

const mapStateToProps = state => {
	return {
		currentUser: state.currentUser
	};
};

const mapDispatchToProps = {
	setCurrentUser
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsernameEntry);
