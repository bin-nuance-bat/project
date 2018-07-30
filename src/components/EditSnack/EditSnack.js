import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListSelection from '../listSelection/ListSelection';
import Logo from '../Logo/Logo';
import './EditSnack.css';
import TimeoutNotification from '../TimeoutNotification/TimeoutNotification';

class EditSnack extends Component {
  handleClick = item => {
    this.props.setActualItem(item.id);
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
      </div>
    );
  }
}

EditSnack.propTypes = {
  setActualItem: PropTypes.func.isRequired,
  sendWithPhoto: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

export default EditSnack;
