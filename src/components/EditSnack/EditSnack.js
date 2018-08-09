import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListSelection from '../listSelection/ListSelection';
import './EditSnack.css';
import BackButton from '../BackButton/BackButton';

class EditSnack extends Component {
  handleClick = item => {
    this.props.setActualItem(item.id);
    const nextPage = this.props.sendWithPhoto ? 'snackchat' : 'slackname';
    this.props.history.replace('/' + nextPage);
  };

  render() {
    return (
      <div className="edit-snack--page">
        <header className="header">
          <BackButton history={this.props.history} />
          <div className="header-text">
            Sorry, I can’t recognise that snack <br /> Please select it below
          </div>
        </header>
        <ListSelection
          iconStyle="snack-icon"
          items={this.props.items}
          onClick={this.handleClick}
          suggestions={this.props.suggestions}
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
  ).isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default EditSnack;
