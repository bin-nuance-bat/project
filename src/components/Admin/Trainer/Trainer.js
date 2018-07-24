import React, {Component} from 'react';
import Webcam from 'react-webcam';
import ItemSelector from '../ItemSelector';
import Model from './Model';
import * as tf from '@tensorflow/tfjs';
import '../Admin.css';
import Settings from './Settings';

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
		return tf.tidy(() => {
			return this.cropImage(tf.fromPixels(src))
				.expandDims(0)
				.toFloat()
				.div(tf.scalar(127))
				.sub(tf.scalar(1));
		});
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

	cropImage = img => {
		const size = Math.min(img.shape[0], img.shape[1]);
		const centerHeight = img.shape[0] / 2;
		const beginHeight = centerHeight - size / 2;
		const centerWidth = img.shape[1] / 2;
		const beginWidth = centerWidth - size / 2;

		return tf.image.resizeBilinear(
			img.slice([beginHeight, beginWidth, 0], [size, size, 3]),
			[224, 224]
		);
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
					<span id="status-text">{status}</span>
					<br />
					<div className="webcam-container">
						<Webcam
							audio={false}
							height={400}
							width={400}
							screenshotWidth={224}
							ref={this.webcam}
							screenshotFormat="image/jpeg"
						/>
					</div>
					<br />
					<ItemSelector
						item={item}
						items={Object.values(items)}
						setItem={item => this.setState({item})}
						disabled={busy}
					/>
					<br />
					<label>Burst Count:</label>
					<input
						type="number"
						value={burstCount}
						min={1}
						max={500}
						disabled={busy}
						onChange={e =>
							this.setState({burstCount: e.target.value})
						}
					/>
					<br />
					<button
						className="button button-admin"
						onClick={() =>
							this.addExample(this.webcam.current.video)
						}
						disabled={busy || !this.webcam.current}>
						Add From Camera
					</button>
					<br />
					<input
						type="file"
						multiple
						ref={this.files}
						disabled={busy}
					/>
					<br />
					<button
						className="button button-admin"
						onClick={this.addFromFile}
						disabled={busy}>
						Add From File
					</button>
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

				<div
					className="col"
					style={{maxHeight: 800, overflowY: 'scroll'}}>
					<table>
						<thead>
							<tr>
								<th>Item</th>
								<th>Count</th>
							</tr>
						</thead>
						<tbody>
							{Object.values(items).map(item => {
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
