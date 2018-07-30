import React from 'react';
import './App.css';
import Logo from '../Logo/Logo';
import HomeHandsSlot from './assets/HandsSlot.svg';
import HomeHandsRight from './assets/HandsRight.svg';
import HomeHandsCenter from './assets/HandsCenter.svg';
import HomeHandsLeft from './assets/HandsLeft.svg';
import Camera from './assets/Camera.svg';
import PropTypes from 'prop-types';

class App extends React.Component {
  componentDidMount() {
    this.props.loadStoreList();
  }

  handleSnackChatClick = () => {
    this.props.setSendWithPhoto(true);
    this.props.history.replace('/disclaimer');
  };

  handleReminderNoPhotoClick = () => {
    this.props.setSendWithPhoto(false);
    this.props.history.replace('/disclaimer');
  };

  render() {
    return (
      <div className="page">
        <Logo />
        <div className="homepage">
          <h2 className="text text-payinglater">Paying later?</h2>
          <div className="text text-subheading">
            Why not send yourself a reminder on Slack?
          </div>
          <div className="homepage--hands">
            <img className="homepage--hands-slot" src={HomeHandsSlot} alt="" />
            <img
              className="homepage--hands-right"
              src={HomeHandsRight}
              alt=""
            />
            <img
              className="homepage--hands-center"
              src={HomeHandsCenter}
              alt=""
            />
            <img className="homepage--hands-left" src={HomeHandsLeft} alt="" />
          </div>
          <button
            className="button homepage--button--snackchat"
            onClick={this.handleSnackChatClick}>
            Send a SnackChat
            <img className="homepage--small-camera" src={Camera} alt="" />
          </button>
          <button
            className="button homepage--button--nophoto"
            onClick={this.handleReminderNoPhotoClick}>
            Send a reminder {/* without a photo */}
          </button>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  loadStoreList: PropTypes.func.isRequired,
  setSendWithPhoto: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default App;
