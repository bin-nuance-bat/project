import React from 'react';
import './Disclaimer.css';
import PropTypes from 'prop-types';
import Padlock from './assets/Padlock.svg';
import Camera from './assets/Camera.svg';
import BackButton from './../BackButton/BackButton';

const Disclaimer = props => {
  return (
    <div className="page">
      <BackButton history={props.history} />
      <div>
        <img src={Camera} className="disclaimer--big-camera" alt="" />{' '}
      </div>
      <div className="text text-info">
        As part of this process we will use the tablet&#39;s front-facing camera
        to attempt to identify your snack.
      </div>
      <div>
        <img src={Padlock} alt="" className="disclaimer--padlock" />
      </div>
      <div className="text text-info">
        Images may be stored in order to increase the accuracy of the item
        recognition, but they will not be used for any other purpose or shared
        with any third parties.
      </div>
      <button
        className="button button-accept"
        onClick={() => props.history.replace('/scanitem')}>
        Accept and continue
      </button>
    </div>
  );
};

Disclaimer.propTypes = {
  history: PropTypes.object.isRequired
};

export default Disclaimer;
