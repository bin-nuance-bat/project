import React, {Component} from 'react';
import WebcamCapture from '../../WebcamCapture/WebcamCapture';
import ItemSelector from '../ItemSelector';
import Model from './Model';
import '../Admin.css';
import Settings from './Settings';
import {uriToTensor} from './../AdminUtils';

class Trainer extends Component {
  state = {
    learningRate: '0.0001',
    batchSizeFraction: '0.4',
    epochs: '200',
    hiddenUnits: '100',
    setSize: '100',
    randomness: '0.1',
    since: '1970-01-01T00:00',
    burstCount: 1,
    advanced: false,
    status: 'Loading...',
    item: 'unknown',
    busy: true
  };

  webcam = React.createRef();
  item = React.createRef();
  traner = React.createRef();
  files = React.createRef();
  fileIndex = 0;

  setReadyStatus = status => this.setState({status, busy: false});
  setBusyStatus = status => this.setState({status, busy: true});

  model = new Model(this.setReadyStatus, this.setBusyStatus);

  componentDidMount() {
    this.model.init();
  }

  capture = src => {
    return uriToTensor(src);
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

  screenshot = () => {
    return this.webcam.current.getScreenshot();
  };

  addExample = () => {
    this.setState({busy: true});
    this.model.addExample(
      this.screenshot,
      () => this.capture(this.webcam.current.video),
      this.state.item,
      this.state.burstCount
    );
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
      randomness,
      since
    } = this.state;

    this.model.train(
      parseInt(hiddenUnits, 10),
      parseFloat(batchSizeFraction),
      parseFloat(learningRate),
      parseInt(epochs, 10),
      parseInt(setSize, 10),
      parseFloat(randomness),
      Date.parse(since)
    );
  };

  predict = () => {
    if (this.webcam.current) {
      this.setState({busy: true});
      this.model.predict(this.capture(this.webcam.current.video));
    } else {
      this.setReadyStatus('Please connect a camera.');
    }
  };

  getName = item => {
    return item.name + (item.qualifier ? ` (${item.qualifier})` : '');
  };

  render() {
    const {
      learningRate,
      batchSizeFraction,
      epochs,
      hiddenUnits,
      setSize,
      randomness,
      since,
      busy,
      status,
      item,
      burstCount
    } = this.state;

    const items = this.model ? this.model.items : {};

    return (
      <div>
        <div className="col" style={{textAlign: 'center'}}>
          <div id="status-text">{status}</div>
          <WebcamCapture imgSize={224} />
          <div>
            <ItemSelector
              item={item}
              items={Object.values(items)}
              setItem={i => this.setState({i})}
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
              onClick={() => this.addExample(this.webcam.current.video)}
              disabled={busy || !this.webcam.current}>
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
          since={since}
          train={this.train}
          predict={this.predict}
          setState={(key, val) => this.setState({[key]: val})}
        />

        <div className="col" style={{maxHeight: 800, overflowY: 'scroll'}}>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(items).map(i => {
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
      </div>
    );
  }
}

export default Trainer;
