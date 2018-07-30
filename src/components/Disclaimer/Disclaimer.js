import React from 'react';
import './Disclaimer.css';
import PropTypes from 'prop-types';
import TimeoutNotification from '../TimeoutNotification/TimeoutNotification';
import Padlock from './assets/Padlock.svg';
import Camera from './assets/Camera.svg';

const Disclaimer = props => {
  return (
    <div className="page">
      <div>
        <button
          className="button button-back"
          onClick={() => props.history.replace('/')}>
          <svg width="59" height="61" viewBox="0 0 59 61">
            <g fill="none" fillRule="evenodd">
              <polygon points="0 0 59 0 59 59 0 59" />
              <polygon
                fill="#FFF"
                fillRule="nonzero"
                points="44 10.38 39.602 6 15 30.5 39.602 55 44 50.62 23.797 30.5"
              />
            </g>
          </svg>
        </button>
      </div>
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
