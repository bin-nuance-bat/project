import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

export default class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			advanced: false
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
					setState={this.props.setState}
				/>
				<Input
					label="Batch Size Fraction"
					value={this.props.batchSizeFraction}
					hide={!this.state.advanced}
					setState={this.props.setState}
				/>
				<Input
					label="Epochs"
					value={this.props.epochs}
					setState={this.props.setState}
				/>
				<Input
					label="Hidden Units"
					value={this.props.hiddenUnits}
					hide={!this.state.advanced}
					setState={this.props.setState}
				/>
				<Input
					label="Training Set Size"
					value={this.props.setSize}
					setState={this.props.setState}
				/>
				<Input
					label="Randomness"
					value={this.props.randomness}
					setState={this.props.setState}
				/>
				<Input
					label="Use Images Since"
					value={this.props.since}
					type="datetime-local"
					setState={this.props.setState}
				/>

				<div className="formGroup">
					<button
						onClick={this.props.train}
						disabled={this.props.busy}>
						Train
					</button>
					<button
						onClick={this.props.predict}
						disabled={this.props.busy}>
						Predict
					</button>
					<br />
					<button
						onClick={this.props.model.loadModel}
						disabled={this.props.busy}>
						Load
					</button>
					<button
						onClick={this.props.model.saveModel}
						disabled={this.props.busy}>
						Save
					</button>
					<button
						onClick={this.props.model.exportModel}
						disabled={this.props.busy}>
						Export
					</button>
				</div>
			</div>
		);
	}
}

Settings.propTypes = {
	model: PropTypes.object.isRequired,
	busy: PropTypes.bool.isRequired,
	learningRate: PropTypes.number.isRequired,
	batchSizeFraction: PropTypes.number.isRequired,
	epochs: PropTypes.number.isRequired,
	hiddenUnits: PropTypes.number.isRequired,
	setSize: PropTypes.number.isRequired,
	randomness: PropTypes.number.isRequired,
	since: PropTypes.string.isRequired,
	train: PropTypes.func.isRequired,
	predict: PropTypes.func.isRequired,
	setState: PropTypes.func.isRequired
};
