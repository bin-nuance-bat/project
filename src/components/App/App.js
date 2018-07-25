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
    this.props.history.push('/disclaimer');
  };

  handleReminderNoPhotoClick = () => {
    this.props.setSendWithPhoto(false);
    this.props.history.push('/disclaimer');
  };

  render() {
    return (
      <div>
        <Logo />
        <div className="page-home">
          <h2 className="text text-payinglater">Paying later?</h2>
          <div className="text text-subheading">
            Why not send yourself a reminder on Slack?
          </div>
          <div className="home-hands">
            <img className="home-hands-slot" src={HomeHandsSlot} alt="" />
            <img className="home-hands-right" src={HomeHandsRight} alt="" />
            <img className="home-hands-center" src={HomeHandsCenter} alt="" />
            <img className="home-hands-left" src={HomeHandsLeft} alt="" />
          </div>
          <button
            className="button button-snackchat"
            onClick={this.handleSnackChatClick}>
            Send a SnackChat
            <img
              className="smallcamera"
              width="28"
              height="28"
              src={Camera}
              alt=""
            />
          </button>
          <button
            className="button button-nophoto"
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
