import React from 'react';
import PropTypes from 'prop-types';

import BackButton from '../BackButton/BackButton';
import Hand from '../Hand/Hand';

import './ConfirmationBox.css';

class ConfirmationBox extends React.Component {
  handleYes = () => {
    const {setActualItem, sendWithPhoto, history} = this.props;
    const {img, id} = this.props.prediction;
    setActualItem(id);
    if (this.props.dataController) this.props.dataController.addImage(img, id);
    const nextPage = sendWithPhoto ? 'snackchat' : 'slackname';
    history.replace('/' + nextPage);
  };

  handleNo = () => {
    this.props.history.replace('/editsnack');
  };

  render() {
    const image =
      this.props.prediction.id && this.props.storeList[this.props.prediction.id]
        ? this.props.storeList[this.props.prediction.id].image
        : null;
    return (
      <div className="page">
        <BackButton history={this.props.history} />
        <div className="text-confirmation">{`Is this a ${
          this.props.storeList[this.props.prediction.id].name
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
  storeList: PropTypes.object.isRequired,
  setActualItem: PropTypes.func.isRequired,
  sendWithPhoto: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  prediction: PropTypes.object.isRequired,
  dataController: PropTypes.object
};

export default ConfirmationBox;
