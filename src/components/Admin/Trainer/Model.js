import * as tf from '@tensorflow/tfjs';
import {ControllerDataset} from './ControllerDataset';
import getStore from '../../../utils/honestyStore.js';
import * as MobileNet from '@tensorflow-models/mobilenet';
import FirebaseStorageHandler from './FirebaseStorageHandler';

class Model {
  constructor(setReadyStatus, setBusyStatus) {
    this.items = {unknown: {name: 'Unknown', id: 'unknown'}};
    this.setReadyStatus = setReadyStatus;
    this.setBusyStatus = setBusyStatus;
    this.controllerDataset = new ControllerDataset();
  }

  getName(i) {
    const item = this.items[i];
    return item.name + (item.qualifier ? ` (${item.qualifier})` : '');
  }

  init() {
    this.setBusyStatus('Loading data...');
    return Promise.all([
      MobileNet.load().then(res => {
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
      tf.loadModel(
        new FirebaseStorageHandler(
          modelName,
          classes => (this.classes = classes)
        )
      )
        .then(model => {
          this.model = model;
          window.model = model;
          this.classes = JSON.parse(window.localStorage.getItem('items'));
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

  async addExample(getImg, getTensor, label, count) {
    const examples = [];
    for (let i = 1; i <= count; i++) {
      const tensor = await getTensor();
      examples.push({
        img: getImg(),
        label,
        activation: this.mobilenet.infer(tensor, 'conv_pw_13_relu')
      });

      document.getElementById(`${label}-count`).innerHTML++;
      this.items[label].mlCount++;
      this.setBusyStatus(
        `Processing images of ${this.getName(label)} (${i}/${count})`
      );
      await tf.nextFrame();
    }
    this.setBusyStatus('Submitting images to database. Please wait...');
    this.controllerDataset.addExamples(examples);
    this.setReadyStatus('Done');
  }

  async train(
    hiddenUnits,
    batchSizeFraction,
    learningRate,
    epochs,
    setSize,
    randomness,
    since
  ) {
    this.setBusyStatus('Loading training data from DB...');

    this.controllerDataset
      .getTensors(setSize, randomness, since)
      .then(async ({xs, ys, classes}) => {
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
              tf.layers.flatten({inputShape: [7, 7, 1024]}),
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
          callbacks: {
            onBatchEnd: async (batch, logs) => {
              this.setBusyStatus('Training... Loss: ' + logs.loss.toFixed(5));
              await tf.nextFrame();
            },
            onTrainEnd: async () => {
              this.setReadyStatus('Finished Training. Try me out!');
              await tf.nextFrame();
            }
          }
        });
      });
  }

  async predict(image) {
    if (!this.model) {
      this.setReadyStatus('Please train the model first');
      return;
    }
    this.setBusyStatus('Predicting...');
    const predictedClass = tf.tidy(() => {
      const activation = this.mobilenet.infer(image, 'conv_pw_13_relu');
      const predictions = this.model.predict(activation);
      return predictions.as1D().argMax();
    });

    const classId = (await predictedClass.data())[0];
    predictedClass.dispose();
    this.setReadyStatus(
      'I think this is a ' + this.getName(this.classes[classId])
    );
  }
}

export default Model;
