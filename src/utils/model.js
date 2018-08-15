import * as tf from '@tensorflow/tfjs';
import {loadFrozenModel} from '@tensorflow/tfjs-converter';

const PREPROCESS_DIVISOR = tf.scalar(255 / 2);

export default class Model {
  async load() {
    this.model = await loadFrozenModel(
      '/model/tensorflowjs_model.pb',
      '/model/weights_manifest.json'
    );
    this.labels = await fetch('/model/labels.json');
  }

  dispose() {
    if (this.model) this.model.dispose();
  }

  async predict(element) {
    if (!this.model) return {value: 0, id: ''};
    const predictions = tf.tidy(() => {
      const input = tf.fromPixels(element);
      const preProcessedInput = tf.div(
        tf.sub(input.asType('float32'), PREPROCESS_DIVISOR),
        PREPROCESS_DIVISOR
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
      predictionList.push({value: values[i], id: this.labels[i]});
    }
    predictionList = predictionList.sort((a, b) => {
      return b.value - a.value;
    });

    return predictionList;
  }
}
