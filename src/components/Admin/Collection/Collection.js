import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DataController from '../utils/DataController';

import WebcamCapture from '../../WebcamCapture/container';
import ItemSelector from '../ItemSelector';

class Collection extends Component {
  state = {
    item: 'unknown',
    burstCount: '10',
    status: 'Loading...',
    busy: true
  };

  items = [];
  webcamCapture = React.createRef();

  burstShot = () => {
    let counter = this.state.burstCount;
    const ticker = setInterval(async () => {
      this.setState({
        busy: true,
        status:
          `Capturing image ${this.state.burstCount - counter}` +
          `/${this.state.burstCount}`
      });

      const img = await this.webcamCapture.current.requestScreenshot();
      this.dataController.addImage(img.src, this.state.item);

      counter--;
      if (counter <= 0) {
        clearInterval(ticker);
        this.setState({busy: false, status: 'Done'});
      }
    }, 1000);
  };

  componentDidMount() {
    this.dataController = new DataController();
    this.dataController.getStoreList().then(items => {
      this.items = Object.values(items);
      this.setState({busy: false, status: 'Ready'});
    });
  }

  back = () => {
    this.props.history.replace('/admin');
  };

  render() {
    return (
      <div className="page">
        <WebcamCapture
          ref={this.webcamCapture}
          imgSize={224}
          onFail={() => {}}
        />
        <h2>{this.state.status}</h2>
        <ItemSelector
          item={this.state.item}
          items={this.items}
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
        <div>
          <button className="button button-admin" onClick={this.back}>
            &laquo; Back
          </button>
        </div>
      </div>
    );
  }
}

Collection.propTypes = {
  history: PropTypes.object.isRequired
};

export default Collection;
