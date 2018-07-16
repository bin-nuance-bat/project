import * as tf from '@tensorflow/tfjs';
import {ControllerDataset} from './controller_dataset';
import getStore from '../../utils/honestyStore.js';
import * as MobileNet from '@tensorflow-models/mobilenet';

class Model {
	constructor(status) {
		this.setStatus = status;
		this.items = {unknown: {name: 'Unknown', id: 'unknown'}};

		this.getName = this.getName.bind(this);
		this.init = this.init.bind(this);
		this.loadStore = this.loadStore.bind(this);
		this.loadModel = this.loadModel.bind(this);
		this.saveModel = this.saveModel.bind(this);
		this.exportModel = this.exportModel.bind(this);
		this.addExample = this.addExample.bind(this);
		this.train = this.train.bind(this);
		this.predict = this.predict.bind(this);

		this.init();
	}

	getName(i) {
		let item = this.items[i];
		return item.name + (item.qualifier ? ` (${item.qualifier})` : '');
	}

	async init() {
		this.controllerDataset = new ControllerDataset(this.setStatus);
		this.mobilenet = await MobileNet.load();
		await this.loadStore();
		await this.loadData();
		this.setStatus('Done');
	}

	async loadStore() {
		if (
			!this.model ||
			window.confirm(
				'Loading the model will overwrite any training you have done. Continue?'
			)
		) {
			this.setStatus('Fetching store data...');
			Object.assign(this.items, await getStore());
		}
	}

	loadData = async () => {
		this.setStatus('Fetching training data...');
		this.items = await this.controllerDataset.setItemTrainingCounts(
			this.items
		);
	};

	loadModel() {
		if (
			!this.model ||
			window.confirm(
				'Loading the model will overwrite any training you have done. Continue?'
			)
		) {
			tf.loadModel('indexeddb://store-model')
				.then(model => {
					this.model = model;
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

	async addExample(getImg, getTensor, label, count) {
		let examples = [];
		for (let i = 1; i <= count; i++) {
			const tensor = await getTensor();
			examples.push({
				img: getImg(),
				label,
				activation: this.mobilenet.infer(tensor, 'conv_pw_13_relu')
			});

			document.getElementById(`${label}-count`).innerHTML++;
			this.items[label].mlCount++;
			this.setStatus(
				`Processing images of ${this.getName(label)} (${i}/${count})`
			);
			//await tf.nextFrame();
		}
		this.setStatus('Submitting images to database...');
		this.controllerDataset.addExamples(examples);
	}

	async train(hiddenUnits, batchSizeFraction, learningRate, epochs) {
		this.setStatus('Loading training data from DB...');

		this.controllerDataset.getTensors().then(async ({xs, ys}) => {
			if (!xs) {
				this.setStatus('Please collect some training images first!');
				return;
			}

			this.setStatus('Training model, please wait...');
			await tf.nextFrame();

			if (!this.model) {
				this.setStatus('Generating new model');
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
			}

			const optimizer = tf.train.adam(learningRate);
			this.model.compile({optimizer, loss: 'categoricalCrossentropy'});

			const batchSize = Math.floor(xs.shape[0] * batchSizeFraction);

			if (!(batchSize > 0)) {
				this.setStatus(
					'Batch size invalid, please choose a number 0 < x < 1'
				);
				return;
			}

			this.model.fit(xs, ys, {
				batchSize,
				epochs,
				callbacks: {
					onBatchEnd: async (batch, logs) => {
						this.setStatus(
							'Training. Loss: ' + logs.loss.toFixed(5)
						);
						await tf.nextFrame();
					},
					onTrainEnd: async () => {
						this.setStatus('Finished Training. Try me out!');
						await tf.nextFrame();
					}
				}
			});
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
		this.setStatus('I think this is a ' + this.getName[classId]);
	}
}

export default Model;
