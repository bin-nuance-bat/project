import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      advanced: false,
      modelName: new Date().toLocaleString()
    };
  }

  toggleAdvanced = () => {
    this.setState({advanced: !this.state.advanced});
  };

  render() {
    return (
      <div className="col">
        <div className="formGroup">
          <label>
            <input
              type="checkbox"
              onChange={this.toggleAdvanced}
              checked={this.state.advanced}
            />Show advanced settings
          </label>
        </div>

        <Input
          label="Learning Rate"
          value={this.props.learningRate}
          hide={!this.state.advanced}
          range={[0.00001, 0.1]}
          setState={val => this.props.setState('learningRate', val)}
        />
        <Input
          label="Batch Size Fraction"
          value={this.props.batchSizeFraction}
          hide={!this.state.advanced}
          range={[0.1, 1]}
          setState={val => this.props.setState('learningRate', val)}
        />
        <Input
          label="Epochs"
          value={this.props.epochs}
          range={[1, 5000]}
          setState={val => this.props.setState('epochs', val)}
        />
        <Input
          label="Hidden Units"
          value={this.props.hiddenUnits}
          hide={!this.state.advanced}
          range={[50, 500]}
          setState={val => this.props.setState('hiddenUnits', val)}
        />
        <Input
          label="Training Set Size"
          value={this.props.setSize}
          range={[100, 1000]}
          setState={val => this.props.setState('setSize', val)}
        />
        <Input
          label="Randomness"
          range={[1, 100]}
          value={this.props.randomness}
          setState={val => this.props.setState('randomness', val)}
        />

        <div className="formGroup">
          <div>
            <button
              className="button button-admin"
              onClick={this.props.train}
              disabled={this.props.busy}>
              Train
            </button>
            <button
              className="button button-admin"
              onClick={this.props.predict}
              disabled={this.props.busy}>
              Predict
            </button>
          </div>
          <div>
            <Input
              label="Model Name"
              value={this.state.modelName}
              type="text"
              setState={modelName => {
                this.setState({modelName});
              }}
            />
            <button
              className="button button-admin"
              onClick={() => this.props.model.loadModel(this.state.modelName)}
              disabled={this.props.busy}>
              Load
            </button>
            <button
              className="button button-admin"
              onClick={() => this.props.model.saveModel(this.state.modelName)}
              disabled={this.props.busy}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  model: PropTypes.object.isRequired,
  busy: PropTypes.bool.isRequired,
  learningRate: PropTypes.string.isRequired,
  batchSizeFraction: PropTypes.string.isRequired,
  epochs: PropTypes.string.isRequired,
  hiddenUnits: PropTypes.string.isRequired,
  setSize: PropTypes.string.isRequired,
  randomness: PropTypes.string.isRequired,
  train: PropTypes.func.isRequired,
  predict: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired
};
