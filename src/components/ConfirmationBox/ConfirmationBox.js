import React from 'react';
import PropTypes from 'prop-types';

import BackButton from '../BackButton/BackButton';
import Hand from '../Hand/Hand';

import './ConfirmationBox.css';

class ConfirmationBox extends React.Component {
  handleYes = () => {
    const {setActualItem, id, sendWithPhoto, history} = this.props;
    setActualItem(id);
    this.props.dataController.addImage(this.props.prediction.img, id);
    const nextPage = sendWithPhoto ? 'snackchat' : 'slackname';
    history.replace('/' + nextPage);
  };

  handleNo = () => {
    this.props.history.replace('/editsnack');
  };

  render() {
    const image =
      this.props.id && this.props.storeList[this.props.id]
        ? this.props.storeList[this.props.id].image
        : null;
    return (
      <div className="page">
        <BackButton history={this.props.history} />
        <div className="text-confirmation">{`Is this a ${
          this.props.name
        }?`}</div>
        <Hand snack={image} />
        <div>
          <button
            className="button btn-half-block btn-no"
            data-test="NO"
            onClick={this.handleNo}>
            Edit Snack
          </button>
          <button
            className="button btn-half-block btn-yes"
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
  history: PropTypes.object.isRequired,
  prediction: PropTypes.object.isRequired,
  dataController: PropTypes.object.isRequired
};

export default ConfirmationBox;
