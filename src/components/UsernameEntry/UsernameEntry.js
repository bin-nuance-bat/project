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

  sendReminder = async () => {
    this.setState({sending: true});
    const result = await this.props.sendSlackMessage(this.state.selection.id);
    if (result) this.props.history.replace('/success');
    // TODO handle when result is false (i.e. message fails to send - redirect to error page?)
  };

  handleBack = () =>
    this.props.history.replace(
      this.props.sendWithPhoto
        ? '/snackchat'
        : this.props.actualItem === this.props.prediction.id
          ? '/confirmitem'
          : '/editsnack'
    );

  render() {
    return (
      <div className="username-entry--page" onTouchMove={this.deselect}>
        <header className="header">
          <BackButton handleClick={this.handleBack} />
          <div className="header-text">
            Please select your slack handle to send a reminder
          </div>
          {this.state.selection && (
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
  sendSlackMessage: PropTypes.func.isRequired,
  sendWithPhoto: PropTypes.bool.isRequired,
  actualItem: PropTypes.string.isRequired,
  prediction: PropTypes.object.isRequired
};

export default UsernameEntry;
