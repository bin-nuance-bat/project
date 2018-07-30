import React from 'react';
import PropTypes from 'prop-types';
import Logo from '../Logo/Logo';
import './ConfirmationBox.css';
import Hand from '../Hand/Hand';

class ConfirmationBox extends React.Component {
  handleYes = () => {
    const {setActualItem, id, sendWithPhoto, history} = this.props;
    setActualItem(id);
    const nextPage = sendWithPhoto ? 'snackchat' : 'slackname';
    history.replace('/' + nextPage);
  };

  handleNo = () => {
    this.props.history.replace('/editSnack');
  };

  render() {
    const {image} = this.props.storeList[this.props.id];
    return (
      <div className="page">
        <Logo />
        <div className="text-confirmation">{`Is this a ${
          this.props.name
        }?`}</div>
        <div className="confirmation-hand">
          <Hand snack={image} />
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
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  storeList: PropTypes.object.isRequired,
  setActualItem: PropTypes.func.isRequired,
  sendWithPhoto: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired
};

export default ConfirmationBox;
