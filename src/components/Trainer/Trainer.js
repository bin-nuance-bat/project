import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import {ControllerDataset} from './controller_dataset';
import getStore from '../../utils/honestyStore.js';
import * as tf from '@tensorflow/tfjs';
import './Trainer.css';

let controllerDataset;
let mobilenet;
let model;

// Loads mobilenet and returns a model that returns the internal activation
// we'll use as input to our classifier model.
async function loadMobilenet() {
	const mobilenet = await tf.loadModel(
		'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
	);

	// Return a model that outputs an internal activation.
	const layer = mobilenet.getLayer('conv_pw_13_relu');
	return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}

function getName(item) {
	if (typeof item === 'number') {
		item = this.items[item];
	}
	return item.name + (item.qualifier ? ` (${item.qualifier})` : '');
}

class Trainer extends Component {
	constructor(props) {
		super(props);

		this.webcam = React.createRef();
		this.item = React.createRef();

		this.init = this.init.bind(this);
		this.capture = this.capture.bind(this);
		this.addExample = this.addExample.bind(this);
		this.train = this.train.bind(this);
		this.predict = this.predict.bind(this);
		this.newModel = this.newModel.bind(this);
		this.saveModel = this.saveModel.bind(this);
		this.loadModel = this.loadModel.bind(this);

		this.items = [{name: 'Unknown'}];

		this.state = {
			learningRate: 0.0001,
			batchSize: 0.4,
			epochs: 20,
			hiddenUnits: 100
		};
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

	capture() {
		return tf.tidy(() => {
			return this.cropImage(tf.fromPixels(this.webcam.current.video))
				.expandDims(0)
				.toFloat()
				.div(tf.scalar(127))
				.sub(tf.scalar(1));
		});
	}

	async addExample() {
		tf.tidy(() => {
			controllerDataset.addExample(
				mobilenet.predict(this.capture()),
				this.item.current.value
			);
		});
		document.getElementById(`${this.item.current.value}-count`).innerHTML++;
		this.setStatus(`Added image of ${getName(this.item.current.value)}!`);
		await tf.nextFrame();
	}

	setStatus(status) {
		document.getElementById('status-text').innerHTML = status;
	}

	async train() {
		if (controllerDataset.xs === null) {
			this.setStatus('Please collect some training images first!');
			return;
		}

		this.setStatus('Training model, please wait...');
		await tf.nextFrame();

		model = tf.sequential({
			layers: [
				tf.layers.flatten({inputShape: [7, 7, 256]}),
				tf.layers.dense({
					units: this.state.hiddenUnits,
					activation: 'relu',
					kernelInitializer: 'varianceScaling',
					useBias: true
				}),
				tf.layers.dense({
					units: this.items.length,
					kernelInitializer: 'varianceScaling',
					useBias: false,
					activation: 'softmax'
				})
			]
		});

		const optimizer = tf.train.adam(this.state.learningRate);
		model.compile({optimizer, loss: 'categoricalCrossentropy'});

		const batchSize = Math.floor(
			controllerDataset.xs.shape[0] * this.state.batchSize
		);
		if (!(batchSize > 0)) {
			this.setStatus(
				'Batch size invalid, please choose a number 0 < x < 1'
			);
			return;
		}

		model.fit(controllerDataset.xs, controllerDataset.ys, {
			batchSize,
			epochs: this.state.epochs,
			callbacks: {
				onBatchEnd: async (batch, logs) => {
					this.setStatus('Training. Loss: ' + logs.loss.toFixed(5));
					await tf.nextFrame();
				},
				onTrainEnd: async () => {
					this.setStatus('Finished Training. Try me out!');
					await tf.nextFrame();
				}
			}
		});
	}

	async predict() {
		if (!model) {
			this.setStatus('Please train the model first');
			return;
		}
		this.setStatus('Predicting...');
		const predictedClass = tf.tidy(() => {
			const image = this.capture();
			const activation = mobilenet.predict(image);
			const predictions = model.predict(activation);
			return predictions.as1D().argMax();
		});

		const classId = (await predictedClass.data())[0];
		predictedClass.dispose();
		this.setStatus('I think this is a ' + this.items[classId]);
	}

	async init() {
		controllerDataset = new ControllerDataset(this.items.length);
		mobilenet = await loadMobilenet();
		await tf.nextFrame();
		tf.tidy(() => mobilenet.predict(this.capture()));
		this.setStatus('Ready');
		this.forceUpdate();
	}

	newModel() {
		if (
			!this.model ||
			window.confirm(
				'Loading the model will overwrite any training you have done. Continue?'
			)
		) {
			this.setStatus('Fetching store data...');
			getStore((err, store) => {
				this.items = this.items.concat(store);
				this.init();
			});
		}
	}

	async saveModel() {
		if (!this.model) {
			this.setStatus('Please train a model to save.');
			return;
		}
		window.localStorage.setItem('items', JSON.stringify(this.items));
		return await model.save('indexeddb://store-model');
	}

	async loadModel() {
		if (
			!this.model ||
			window.confirm(
				'Loading the model will overwrite any training you have done. Continue?'
			)
		) {
			this.items = JSON.parse(window.localStorage.getItem('items'));
			model = await tf.loadModel('indexeddb://store-model');
			this.init();
		}
	}

	componentDidCatch(err, info) {
		this.setState({error: {err, info}});
	}

	render() {
		return (
			<div>
				<div className="col" style={{textAlign: 'center'}}>
					<select ref={this.item}>
						{this.items.map((item, i) => (
							<option key={i} value={i}>
								{getName(item)}
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
					<br />
					<span id="status-text">
						Load or start a new model to begin.<br />
						{JSON.stringify(this.state.err)}
					</span>
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
					<button onClick={this.newModel}>New Model</button> <br />
					<button onClick={this.loadModel}>Load Model</button>
					<button onClick={this.saveModel}>Save Model</button>
				</div>

				<table className="col">
					<thead>
						<tr>
							<th>Item</th>
							<th>Count</th>
						</tr>
					</thead>
					<tbody>
						{this.items.map((item, i) => (
							<tr key={i}>
								<td>{getName(item)}</td>
								<td id={`${i}-count`}>0</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}

export default Trainer;
