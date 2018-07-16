import React, {Component} from 'react';
import WebcamCapture from '../WebcamCapture/WebcamCapture';
import ItemSelector from './ItemSelector';
import Model from './Model';
import * as tf from '@tensorflow/tfjs';
import './Trainer.css';

class Trainer extends Component {
	constructor(props) {
		super(props);

		this.webcam = React.createRef();
		this.item = React.createRef();
		this.traner = React.createRef();
		this.files = React.createRef();
		this.fileIndex = 0;

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
			burstCount: 1,
			status: 'Loading mobilenet...',
			item: 'unknown',
			busy: true
		};
	}

	capture(src) {
		return tf.tidy(() => {
			return this.cropImage(tf.fromPixels(src))
				.expandDims(0)
				.toFloat()
				.div(tf.scalar(127))
				.sub(tf.scalar(1));
		});
	}

	captureFromFile = async () => {
		return new Promise(resolve => {
			const img = new Image();
			img.src = this.images[this.fileIndex];
			img.onload = () => {
				resolve(this.capture(img));
			};
		});
	};

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

	screenshot = () => {
		return this.webcam.current.webcam.current.getScreenshot();
	};

	addExample() {
		this.setState({busy: true});
		this.model.addExample(
			this.screenshot,
			() => this.capture(this.webcam.current.webcam.current.video),
			this.state.item,
			this.state.burstCount
		);
	}

	addFromFile = () => {
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

	train() {
		this.setState({busy: true});
		this.model.train(
			this.state.hiddenUnits,
			this.state.batchSize,
			this.state.learningRate,
			this.state.epochs
		);
	}

	predict() {
		if (this.webcam.current.webcam.current) {
			this.setState({busy: true});
			this.model.predict(
				this.capture(this.webcam.current.webcam.current.video)
			);
		} else {
			this.setStatus('Please connect a camera.');
		}
	}

	getName(item) {
		return item.name + (item.qualifier ? ` (${item.qualifier})` : '');
	}

	setStatus(status) {
		this.setState({status});
		if (status.indexOf('...') === -1) this.setState({busy: false});
	}

	render() {
		return (
			<div>
				<div className="col" style={{textAlign: 'center'}}>
					<span id="status-text">{this.state.status}</span>
					<br />
					<WebcamCapture
						setPrediction={() => {}}
						history={{push: () => {}}}
						ref={this.webcam}
					/>
					<br />
					<ItemSelector
						item={this.state.item}
						items={Object.values(this.model.items)}
						setItem={item => this.setState({item})}
						disabled={this.state.busy}
					/>
					<br />
					<label>Burst Count:</label>
					<input
						type="text"
						value={this.state.burstCount}
						size={3}
						maxLength={3}
						disabled={this.state.busy}
						onChange={e =>
							this.setState({burstCount: e.target.value})
						}
					/>
					<button
						onClick={() =>
							this.addExample(
								this.webcam.current.webcam.current.video
							)
						}
						disabled={
							this.state.busy ||
							!this.webcam.current.webcam.current
						}>
						Add From Camera
					</button>
					<br />
					<input
						type="file"
						multiple
						ref={this.files}
						disabled={this.state.busy}
					/>
					<button
						onClick={this.addFromFile}
						disabled={this.state.busy}>
						Add From File
					</button>
				</div>

				<div className="col">
					<label>
						Learning rate:<br />
						<input
							type="text"
							value={this.state.learningRate}
							onChange={e =>
								this.setState({learningRate: e.target.value})
							}
						/>
					</label>
					<br />
					<br />
					<label>
						Batch Size:<br />
						<input
							type="text"
							value={this.state.batchSize}
							onChange={e =>
								this.setState({batchSize: e.target.value})
							}
						/>
					</label>
					<br />
					<br />
					<label>
						Epochs:<br />
						<input
							type="text"
							value={this.state.epochs}
							onChange={e =>
								this.setState({epochs: e.target.value})
							}
						/>
					</label>
					<br />
					<br />
					<label>
						Hidden Units:<br />
						<input
							type="text"
							value={this.state.hiddenUnits}
							onChange={e =>
								this.setState({hiddenUnits: e.target.value})
							}
						/>
					</label>
					<br />
					<br />
					<button onClick={this.train} disabled={this.state.busy}>
						Train
					</button>
					<button onClick={this.predict} disabled={this.state.busy}>
						Predict
					</button>
					<br />
					<button
						onClick={this.model.loadModel}
						disabled={this.state.busy}>
						Load
					</button>
					<button
						onClick={this.model.saveModel}
						disabled={this.state.busy}>
						Save
					</button>
					<button
						onClick={this.model.exportModel}
						disabled={this.state.busy}>
						Export
					</button>
				</div>

				<div
					className="col"
					style={{maxHeight: 600, overflowY: 'scroll'}}>
					<table>
						<thead>
							<tr>
								<th>Item</th>
								<th>Count</th>
							</tr>
						</thead>
						<tbody>
							{Object.values(this.model.items).map(item => {
								return (
									<tr key={item.id}>
										<td>{this.getName(item)}</td>
										<td id={`${item.id}-count`}>
											{item.mlCount ? item.mlCount : 0}
										</td>
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
