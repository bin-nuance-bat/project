import React from 'react';
import PropTypes from 'prop-types';

import ListSelection from '../listSelection/ListSelection';
import BackButton from '../BackButton/BackButton';

import './UsernameEntry.css';

class UsernameEntry extends React.Component {
  state = {
    selectedUser: null,
    sending: false
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
    this.setState({sending: true});
    const result = await this.props.sendSlackMessage(
      this.state.selectedUser.id
    );
    if (result) this.props.history.replace('/success');
    // TODO handle when result is false (i.e. message fails to send - redirect to error page?)
  };

  render() {
    return (
      <div className="username-entry--page" onTouchMove={this.deselect}>
        <header className="header">
          <BackButton history={this.props.history} />
          <div className="header-text">
            Please select your slack handle to send a reminder
          </div>
          {this.state.selectedUser && (
            <div className="confirm-modal">
              <button
                className="button btn-primary btn-half-block btn-modal"
                disabled={this.state.sending}
                onClick={this.sendReminder}>
                {this.state.sending ? 'Sending...' : 'Next'}
              </button>
            </div>
          )}
        </header>
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
  sendSlackMessage: PropTypes.func.isRequired
};

export default UsernameEntry;
