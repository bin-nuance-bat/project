import * as tf from '@tensorflow/tfjs';
import {loadFrozenModel} from '@tensorflow/tfjs-converter';
import labels from './labels';

let backendCtor = null;

export default class Model {
  async load() {
    global.tf = tf;
    tf.ENV.reset();
    const backend = tf.ENV.findBackend('webgl');
    if (backend != null) {
      backendCtor = backend.__proto__.constructor;
    } else {
      tf.ENV.registerBackend(
        'webgl',
        () => new backendCtor(),
        2
        // setTensorTracker
      );
      tf.Environment.setBackend('webgl');
    }

    this.model = await loadFrozenModel(
      '/model/web_model.pb',
      '/model/weights_manifest.json'
    );
  }

  dispose() {
    if (this.model) this.model.dispose();
    tf.ENV.removeBackend('webgl');
    tf.ENV.reset();
  }

  async predict(element) {
    if (!this.model) return [{value: 0, id: ''}];
    const predictions = tf.tidy(() => {
      const input = tf.fromPixels(element);
      const preProcessDivisor = tf.scalar(255 / 2);
      const preProcessedInput = tf.div(
        tf.sub(input.asType('float32'), preProcessDivisor),
        preProcessDivisor
      );

      const reshapedInput = preProcessedInput.reshape([
        1,
        ...preProcessedInput.shape
      ]);
      const logits = this.model.execute(
        {Placeholder: reshapedInput},
        'final_result'
      );

      return tf.softmax(logits);
    });

    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], id: labels[i]});
    }
    predictionList = predictionList.sort((a, b) => {
      return b.value - a.value;
    });

    return predictionList;
  }
}
