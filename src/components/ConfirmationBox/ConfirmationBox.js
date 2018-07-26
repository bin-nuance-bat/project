import React from 'react';
import PropTypes from 'prop-types';
import Logo from '../Logo/Logo';
import './ConfirmationBox.css';
import Hand from '../Hand/Hand';

class ConfirmationBox extends React.Component {
  insertTrainingImage = () => {};

  handleYes = () => {
    const {setActualItem, id, sendWithPhoto, history} = this.props;
    setActualItem(id);
    const nextPage = sendWithPhoto ? 'snackchat' : 'slackname';
    history.push('/' + nextPage);
  };

  handleNo = () => {
    this.props.history.push('/editSnack');
  };

  render() {
    return (
      <div>
        <Logo />
        <div className="text-confirmation">{`Is this a ${
          this.props.name
        }?`}</div>
        <div className="confirmation-hand">
          <Hand />
        </div>
        <div>
          <button
            className="button button-editsnack"
            data-test="NO"
            onClick={this.handleNo}>
            Edit Snack
          </button>
          <button
            className="button button-yes"
            data-test="YES"
            onClick={this.handleYes}>
            Yes
          </button>
        </div>
      </div>
    );
  }
}

ConfirmationBox.propTypes = {
  setActualItem: PropTypes.func.isRequired,
  sendWithPhoto: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default ConfirmationBox;
