import * as tf from '@tensorflow/tfjs';
import {loadFrozenModel} from '@tensorflow/tfjs-converter';
import LABELS from './labels';

const PREPROCESS_DIVISOR = tf.scalar(255 /2);

export default class Model {
    async load() {
        this.model = await loadFrozenModel('/model/web_model.pb', '/model/weights_manifest.json');
    }

    dispose() {
        if (this.model) this.model.dispose();
    }

    async predict(element) {
        const input = tf.fromPixels(element);
        const preProcessedInput = tf.div(
            tf.sub(input.asType('float32'), PREPROCESS_DIVISOR),
            PREPROCESS_DIVISOR
        )
        const reshapedInput = preProcessedInput.reshape([1, ...preProcessedInput.shape]);
        const logits = this.model.execute({Placeholder: reshapedInput}, 'final_result');

        const predictions = tf.tidy(() => {
            return tf.softmax(logits);
        });

        const values = predictions.dataSync();
        predictions.dispose();

        let predictionList = [];
        for (let i = 0; i < values.length; i++) {
            predictionList.push({value: values[i], index: i})
        }
        predictionList = predictionList.sort((a, b) => {
            return b.value - a.value;
        })

        return predictionList.map(p => {
            return {label: LABELS[p.index], value: p.value};
        });
    }
}

let model;

async function loadModel() {
    model = await loadFrozenModel('/model/web_model.pb', '/model/weights_manifest.json');
}

export async function execute(element) {
    console.log(element);
    await loadModel();
    return model.predict({input: tf.fromPixels(element)});
}