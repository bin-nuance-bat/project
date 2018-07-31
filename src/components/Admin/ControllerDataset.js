import * as tf from '@tensorflow/tfjs';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

import initFirebase from '../../utils/firebase';

const VALIDATION_PERCENTAGE = 0.2;
const VALIDATION_COUNT = 3;

export class ControllerDataset {
  constructor() {
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

  getItemReference = async label => {
    return await this.db.collection('item_data').doc(label);
  };

  getItemCount = async itemReference => {
    return await itemReference
      .get()
      .then(snapshot => snapshot.data().count)
      .catch(() => 0);
  };

  setItemCount = async (itemReference, count) => {
    await itemReference.set({
      count
    });
  };

  changeItemCount = (label, delta) => {
    this.getItemReference(label).then(item =>
      this.getItemCount(item).then(count =>
        this.setItemCount(item, count + delta)
      )
    );
  };

  deleteImage = async dataset => {
    await this.db
      .collection('training_data')
      .doc(dataset.id)
      .delete();

    await this.changeItemCount(dataset.item, -1);
  };

  trustImage = async dataset => {
    await this.db
      .collection('training_data')
      .doc(dataset.id)
      .update({trusted: true});

    await this.changeItemCount(dataset.item, 1);
  };

  setLabel = async (id, label) => {
    await this.db
      .collection('training_data')
      .doc(id)
      .update({
        label
      });
  };

  addImage = (image, trusted, callback = null) => {
    this.db
      .collection('training_data')
      .add({
        img: image.img,
        activation: image.activation.dataSync().join(','),
        label: image.label,
        random: Math.random(),
        timestamp: Date.now(),
        trusted
      })
      .then(() => {
        if (callback) callback();
        image.activation.dispose();
      })
      .catch(() => {
        image.activation.dispose();
      });
  };

  async addExamples(examples, callback) {
    if (examples.length < 1) {
      return;
    }

    this.changeItemCount(examples[0].label, examples.length);
    let count = 1;

    examples.forEach(image => {
      this.addImage(image, true, () => {
        callback(count / examples.length);
        count++;
      });
    });
  }

  async getClasses() {
    const items = await this.db.collection('item_data').get();
    const idList = [];
    items.forEach(doc => {
      if (doc.data().count > 0) idList.push(doc.id);
    });
    return idList;
  }

  async fetchData(count, type, onlyLabel) {
    let ref = this.db
      .collection('training_data')
      .where('trusted', '==', true)
      .orderBy('random');
    if (onlyLabel) ref = ref.where('label', '==', onlyLabel);

    let random = Math.random();
    random *=
      type === 'validation' ? VALIDATION_PERCENTAGE : 1 - VALIDATION_PERCENTAGE;
    random += type === 'validation' ? 0 : VALIDATION_PERCENTAGE;

    const data = {};
    const snapshot = await ref
      .startAt(random)
      .limit(count)
      .get();
    snapshot.forEach(doc => {
      const {activation, label} = doc.data();
      data[doc.id] = {activation, label};
    });

    const dataCount = Object.keys(data).length;
    if (dataCount >= count) {
      return data;
    } else {
      return {
        ...data,
        ...(await this.fetchData(count - dataCount, type, onlyLabel))
      };
    }
  }

  async getTensors(
    setSize = 200,
    randomness = 1,
    dataType = 'training',
    completion
  ) {
    let batch = {};
    const classes = await this.getClasses();

    if (dataType === 'validation') {
      for (const c in classes) {
        batch = {
          ...batch,
          ...(await this.fetchData(VALIDATION_COUNT, dataType, classes[c]))
        };
        completion((c + 1) / classes.length);
      }
    } else {
      while (Object.keys(batch).length < setSize) {
        const batchSize = Object.keys(batch).length;
        batch = {
          ...batch,
          ...(await this.fetchData(
            Math.min(Math.floor(setSize / randomness), setSize - batchSize),
            dataType
          ))
        };
        completion(batchSize / setSize);
      }
    }

    let xs, ys;
    batch = Object.values(batch);

    return tf.tidy(() => {
      xs = tf.keep(tf.tensor4d(batch[0].activation.split(','), [1, 7, 7, 256]));
      ys = tf.keep(
        tf.oneHot(
          tf.tensor1d([classes.indexOf(batch[0].label)]).toInt(),
          classes.length
        )
      );

      const initLen = batch.length;
      while (batch.length > 0) {
        // TODO: remove this, needed while we debug training process
        // eslint-disable-next-line no-console
        console.log(`Converting tensor ${initLen - batch.length}/${initLen}`);
        const data = batch.pop();
        const y = tf.oneHot(
          tf.tensor1d([classes.indexOf(data.label)]).toInt(),
          classes.length
        );

        const oldX = xs;
        xs = tf.keep(
          oldX.concat(
            tf.tensor4d(data.activation.split(','), [1, 7, 7, 256]),
            0
          )
        );

        const oldY = ys;
        ys = tf.keep(oldY.concat(y, 0));

        oldX.dispose();
        oldY.dispose();
        y.dispose();
      }

      return {xs, ys, classes};
    });
  }

  async getUntrustedImage() {
    return await this.db
      .collection('training_data')
      .where('trusted', '==', false)
      .limit(1)
      .get()
      .then(snapshot => ({
        ...snapshot.docs[0].data(),
        id: snapshot.docs[0].id
      }))
      .catch(() => null);
  }
}
