import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Model from './../../utils/model';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import Logo from '../Logo/Logo';
import './ItemRecognition.css';

const ML_THRESHOLD = 0.06;

class ItemRecognition extends Component {
  model = new Model();
  webcam = React.createRef();

  componentDidMount() {
    this.props.setPrediction(null, null);
    this.model.load();

    this.props.setPrediction('c786086f-c183-4a6a-b9a4-72d142982cff', 'img.src');
    this.props.history.push('/confirmitem');
  }

  onConnect = () => {
    this.webcam.current
      .requestScreenshot()
      .then(this.handleImg)
      .catch(() => {
        setTimeout(this.onConnect, 100);
      });
  };

  handleImg = img => {
    this.model.predict(img).then(item => {
      if (
        item.value > ML_THRESHOLD &&
        item.id !== '' &&
        !this.props.prediction
      ) {
        this.props.setPrediction(item.id, img.src);
        this.props.history.push('/confirmitem');
      } else {
        if (this.webcam.current)
          this.webcam.current.requestScreenshot().then(this.handleImg);
      }
    });
  };

  render() {
    return (
      <div>
        <header>
          <Logo />
          <div className="item-recognition item-recognition--instructions">
            Scan item using the front facing camera
          </div>
        </header>
        <WebcamCapture
          className="item-recognition item-recognition--display"
          ref={this.webcam}
          onConnect={this.onConnect}
          imgSize={224}
        />
      </div>
    );
  }
}

ItemRecognition.propTypes = {
  setPrediction: PropTypes.func.isRequired,
  prediction: PropTypes.shape({
    name: PropTypes.string,
    img: PropTypes.string.isRequired
  }),
  history: PropTypes.object.isRequired
};

export default ItemRecognition;
