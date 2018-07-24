import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListSelection from '../listSelection/ListSelection';
import Logo from '../Logo/Logo';
import './EditSnack.css';
import TimeoutNotification from '../TimeoutNotification/TimeoutNotification';

class EditSnack extends Component {
  handleClick = id => {
    this.props.setActualItem(id);
    const nextPage = this.props.sendWithPhoto ? 'snackchat' : 'slackname';
    this.props.history.push('/' + nextPage);
  };

  render() {
    return (
      <div>
        <div className="edit-snack--header">
          <Logo />
          <div className="edit-snack edit-snack--text-info">
            Sorry, I can’t recognise that snack. <br /> Please select it below
          </div>
        </div>
        <ListSelection
          iconStyle="snack-icon"
          items={this.props.items}
          onClick={this.handleClick}
        />
        <TimeoutNotification />
      </div>
    );
  }
}

EditSnack.propTypes = {
  setActualItem: PropTypes.func.isRequired,
  sendWithPhoto: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default EditSnack;
