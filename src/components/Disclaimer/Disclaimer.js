import React from 'react';
import './Disclaimer.css';
import PropTypes from 'prop-types';
import Padlock from './assets/Padlock.svg';
import Camera from './assets/Camera.svg';
import BackButton from './../BackButton/BackButton';

const Disclaimer = props => {
  return (
    <div className="page">
      <BackButton handleClick={() => props.history.replace('/')} />
      <div className="disclaimer">
        <div className="disclaimer-item">
          <div>
            <img src={Camera} className="disclaimer-icon" alt="" />
          </div>
          <div className="disclaimer-text">
            As part of this process we will use the tablet&#39;s front-facing
            camera to attempt to identify your snack.
          </div>
        </div>
        <div className="disclaimer-item">
          <div>
            <img src={Padlock} alt="" className="disclaimer-icon" />
          </div>
          <div className="disclaimer-text">
            Images may be stored in order to increase the accuracy of the item
            recognition, but they will not be used for any other purpose or
            shared with any third parties.
          </div>
        </div>
        <div>
          <button
            className="button btn-primary btn-block"
            onClick={() => props.history.replace('/scanitem')}>
            Accept and continue
          </button>
        </div>
      </div>
    </div>
  );
};

Disclaimer.propTypes = {
  history: PropTypes.object.isRequired
};

export default Disclaimer;
