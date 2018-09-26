import React from 'react';
import PropTypes from 'prop-types';

import BackButton from '../BackButton/BackButton';
import Hand from '../Hand/Hand';

import './ConfirmationBox.css';
import productName from '../../utils/productName';

class ConfirmationBox extends React.Component {
  handleYes = () => {
    const {setActualItem, sendWithPhoto, history} = this.props;
    const {id} = this.props.prediction;
    setActualItem(id);
    const nextPage = sendWithPhoto ? 'snackchat' : 'slackname';
    history.replace('/' + nextPage);
  };

  handleNo = () => {
    this.props.history.replace('/editsnack');
  };

  render() {
    if (
      !(
        this.props.prediction.id &&
        this.props.storeList[this.props.prediction.id]
      )
    ) {
      return (
        <div className="page">
          <BackButton
            handleClick={() => this.props.history.replace('/scanitem')}
          />
        </div>
      );
    }

    const item = this.props.storeList[this.props.prediction.id];
    const image = item.image;

    return (
      <div className="page">
        <BackButton
          handleClick={() => this.props.history.replace('/scanitem')}
        />
        <div className="text-confirmation">
          {`Is this a ${productName(item)}?`}
        </div>
        <Hand snack={image} />
        <div>
          <button
            className="button btn-half-block btn-no"
            data-test="NO"
            onClick={this.handleNo}>
            No
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
