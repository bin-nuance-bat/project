import {connect} from 'react-redux';
import {setCameraConnected} from './actions';
import WebcamCapture from './WebcamCapture';

const mapStateToProps = (_, ownProps) => ({
  ownProps
});

const mapDispatchToProps = {
  setCameraConnected
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WebcamCapture);
