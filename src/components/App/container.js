import {connect} from 'react-redux';
import App from './App';
import {setSendWithPhoto} from './actions';

const mapDispatchToProps = dispatch => ({
	setSendWithPhoto: sendWithPhoto => dispatch(setSendWithPhoto(sendWithPhoto))
});

export default connect(
	null,
	mapDispatchToProps
)(App);
