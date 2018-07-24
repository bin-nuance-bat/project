import * as tf from '@tensorflow/tfjs';
import initFirebase from '../../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

export class ControllerDataset {
  constructor(setReadyStatus, setBusyStatus) {
    this.setReadyStatus = setReadyStatus;
    this.setBusyStatus = setBusyStatus;

    initFirebase();
    this.store = firebase.storage();
    this.db = firebase.firestore();
    this.db.settings({timestampsInSnapshots: true});
  }

  async setItemTrainingCounts(itemObj) {
    const items = await this.db.collection('item_data').get();
    items.forEach(item => {
      const count = item.data().count;
      itemObj[item.id].mlCount = count ? count : 0;
    });
    return itemObj;
  }

  async addExamples(examples) {
    if (examples.length < 1) {
      this.setReadyStatus('Please provide at least one image.');
      return;
    }

    const item = await this.db
      .collection('item_data')
      .doc(examples[0].label)
      .get();

    this.db
      .collection('item_data')
      .doc(examples[0].label)
      .set({
        count: item.exists
          ? item.data().count + examples.length
          : examples.length
      });

    for (let i in examples) {
      this.db
        .collection('training_data')
        .add({
          img: examples[i].img,
          activation: examples[i].activation.dataSync().join(','),
          label: examples[i].label,
          random: Math.random(),
          timestamp: Date.now(),
          trusted: true
        })
        .then(() => {
          examples[i].activation.dispose();
          this.setBusyStatus(
            `Uploading images... (${parseInt(i, 10) + 1}/${examples.length})`
          );
          if (parseInt(i, 10) + 1 >= examples.length) {
            this.setReadyStatus('Done');
          }
        })
        .catch(err => {
          console.error(err);
          examples[i].activation.dispose();
        });
    }
  }

  async getClasses() {
    const items = await this.db.collection('item_data').get();
    let idList = [];
    items.forEach(doc => {
      if (doc.data().count > 0) idList.push(doc.id);
    });
    return idList;
  }

  async getBatch(batchSize, randomness, since) {
    return new Promise(async resolve => {
      let batch = {};

      while (Object.keys(batch).length < batchSize) {
        await this.db
          .collection('training_data')
          .orderBy('random')
          .orderBy('timestamp')
          .startAt(Math.random(), since)
          .limit(batchSize * randomness)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              batch[doc.id] = doc.data();
            });

            this.setBusyStatus(
              `Fetching data... (${Object.keys(batch).length}/${batchSize})`
            );
          });
      }

      resolve(Object.values(batch).splice(0, batchSize));
    });
  }

  async getTensors(setSize = 200, randomness = 0.1, since = 0) {
    const batch = await this.getBatch(setSize, randomness, since);
    let classes = await this.getClasses();
    let xs, ys;

    xs = tf.keep(tf.tensor4d(batch[0].activation.split(','), [1, 7, 7, 1024]));
    ys = tf.keep(
      tf.tidy(() =>
        tf.oneHot(
          tf.tensor1d([classes.indexOf(batch[0].label)]).toInt(),
          classes.length
        )
      )
    );

    for (let i = 1; i < batch.length; i++) {
      const y = tf.tidy(() =>
        tf.oneHot(
          tf.tensor1d([classes.indexOf(batch[i].label)]).toInt(),
          classes.length
        )
      );

      const oldX = xs;
      xs = tf.keep(
        oldX.concat(
          tf.tensor4d(batch[i].activation.split(','), [1, 7, 7, 1024]),
          0
        )
      );

      const oldY = ys;
      ys = tf.keep(oldY.concat(y, 0));
    }

    return {xs, ys, classes};
  }
}
