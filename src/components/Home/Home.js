import React from 'react';
import './Home.css';
import Camera from './assets/Camera.svg';
import PropTypes from 'prop-types';
import Revealer from '../Revealer/Revealer';
import HomeHands from '../HomeHands/HomeHands';

const REVEAL_DELAY_SECONDS = 20;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.revealIntervalId = 0;
    this.state = {theme: 'primary', reveal: '', hands: true};
  }

  componentDidMount() {
    const hourHasPassed =
      !this.props.latestUsersFetchTime ||
      Date.now() - this.props.latestUsersFetchTime > 36e5;
    if (hourHasPassed) {
      this.props.loadUsers().catch(this.handleError);
    }
    this.props.loadStoreList().catch(this.handleError);
    this.props.loadSlackUserReference();

    // Maintain access to video beyond root
    navigator.mediaDevices.getUserMedia({video: true});

    this.revealIntervalId = setInterval(
      this.toggleReveal,
      REVEAL_DELAY_SECONDS * 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.revealIntervalId);
  }

  toggleReveal = () => {
    const reveal = this.state.theme === 'primary' ? 'in' : 'out';
    this.setState({reveal});
  };

  handlePageObscured = () => {
    const newTheme = this.state.theme === 'primary' ? 'secondary' : 'primary';
    this.setState({theme: newTheme, hands: false});
  };

  handlePageRevealed = () => {
    this.setState({reveal: '', hands: true});
  };

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
        <Revealer
          reveal={this.state.reveal}
          onPageObscured={this.handlePageObscured}
          onPageRevealed={this.handlePageRevealed}
        />
        <div className={`homepage homepage-theme-${this.state.theme}`}>
          <div className="text text-payinglater">Paying later?</div>
          <div className="text text-subheading">
            Why not send yourself a reminder on Slack?
          </div>
          <HomeHands up={this.state.hands} />
          <div>
            <button
              className="button btn-primary btn-block"
              onClick={this.handleSnackChatClick}>
              Send a SnackChat
              <img className="homepage--small-camera" src={Camera} alt="" />
            </button>
          </div>
          <div>
            <button
              className="button btn-secondary btn-block"
              onClick={this.handleReminderNoPhotoClick}>
              Send a reminder without a photo
            </button>
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
  loadUsers: PropTypes.func.isRequired,
  latestUsersFetchTime: PropTypes.number,
  loadSlackUserReference: PropTypes.func.isRequired
};

export default Home;
