import React from 'react';
import PropTypes from 'prop-types';
import './UsernameEntry.css';
import ListSelection from '../listSelection/ListSelection';

class UsernameEntry extends React.Component {
  state = {
    showConfirmButton: false,
    selectedName: null
  };

  promptToConfirm = e => {
    this.setState({showConfirmButton: true, selectedName: e.name});
  };

  deselect = () => {
    if (this.state.showConfirmButton) {
      this.setState({showConfirmButton: false, selectedName: null});
    }
  };

  sendReminder = async user => {
    const result = await this.props.sendSlackMessage(user.id);
    if (result) this.props.history.replace('/success');
    // TODO handle when result is false (i.e. message fails to send - redirect to error page?)
  };

  componentDidMount() {
    this.props.loadUsers();
  }

  render() {
    return (
      <div className="username-entry--page" onTouchMove={this.deselect}>
        <div className="username-entry--header" id="header">
          <div className="text-select-slack">
            Please select your slack handle to send a reminder
          </div>
          {this.state.showConfirmButton && (
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
              selected={this.state.selectedName}
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
  loadUsers: PropTypes.func.isRequired,
  sendSlackMessage: PropTypes.func.isRequired
};

export default UsernameEntry;
