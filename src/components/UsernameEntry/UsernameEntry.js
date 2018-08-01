import React from 'react';
import PropTypes from 'prop-types';
import './UsernameEntry.css';
import ListSelection from '../listSelection/ListSelection';

class UsernameEntry extends React.Component {
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
      <div className="username-entry--page">
        <div className="username-entry--header">
          <div className="text-select-slack">
            Please select your slack handle to send a reminder
          </div>
        </div>
        <div>
          {this.props.users.length !== 0 && (
            <ListSelection
              items={this.props.users}
              onClick={this.sendReminder}
              iconStyle="username-icon"
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
