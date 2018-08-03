import React, {Component} from 'react';
//import {ControllerDataset} from '../ControllerDataset';

import Model from '../Trainer/Model';
import {imageToTensor} from './../AdminUtils';

import WebcamCapture from '../../WebcamCapture/WebcamCapture';
import ItemSelector from '../ItemSelector';

class Collection extends Component {
  state = {
    item: 'unknown',
    burstCount: '10',
    status: 'Loading...',
    busy: true,
    flash: 'flash'
  };

  webcamCapture = React.createRef();

  setReadyStatus = status => {
    this.setState({status, busy: false});
  };

  setBusyStatus = status => {
    this.setState({status, busy: true});
  };

  // eslint-disable-next-line
  model = new Model(this.setReadyStatus, this.setBusyStatus, console.log);

  componentDidMount() {
    this.model.init();
  }

  burstShot = () => {
    let counter = this.state.burstCount;
    const ticker = setInterval(async () => {
      const img = await this.webcamCapture.current.requestScreenshot();
      this.model.addExample(
        () => img.src,
        () => imageToTensor(img),
        this.state.item,
        1,
        false
      );
      counter--;
      if (counter <= 0) clearInterval(ticker);
    }, 1000);
  };

  render() {
    const items = Object.values(this.model ? this.model.items : {});
    items.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return (
      <div className="page">
        <WebcamCapture
          className={this.state.flash}
          ref={this.webcamCapture}
          imgSize={224}
        />
        <h2>{this.state.status}</h2>
        <ItemSelector
          item={this.state.item}
          items={items}
          setItem={i => this.setState({item: i})}
          disabled={this.state.busy}
        />
        <div>
          <label>Burst Count:</label>
          <input
            type="number"
            value={this.state.burstCount}
            min={1}
            max={100}
            disabled={this.state.busy}
            onChange={e => this.setState({burstCount: e.target.value})}
          />
        </div>
        <button
          className="button button-admin"
          onClick={this.burstShot}
          disabled={
            this.state.busy || !this.webcamCapture.current.webcam.current
          }>
          Capture Images
        </button>
      </div>
    );
  }
}

export default Collection;
