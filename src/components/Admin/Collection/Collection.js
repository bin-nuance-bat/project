import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DataController from '../utils/DataController';

import WebcamCapture from '../../WebcamCapture/WebcamCapture';
import ItemSelector from '../ItemSelector';
import Scrollable from '../Scrollable';

class Collection extends Component {
  state = {
    item: 'unknown',
    burstCount: '10',
    status: 'Loading...',
    busy: true
  };

  items = [];
  webcam = React.createRef();
  ticker = null;

  burstShot = () => {
    clearInterval(this.ticker);
    let counter = 1;
    const target = parseInt(this.state.burstCount);
    if (!target) {
      console.error('Invalid target', target);
      return;
    }

    this.setState({
      status: `Capturing image ${counter}/${target}`,
      busy: true
    });

    this.ticker = setInterval(async () => {
      console.info(counter, target);
      this.setState({
        status: `Capturing image ${counter}/${target}`,
        busy: true
      });

      const camera = this.webcam.current;
      const canvas = camera.getCanvas();
      const imgSrc = canvas.toDataURL('image/jpeg');

      this.dataController.addImage(imgSrc, this.state.item);

      ++counter;
      if (counter > target) {
        clearInterval(this.ticker);
        this.setState({busy: false, status: 'Done'});
      }
    }, 500);
  };

  componentDidMount() {
    this.dataController = new DataController();
    this.dataController.getStoreList().then(items => {
      this.items = Object.values(items);
      this.setState({busy: false, status: 'Ready'});
    });
  }

  back = () => {
    clearInterval(this.ticker);
    this.props.history.replace('/admin');
  };

  render() {
    return (
      <Scrollable>
        <div className="page">
          <WebcamCapture ref={this.webcam} imgSize={160} onFail={() => {}} />
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
            disabled={this.state.busy || !this.webcam.current.webcam.current}>
            Capture Images
          </button>
          <div>
            <button className="button button-admin" onClick={this.back}>
              &laquo; Back
            </button>
          </div>
        </div>
      </Scrollable>
    );
  }
}

Collection.propTypes = {
  history: PropTypes.object.isRequired
};

export default Collection;
