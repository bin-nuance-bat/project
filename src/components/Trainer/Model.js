import * as tf from '@tensorflow/tfjs';
import {ControllerDataset} from './controller_dataset';
import getStore from '../../utils/honestyStore.js';
import * as MobileNet from '@tensorflow-models/mobilenet';

const BURST_COUNT = 10;

class Model {
	constructor(status) {
		this.setStatus = status;
		this.items = [{name: 'Unknown', mlCount: 0}];

		this.getName = this.getName.bind(this);
		this.init = this.init.bind(this);
		this.newModel = this.newModel.bind(this);
		this.loadModel = this.loadModel.bind(this);
		this.saveModel = this.saveModel.bind(this);
		this.exportModel = this.exportModel.bind(this);
		this.addExample = this.addExample.bind(this);
		this.train = this.train.bind(this);
		this.predict = this.predict.bind(this);
	}

	getName(i) {
		let item = this.items[i];
		return item.name + (item.qualifier ? ` (${item.qualifier})` : '');
	}

	async init() {
		this.controllerDataset = new ControllerDataset(this.items.length);
		this.mobilenet = await MobileNet.load();
		await tf.nextFrame();
		await tf.nextFrame();
		this.setStatus('Ready');
	}

	newModel() {
		if (
			!this.model ||
			window.confirm(
				'Loading the model will overwrite any training you have done. Continue?'
			)
		) {
			this.setStatus('Fetching store data...');
			getStore().then(store => {
				store = Object.values(store);
				let i = store.length;
				while (i--) {
					store[i].count < 1
						? store.splice(i, 1)
						: (store[i].mlCount = 0);
				}
				this.items = this.items.concat(store);
				this.init();
			});
		}
	}

	loadModel() {
		if (
			!this.model ||
			window.confirm(
				'Loading the model will overwrite any training you have done. Continue?'
			)
		) {
			tf.loadModel('indexeddb://store-model')
				.then(() => {
					this.items = JSON.parse(
						window.localStorage.getItem('items')
					);
					for (let item in this.items) {
						document.getElementById(
							item + '-count'
						).innerHTML = this.items[item].mlCount;
					}
					this.init();
				})
				.catch(() => {
					this.setStatus('No saved model found');
				});
		}
	}

	async saveModel() {
		if (!this.model) {
			this.setStatus('Please train a model to save.');
			return;
		}
		window.localStorage.setItem('items', JSON.stringify(this.items));
		return await this.model.save('indexeddb://store-model');
	}

	async exportModel() {
		if (!this.model) {
			this.setStatus('Please train a model to export.');
			return;
		}

		// Save model and download it
		this.saveModel();
		tf.io.copyModel('indexeddb://store-model', 'downloads://store-model');

		// Create JSON file with items in and download it
		const blob = new Blob([JSON.stringify(this.items)], {
			type: 'text/json'
		});
		const elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob);
		elem.download = 'items.json';
		document.body.appendChild(elem);
		elem.click();
		document.body.removeChild(elem);
	}

	async addExample(image, label) {
		if (!this.controllerDataset) {
			this.setStatus('Please load or create a model first');
			return;
		}

		for (let i = 1; i <= BURST_COUNT; i++) {
			tf.tidy(() => {
				this.controllerDataset.addExample(
					this.mobilenet.infer(image, 'conv_pw_13_relu'),
					label
				);
			});

			document.getElementById(`${label}-count`).innerHTML++;
			this.items[label].mlCount++;
			this.setStatus(
				`Adding images of ${this.getName(label)} (${i}/${BURST_COUNT})`
			);
			await tf.nextFrame();
		}
	}

	async train(hiddenUnits, batchSizeFraction, learningRate, epochs) {
		if (!this.controllerDataset || this.controllerDataset.xs === null) {
			this.setStatus('Please collect some training images first!');
			return;
		}

		this.setStatus('Training model, please wait...');
		await tf.nextFrame();

		this.model = tf.sequential({
			layers: [
				tf.layers.flatten({inputShape: [7, 7, 256]}),
				tf.layers.dense({
					units: hiddenUnits,
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

		const optimizer = tf.train.adam(learningRate);
		this.model.compile({optimizer, loss: 'categoricalCrossentropy'});

		const batchSize = Math.floor(
			this.controllerDataset.xs.shape[0] * batchSizeFraction
		);
		if (!(batchSize > 0)) {
			this.setStatus(
				'Batch size invalid, please choose a number 0 < x < 1'
			);
			return;
		}

		this.model.fit(this.controllerDataset.xs, this.controllerDataset.ys, {
			batchSize,
			epochs,
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

	async predict(image) {
		if (!this.model) {
			this.setStatus('Please train the model first');
			return;
		}
		this.setStatus('Predicting...');
		const predictedClass = tf.tidy(() => {
			const activation = this.mobilenet.predict(image);
			const predictions = this.model.predict(activation);
			return predictions.as1D().argMax();
		});

		const classId = (await predictedClass.data())[0];
		predictedClass.dispose();
		console.log(classId);
		this.setStatus('I think this is a ' + this.getName[classId]);
	}
}

export default Model;
