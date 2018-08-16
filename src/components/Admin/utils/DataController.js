import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import getStore from '../../../utils/honestyStore';

class DataController {
  constructor() {
    this.storage = firebase.storage().ref();
    this.db = firebase.firestore();
  }

  async getItemClasses() {
    const items = await this.db.collection('item_data').get();
    const classes = [];
    items.forEach(doc => {
      if (doc.data().count > 0) classes.push(doc.id);
    });
    return classes;
  }

  changeItemCount(label, change) {
    const ref = this.db.collection('item_data').doc(label);
    return ref
      .get()
      .then(doc =>
        ref.set({count: (doc.exists ? doc.data().count : 0) + change})
      );
  }

  addImage(imageUri, label) {
    return Promise.all([
      this.db
        .collection('training_data')
        .add({
          label,
          random: Math.random(),
          timestamp: Date.now(),
          trusted: false
        })
        .then(doc =>
          this.storage
            .child(`training_data/${label}/${doc.id}.jpg`)
            .putString(imageUri, 'data_url')
        ),
      this.changeItemCount(label, 1)
    ]);
  }

  trustImage(imageId) {
    return this.db
      .collection('training_data')
      .doc(imageId)
      .update({trusted: true});
  }

  changeImageLabel(imageId, newLabel) {
    const ref = this.db.collection('training_data').doc(imageId);
    return ref.get().then(doc => {
      this.changeItemCount(doc.data().label, -1);
      this.changeItemCount(newLabel, 1);
      return ref.update({label: newLabel});
    });
  }

  deleteImage(imageId) {
    const ref = this.db.collection('training_data').doc(imageId);
    return ref.get().then(doc => {
      this.storage
        .child(`training_data/${doc.data().label}/${doc.id}.jpg`)
        .delete();
      this.changeItemCount(doc.data().label, -1);
      return ref.delete();
    });
  }

  async getImages(
    trusted = null,
    maxImages = 1,
    startAfter = 0,
    label = 'all'
  ) {
    const images = [];
    let ref = this.db.collection('training_data');
    if (trusted !== null) ref = ref.where('trusted', '==', trusted);
    if (label !== 'all') ref = ref.where('label', '==', label);

    await ref
      .orderBy('timestamp')
      .startAfter(startAfter)
      .limit(maxImages)
      .get()
      .then(async snapshot => {
        snapshot.forEach(async doc => {
          images.push({
            id: doc.id,
            label: doc.data().label,
            trusted: doc.data().trusted,
            url: await this.storage
              .child(`training_data/${doc.data().label}/${doc.id}.jpg`)
              .getDownloadURL()
          });
        });
      });
    return images;
  }

  async getStoreList() {
    if (this.storeList) return this.storeList;
    this.storeList = await getStore();
    return this.storeList;
  }
}

export default DataController;
