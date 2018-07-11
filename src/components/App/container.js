import {connect} from 'react-redux';
import App from './App';
import {setSendWithPhoto} from './actions';

const mapDispatchToProps = {
	setSendWithPhoto
};

export default connect(
	null,
	mapDispatchToProps
)(App);
