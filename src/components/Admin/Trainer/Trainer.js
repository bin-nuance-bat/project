import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Model from './Model';
import {imageToTensor} from './../AdminUtils';

import WebcamCapture from '../../WebcamCapture/WebcamCapture';
import ItemSelector from '../ItemSelector';
import Settings from './Settings';
import LoadingBar from './LoadingBar';

import '../Admin.css';

class Trainer extends Component {
  state = {
    learningRate: '0.0001',
    batchSizeFraction: '0.4',
    epochs: '200',
    hiddenUnits: '100',
    setSize: '100',
    randomness: '10',
    burstCount: 1,
    advanced: false,
    status: 'Loading...',
    item: 'unknown',
    busy: true,
    completion: 1
  };

  webcamCapture = React.createRef();
  item = React.createRef();
  traner = React.createRef();
  files = React.createRef();
  fileIndex = 0;

  setReadyStatus = status => this.setState({status, busy: false});
  setBusyStatus = status => this.setState({status, busy: true});
  setCompletion = completion => this.setState({completion});

  model = new Model(
    this.setReadyStatus,
    this.setBusyStatus,
    this.setCompletion
  );

  componentDidMount() {
    this.model.init();
  }

  back = () => {
    this.props.history.replace('/admin');
  };

  captureFromFile = async () => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = this.images[this.fileIndex];
      img.onload = () => {
        resolve(this.capture(img));
      };
    });
  };

  burstShot = () => {
    let counter = this.state.burstCount;
    const ticker = setInterval(() => {
      this.model.addExample(
        () => this.webcamCapture.current.webcam.current.getScreenshot(),
        () => imageToTensor(this.webcamCapture.current.webcam.current.video),
        this.state.item,
        1,
        false
      );
      counter--;
      if (counter <= 0) clearInterval(ticker);
      this.setCompletion(
        (this.state.burstCount - counter) / this.state.burstCount
      );
    }, 500);
  };

  addFromFile = () => {
    if (this.files.current.files.length < 1) {
      this.setReadyStatus('Please choose some files first.');
      return;
    }

    this.setState({busy: true});

    this.images = [];
    this.fileIndex = 0;
    let index = 0;
    const reader = new FileReader();

    reader.addEventListener('load', result => {
      this.images.push(result.target.result);
      if (index < this.files.current.files.length) {
        reader.readAsDataURL(this.files.current.files[index++]);
      } else {
        this.model.addExample(
          () => this.images[this.fileIndex++],
          this.captureFromFile,
          this.state.item,
          this.files.current.files.length
        );
      }
    });

    reader.readAsDataURL(this.files.current.files[index++]);
  };

  train = () => {
    this.setState({busy: true});

    const {
      hiddenUnits,
      batchSizeFraction,
      learningRate,
      epochs,
      setSize,
      randomness
    } = this.state;

    this.model.train(
      parseInt(hiddenUnits, 10),
      parseFloat(batchSizeFraction),
      parseFloat(learningRate),
      parseInt(epochs, 10),
      parseInt(setSize, 10),
      parseFloat(randomness)
    );
  };

  predict = () => {
    if (this.webcamCapture.current) {
      this.setState({busy: true});
      this.model.predict(
        imageToTensor(this.webcamCapture.current.webcam.current.video)
      );
    } else {
      this.setReadyStatus('Please connect a camera.');
    }
  };

  getName = item => item.name + (item.qualifier ? ` (${item.qualifier})` : '');

  render() {
    const {
      learningRate,
      batchSizeFraction,
      epochs,
      hiddenUnits,
      setSize,
      randomness,
      busy,
      status,
      item,
      burstCount,
      completion
    } = this.state;

    const items = Object.values(this.model ? this.model.items : {});
    items.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return (
      <div className="trainer page">
        <div className="col" style={{textAlign: 'center'}}>
          <div>
            <button className="button button-admin" onClick={this.back}>
              &laquo; Back
            </button>
          </div>
          <WebcamCapture imgSize={224} ref={this.webcamCapture} />
          <div>
            <ItemSelector
              item={item}
              items={items}
              setItem={i => this.setState({item: i})}
              disabled={busy}
            />
          </div>
          <div>
            <label>Burst Count:</label>
            <input
              type="number"
              value={burstCount}
              min={1}
              max={500}
              disabled={busy}
              onChange={e => this.setState({burstCount: e.target.value})}
            />
          </div>
          <div>
            <button
              className="button button-admin"
              onClick={this.burstShot}
              disabled={busy || !this.webcamCapture.current.webcam.current}>
              Add From Camera
            </button>
          </div>
          <div>
            <input type="file" multiple ref={this.files} disabled={busy} />
          </div>
          <div>
            <button
              className="button button-admin"
              onClick={this.addFromFile}
              disabled={busy}>
              Add From File
            </button>
          </div>
        </div>

        <Settings
          model={this.model}
          busy={busy}
          learningRate={learningRate}
          batchSizeFraction={batchSizeFraction}
          epochs={epochs}
          hiddenUnits={hiddenUnits}
          setSize={setSize}
          randomness={randomness}
          train={this.train}
          predict={this.predict}
          setState={(key, val) => this.setState({[key]: val})}
        />

        <div className="col item-table">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => {
                return (
                  <tr key={i.id}>
                    <td>{this.getName(i)}</td>
                    <td id={`${i.id}-count`}>{i.mlCount ? i.mlCount : 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <LoadingBar completion={completion} status={status} />
      </div>
    );
  }
}

Trainer.propTypes = {
  history: PropTypes.object.isRequired
};

export default Trainer;
