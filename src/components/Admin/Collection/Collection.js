import React, {Component} from 'react';
//import {ControllerDataset} from '../ControllerDataset';

import WebcamCapture from '../WebcamCapture/WebcamCapture';

class Collection extends Component {
  render() {
    return (
      <div className="page">
        <WebcamCapture
          className="item-recognition item-recognition--display"
          imgSize={224}
        />
      </div>
    );
  }
}

export default Collection;
