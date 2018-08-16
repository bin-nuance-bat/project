import * as tf from '@tensorflow/tfjs';
import * as MobileNet from '@tensorflow-models/mobilenet';

import FirebaseStorageHandler from './FirebaseStorageHandler';
import {ControllerDataset} from './ControllerDataset';
import getStore from '../../../utils/honestyStore.js';

class Model {
  constructor(setReadyStatus, setBusyStatus, setCompletion) {
    this.items = {unknown: {name: 'Unknown', id: 'unknown'}};
    this.setReadyStatus = setReadyStatus;
    this.setBusyStatus = setBusyStatus;
    this.setCompletion = setCompletion;
    this.controllerDataset = new ControllerDataset();
  }

  getName(i) {
    const item = this.items[i];
    return item.name + (item.qualifier ? ` (${item.qualifier})` : '');
  }

  init() {
    this.setBusyStatus('Loading data...');
    return Promise.all([
      MobileNet.load(1, 0.25).then(res => {
        this.mobilenet = res;
      }),
      this.loadStore()
    ])
      .then(this.loadTrainingData)
      .then(() => this.setReadyStatus('Done'));
  }

  loadStore = async () => {
    if (
      !this.model ||
      window.confirm(
        'Loading the model will overwrite any training you have done. Continue?'
      )
    ) {
      Object.assign(this.items, await getStore());
    }
  };

  loadTrainingData = async () => {
    this.items = await this.controllerDataset.setItemTrainingCounts(this.items);
  };

  loadModel = modelName => {
    if (
      !this.model ||
      window.confirm(
        'Loading the model will overwrite any training you have done. Continue?'
      )
    ) {
      this.setBusyStatus('Loading model...');
      tf.loadModel(
        new FirebaseStorageHandler(
          modelName,
          classes => (this.classes = classes)
        )
      )
        .then(model => {
          this.model = model;
          this.setReadyStatus('Loaded model!');
        })
        .catch(() => {
          this.setReadyStatus('No saved model found');
        });
    }
  };

  saveModel = async modelName => {
    if (!this.model) {
      this.setReadyStatus('Please train a model to save.');
      return;
    }
    this.setBusyStatus('Saving...');
    this.model
      .save(new FirebaseStorageHandler(modelName, this.classes))
      .then(() => this.setReadyStatus('Saved model!'))
      .catch(err => this.setReadyStatus(err));
  };

  async addExample(getImg, getTensor, label, count, trusted = true) {
    const examples = [];
    for (let i = 1; i <= count; i++) {
      const tensor = await getTensor();
      examples.push({
        img: getImg(),
        label,
        activation: this.mobilenet.infer(tensor, 'conv_pw_13_relu')
      });

      this.setBusyStatus(
        `Processing images... (${((i / count) * 100).toFixed(0)}%)`
      );
      this.setCompletion(i / count);
      await tf.nextFrame();
    }

    this.setBusyStatus('Uploading images... (0%)');
    this.controllerDataset.addExamples(
      examples,
      completion => {
        this.setCompletion(completion);
        this.items[label].mlCount++;
        if (completion === 1) {
          this.setReadyStatus('Done');
          return;
        }
        this.setBusyStatus(
          `Uploading images... (${(completion * 100).toFixed(0)}%)`
        );
      },
      trusted
    );
  }

  async train(
    hiddenUnits,
    batchSizeFraction,
    learningRate,
    epochs,
    setSize,
    randomness
  ) {
    this.setBusyStatus('Loading training data from DB...');
    const {xs, ys, classes} = await this.controllerDataset.getTensors(
      setSize,
      randomness,
      'training',
      this.setCompletion
    );

    this.setBusyStatus('Loading validation data from DB...');
    const validation = await this.controllerDataset.getTensors(
      setSize,
      randomness,
      'validation',
      this.setCompletion
    );

    if (!xs) {
      this.setReadyStatus('Please collect some training images first!');
      return;
    }

    const batchSize = Math.floor(xs.shape[0] * batchSizeFraction);

    if (!(batchSize > 0)) {
      this.setReadyStatus(
        'Batch size invalid, please choose a number 0 < x < 1'
      );
      return;
    }

    this.classes = classes;

    this.setBusyStatus('Training model, please wait...');
    await tf.nextFrame();

    if (!this.model) {
      this.setBusyStatus('Generating new model...');

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
            units: classes.length,
            kernelInitializer: 'varianceScaling',
            useBias: false,
            activation: 'softmax'
          })
        ]
      });
    }

    const optimizer = tf.train.adam(learningRate);
    this.model.compile({
      optimizer,
      loss: 'categoricalCrossentropy'
    });

    this.model.fit(xs, ys, {
      batchSize,
      epochs,
      validationData: [validation.xs, validation.ys],
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          this.setCompletion(++epoch / epochs);
          this.setBusyStatus(`Training... Loss: ${logs.val_loss.toFixed(5)}`);
          await tf.nextFrame();
        },
        onTrainEnd: async () => {
          this.setReadyStatus('Finished Training. Try me out!');
          xs.dispose();
          ys.dispose();
          await tf.nextFrame();
        }
      }
    });
  }

  async predict(image) {
    if (!this.model) {
      this.setReadyStatus('Please train the model first');
      return;
    }
    this.setBusyStatus('Predicting...');
    const predictions = tf.tidy(() => {
      const activation = this.mobilenet.infer(image, 'conv_pw_13_relu');
      return tf.softmax(this.model.predict(activation));
    });

    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], id: this.classes[i]});
    }
    predictionList = predictionList.sort((a, b) => b.value - a.value);

    for (const p of predictionList) {
      document.getElementById(p.id + '-count').innerHTML =
        (p.value * 100).toFixed(2) + '%';
    }

    this.setReadyStatus(this.getName(predictionList[0].id));
  }
}

export default Model;
