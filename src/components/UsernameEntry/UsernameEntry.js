import firebase from 'firebase/app';
import 'firebase/functions';
import React from 'react';
import PropTypes from 'prop-types';

import ListSelection from '../listSelection/ListSelection';
import BackButton from '../BackButton/BackButton';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

import './UsernameEntry.css';

class UsernameEntry extends React.Component {
  state = {
    selection: null,
    sending: false
  };

  promptToConfirm = selection => {
    this.setState(prevState => ({
      selection: prevState.sending ? prevState.selection : selection
    }));
  };

  deselect = () => {
    this.setState(
      prevState => (prevState.selection ? {selection: null} : null)
    );
  };

  sendReminder = () => {
    const user = this.state.selection.id;
    const storeList = this.props.storeList;
    const actualItemID = this.props.actualItem;
    const item = {
      id: actualItemID,
      name: storeList[actualItemID].name,
      price: storeList[actualItemID].price.total
    };
    const snackChat = this.props.sendWithPhoto ? this.props.snackChat : null;
    const endpoint = snackChat ? 'sendSnackChat' : 'sendSlackMessage';
    const send = firebase.functions().httpsCallable(endpoint);
    this.setState({sending: true});
    send({user, item, snackChat})
      .then(() => this.props.history.replace('/success'))
      .catch(() => this.props.history.replace('/error'));
  };

  handleBack = () => {
    console.log(this.props.predictionID);
    this.props.history.replace(
      this.props.sendWithPhoto
        ? '/snackchat'
        : this.props.actualItem === this.props.predictionID
          ? '/confirmitem'
          : '/editsnack'
    );
  };

  render() {
    return (
      <div className="username-entry--page" onTouchMove={this.deselect}>
        <header className="header">
          {!this.state.sending && <BackButton handleClick={this.handleBack} />}
          <div className="header-text">
            Please select your slack handle to send a reminder
          </div>
          {(this.state.selection || this.state.sending) && (
            <ConfirmationModal
              disabled={this.state.sending}
              onClick={this.sendReminder}
            />
          )}
        </header>
        <div>
          {this.props.users.length !== 0 && (
            <ListSelection
              items={this.props.users}
              onClick={this.promptToConfirm}
              selected={this.state.selection ? this.state.selection.name : null}
            />
          )}
        </div>
      </div>
    );
  }
}

UsernameEntry.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.shape({replace: PropTypes.func.isRequired}).isRequired,
  actualItem: PropTypes.string.isRequired,
  storeList: PropTypes.objectOf(PropTypes.object).isRequired,
  sendWithPhoto: PropTypes.bool.isRequired,
  predictionID: PropTypes.string.isRequired,
  snackChat: PropTypes.object
};

export default UsernameEntry;
