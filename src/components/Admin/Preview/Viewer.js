import React, {Component} from 'react';
import 'firebase/firestore';
import ItemSelector from '../ItemSelector';
import ImagePreview from './ImagePreview';
import getStore from '../../../utils/honestyStore.js';
import {ControllerDataset} from './../Trainer/ControllerDataset';

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
    this.controllerDataset.getCollectionReference('training_data').then(ref => {
      if (this.state.item !== 'all')
        ref = ref.where('label', '==', this.state.item);
      ref.get().then(rows => {
        let images = [];
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
      });
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

  render() {
    return (
      <div>
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
            handleClick={image.trusted ? this.remove : this.trust}
          />
        ))}
      </div>
    );
  }
}
