import * as tf from '@tensorflow/tfjs';
import firebase from 'firebase/app';
import initFirebase from './firebase';
import * as MobileNet from '@tensorflow-models/mobilenet';
import FirebaseStorageHandler from '../components/Admin/Trainer/FirebaseStorageHandler';

//const PREPROCESS_DIVISOR = tf.scalar(255 / 2);

export default class Model {
  async load() {
    MobileNet.load().then(res => {
      this.mobilenet = res;
    });

    initFirebase();

    firebase
      .firestore()
      .collection('models')
      .where('deployed', '==', true)
      .get()
      .then(async snapshot => {
        const modelName = snapshot.docs[0].id;
        this.model = await tf.loadModel(
          new FirebaseStorageHandler(
            modelName,
            classes => (this.classes = classes)
          )
        );
      });
  }

  dispose() {
    if (this.model) this.model.dispose();
  }

  async predict(element) {
    if (!this.model || !this.mobilenet) return {value: 0, id: 'unknown'};

    const predictions = tf.tidy(() => {
      const activation = this.mobilenet.infer(element, 'conv_pw_13_relu');
      return tf.softmax(this.model.predict(activation));
    });

    const values = predictions.dataSync();
    predictions.dispose();

    let predictionList = [];
    for (let i = 0; i < values.length; i++) {
      predictionList.push({value: values[i], id: this.classes[i]});
    }
    predictionList = predictionList.sort((a, b) => {
      return b.value - a.value;
    });

    return predictionList[0];
  }
}
