import React, {Component} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

import getStore from '../../../utils/honestyStore';
import {ControllerDataset} from '../ControllerDataset';
import initFirebase from '../../../utils/firebase';

import ItemSelector from '../ItemSelector';
import ImagePreview from './ImagePreview';

export default class Viewer extends Component {
  state = {
    item: 'all',
    images: [],
    items: {
      all: {name: 'All Items', id: 'all'},
      unknown: {name: 'Unknown Item', id: 'unknown'}
    }
  };

  componentDidMount() {
    this.controllerDataset = new ControllerDataset();
    initFirebase();
    this.db = firebase.firestore();

    getStore().then(store => {
      this.setState(prevState => ({
        items: {
          ...prevState.items,
          ...store
        }
      }));
    });
  }

  getImages = () => {
    let ref = this.db.collection('training_data');
    if (this.state.item !== 'all')
      ref = ref.where('label', '==', this.state.item);
    ref
      .orderBy('timestamp')
      .get()
      .then(async rows => {
        const images = [];
        rows.forEach(row => {
          const img = row.data();
          images.push({
            id: row.id,
            uri: img.img,
            item: img.label,
            trusted: img.trusted
          });
        });
        this.setState({images});
        const reff = await this.controllerDataset.getItemReference(
          this.state.item
        );
        this.controllerDataset.setItemCount(reff, images.length);
      });
  };

  remove = event => {
    this.controllerDataset
      .deleteImage(event.target.dataset)
      .then(() => this.getImages());
  };

  trust = event => {
    this.controllerDataset
      .trustImage(event.target.dataset)
      .then(() => this.getImages());
  };

  trustUnknown = event => {
    this.controllerDataset
      .setLabel(event.target.dataset.id, 'unknown')
      .then(() => this.getImages());
    this.controllerDataset
      .trustImage(event.target.dataset)
      .then(() => this.getImages());
  };

  render() {
    return (
      <div className="page">
        <ItemSelector
          item={this.state.item}
          items={Object.values(this.state.items)}
          setItem={item => this.setState({item})}
        />
        <button onClick={this.getImages}>Show Images</button>
        <br />

        {this.state.images.map(image => (
          <ImagePreview
            key={image.id}
            image={image}
            approve={this.trust}
            remove={this.remove}
            trustUnknown={this.trustUnknown}
          />
        ))}
      </div>
    );
  }
}
