import firebase from 'firebase/app';
import 'firebase/functions';
import React from 'react';
import PropTypes from 'prop-types';
import './UsernameEntry.css';
import ListSelection from '../listSelection/ListSelection';

class UsernameEntry extends React.Component {
  state = {
    selectedUser: null
  };

  promptToConfirm = selectedUser => {
    this.setState({selectedUser});
  };

  deselect = () => {
    this.setState(
      prevState => (prevState.selectedUser ? {selectedUser: null} : null)
    );
  };

  sendReminder = async () => {
    const userid = this.state.selectedUser.id;

    const actualItemID = this.props.actualItem;
    const itemName = this.props.storeList[actualItemID].name;
    const snackChat = this.props.sendWithPhoto ? this.props.snackChat : null;
    const endpoint = snackChat ? 'sendSnackChat' : 'sendSlackMessage';
    const send = firebase.functions().httpsCallable(endpoint);

    await send({userid, itemName, actualItemID, snackChat})
      .then(() => {
        this.props.history.replace('/success');
      })
      .catch(this.props.history.replace('/error'));
  };

  render() {
    return (
      <div className="username-entry--page" onTouchMove={this.deselect}>
        <div className="username-entry--header" id="header">
          <div className="text-select-slack">
            Please select your slack handle to send a reminder
          </div>
          {this.state.selectedUser && (
            <div className="username-entry--confirm-div">
              <button
                className="button username-entry--confirm-button"
                onClick={this.sendReminder}>
                Next
              </button>
            </div>
          )}
        </div>
        <div>
          {this.props.users.length !== 0 && (
            <ListSelection
              items={this.props.users}
              onClick={this.promptToConfirm}
              iconStyle="username-icon"
              selected={
                this.state.selectedUser ? this.state.selectedUser.name : null
              }
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
  snackChat: PropTypes.object
};

export default UsernameEntry;
