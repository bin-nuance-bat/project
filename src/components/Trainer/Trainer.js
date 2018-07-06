import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import Model from './Model';
import * as tf from '@tensorflow/tfjs';
import './Trainer.css';

class Trainer extends Component {
	constructor(props) {
		super(props);

		this.webcam = React.createRef();
		this.item = React.createRef();
		this.traner = React.createRef();

		this.capture = this.capture.bind(this);
		this.model = new Model(this.setStatus.bind(this));
		this.getName = this.getName.bind(this);
		this.addExample = this.addExample.bind(this);
		this.train = this.train.bind(this);
		this.predict = this.predict.bind(this);

		this.state = {
			learningRate: 0.0001,
			batchSize: 0.4,
			epochs: 20,
			hiddenUnits: 100,
			status: 'Load or start a new model to begin.',
			item: 0
		};
	}

	capture() {
		return tf.tidy(() => {
			return this.cropImage(tf.fromPixels(this.webcam.current.video))
				.expandDims(0)
				.toFloat()
				.div(tf.scalar(127))
				.sub(tf.scalar(1));
		});
	}

	cropImage(img) {
		const size = Math.min(img.shape[0], img.shape[1]);
		const centerHeight = img.shape[0] / 2;
		const beginHeight = centerHeight - size / 2;
		const centerWidth = img.shape[1] / 2;
		const beginWidth = centerWidth - size / 2;

		return tf.image.resizeBilinear(
			img.slice([beginHeight, beginWidth, 0], [size, size, 3]),
			[224, 224]
		);
	}

	addExample() {
		this.model.addExample(this.capture(), this.state.item);
	}

	train() {
		this.model.train(
			this.state.hiddenUnits,
			this.state.batchSize,
			this.state.learningRate,
			this.state.epochs
		);
	}

	predict() {
		this.model.predict(this.capture());
	}

	getName(i) {
		let item = this.model.items[i];
		return item.name + (item.qualifier ? ` (${item.qualifier})` : '');
	}

	setStatus(status) {
		this.setState({status});
	}

	render() {
		return (
			<div>
				<div className="col" style={{textAlign: 'center'}}>
					<select
						value={this.state.item}
						onChange={e => this.setState({item: e.target.value})}>
						{this.model.items.map((item, i) => (
							<option key={i} value={i}>
								{this.getName(i)}
							</option>
						))}
					</select>
					<button onClick={this.addExample}>Add Example</button>
					<br />
					<br />
					<WebcamCapture
						style={{width: 400, height: 400}}
						cameraConnected={true}
						cameraRef={this.webcam}
					/>
					<span id="status-text">{this.state.status}</span>
				</div>

				<div className="col">
					<label>
						Learning rate:<br />
						<input
							type="text"
							onChange={e =>
								this.setState({learningRate: e.target.value})
							}
							value={this.state.learningRate}
						/>
					</label>
					<br />
					<br />
					<label>
						Batch Size:<br />
						<input
							type="text"
							onChange={e =>
								this.setState({batchSize: e.target.value})
							}
							value={this.state.batchSize}
						/>
					</label>
					<br />
					<br />
					<label>
						Epochs:<br />
						<input
							type="text"
							onChange={e =>
								this.setState({epochs: e.target.value})
							}
							value={this.state.epochs}
						/>
					</label>
					<br />
					<br />
					<label>
						Hidden Units:<br />
						<input
							type="text"
							onChange={e =>
								this.setState({hiddenUnits: e.target.value})
							}
							value={this.state.hiddenUnits}
						/>
					</label>
					<br />
					<br />
					<button onClick={this.train}>Train</button>
					<button onClick={this.predict}>Predict</button>
					<button onClick={this.model.newModel}>
						New Model
					</button>{' '}
					<br />
					<button onClick={this.model.loadModel}>Load</button>
					<button onClick={this.model.saveModel}>Save</button>
					<button onClick={this.model.exportModel}>Export</button>
				</div>

				<table className="col">
					<thead>
						<tr>
							<th>Item</th>
							<th>Count</th>
						</tr>
					</thead>
					<tbody>
						{this.model.items.map((item, i) => {
							return (
								<tr key={i}>
									<td>{this.getName(i)}</td>
									<td id={`${i}-count`}>0</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

export default Trainer;
