import React from 'react';
import './Home.css';
import HomeHandsSlot from './../../utils/assets/hands/HandsSlot.svg';
import HomeHandsRight from './../../utils/assets/hands/HandsRight.svg';
import HomeHandsCenter from './../../utils/assets/hands/HandsCenter.svg';
import HomeHandsLeft from './../../utils/assets/hands/HandsLeft.svg';
import Camera from './assets/Camera.svg';
import PropTypes from 'prop-types';

class Home extends React.Component {
  componentDidMount() {
    this.props.loadStoreList().catch(this.handleError);
    this.props.loadUsers().catch(this.handleError);
  }

  handleSnackChatClick = () => {
    this.props.setSendWithPhoto(true);
    this.props.history.replace('/disclaimer');
  };

  handleReminderNoPhotoClick = () => {
    this.props.setSendWithPhoto(false);
    this.props.history.replace('/disclaimer');
  };

  handleError = error => {
    if (error.code !== 'unauthenticated') this.props.history.replace('/error');
  };

  render() {
    return (
      <div className="page">
        <div className="homepage">
          <div className="text text-payinglater">Paying later?</div>
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
          <div>
            <button
              className="button btn-primary btn-block"
              onClick={this.handleReminderNoPhotoClick}>
              Send a Reminder
              <img className="homepage--small-camera" src={Camera} alt="" />
            </button>
          </div>
          <div>
            {/* <button
              className="button btn-secondary btn-block"
              onClick={this.handleReminderNoPhotoClick}>
              Send a reminder without a photo
            </button> */}
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  loadStoreList: PropTypes.func.isRequired,
  setSendWithPhoto: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loadUsers: PropTypes.func.isRequired
};

export default Home;
