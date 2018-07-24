import React from 'react';
import './App.css';
import Logo from '../Logo/Logo';
import {Glyphicon} from 'react-bootstrap';

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
          <button
            className="button button-snackchat"
            onClick={this.handleSnackChatClick}>
            Send a SnackChat
            <Glyphicon className="cameraicon-small" glyph="camera" />
          </button>
          <button
            className="button button-nophoto"
            onClick={this.handleReminderNoPhotoClick}>
            Send a reminder without a photo
          </button>
        </div>
      </div>
    );
  }
}

export default App;
