import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DataController from '../utils/DataController';

import WebcamCapture from '../../WebcamCapture/WebcamCapture';
import ItemSelector from '../ItemSelector';
import Scrollable from '../Scrollable';

class Collection extends Component {
  state = {
    item: 'unknown',
    items: [{name: 'Unknown', id: 'unknown'}],
    burstCount: '10',
    status: 'Loading...',
    busy: true
  };

  webcam = React.createRef();
  ticker = null;

  burstShot = () => {
    clearInterval(this.ticker);
    let counter = 1;
    const target = parseInt(this.state.burstCount, 10);
    if (!target) {
      console.error('Invalid target', target);
      return;
    }

    this.setState({
      status: `Capturing image ${counter}/${target}`,
      busy: true
    });

    this.ticker = setInterval(async () => {
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
    this.dataController.getStoreList().then(storeList => {
      const items = [
        {name: 'Unknown', id: 'unknown'},
        ...Object.values(storeList)
      ];
      this.setState({busy: false, status: 'Ready', items});
    });
  }

  componentWillUnmount() {
    clearInterval(this.ticker);
  }

  back = () => {
    this.props.history.replace('/admin');
  };

  render() {
    const {status, item, items, busy, burstCount} = this.state;

    return (
      <Scrollable>
        <div className="page">
          <WebcamCapture ref={this.webcam} imgSize={160} onFail={() => {}} />
          <h2>{status}</h2>
          <ItemSelector
            item={item}
            items={items}
            setItem={i => this.setState({item: i})}
            disabled={busy}
          />
          <div>
            <label>Burst Count:</label>
            <input
              type="number"
              value={burstCount}
              min={1}
              max={100}
              disabled={busy}
              onChange={e => this.setState({burstCount: e.target.value})}
            />
          </div>
          <button
            className="button button-admin"
            onClick={this.burstShot}
            disabled={busy || !this.webcam.current.webcam.current}>
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
