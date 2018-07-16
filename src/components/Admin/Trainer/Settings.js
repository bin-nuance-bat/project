import React, {Component} from 'react';

export default class Settings extends Component {
	state = {
		advanced: false
	};

	render() {
		return (
			<div className="col">
				<div className="formGroup">
					<label>
						<input
							type="checkbox"
							onChange={() =>
								this.setState({advanced: !this.state.advanced})
							}
							checked={this.state.advanced}
						/>Show advanced settings
					</label>
				</div>
				{this.state.advanced && (
					<div className="formGroup">
						<label>
							Learning rate:<br />
							<input
								type="text"
								value={this.props.learningRate}
								onChange={e =>
									this.props.setState(
										'learningRate',
										e.target.value
									)
								}
							/>
						</label>
					</div>
				)}
				{this.state.advanced && (
					<div className="formGroup">
						<label>
							Batch Size Fraction:<br />
							<input
								type="text"
								value={this.props.batchSizeFraction}
								onChange={e =>
									this.props.setState(
										'batchSizeFraction',
										e.target.value
									)
								}
							/>
						</label>
					</div>
				)}
				<div className="formGroup">
					<label>
						Epochs:<br />
						<input
							type="text"
							value={this.props.epochs}
							onChange={e =>
								this.props.setState('epochs', e.target.value)
							}
						/>
					</label>
				</div>
				{this.state.advanced && (
					<div className="formGroup">
						<label>
							Hidden Units:<br />
							<input
								type="text"
								value={this.props.hiddenUnits}
								onChange={e =>
									this.props.setState(
										'hiddenUnits',
										e.target.value
									)
								}
							/>
						</label>
					</div>
				)}
				<div className="formGroup">
					<label>
						Training Set Size:<br />
						<input
							type="text"
							value={this.props.setSize}
							onChange={e =>
								this.props.setState('setSize', e.target.value)
							}
						/>
					</label>
				</div>
				<div className="formGroup">
					<label>
						Randomness:<br />
						<input
							type="text"
							value={this.props.randomness}
							onChange={e =>
								this.props.setState(
									'randomness',
									e.target.value
								)
							}
						/>
					</label>
				</div>
				<div className="formGroup">
					<label>
						Use images since:<br />
						<input
							type="datetime-local"
							value={this.props.since}
							onChange={e => {
								this.props.setState('since', e.target.value);
							}}
						/>
					</label>
				</div>
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
