import React, {Component} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

import getStore from '../../../utils/honestyStore';
import {ControllerDataset} from '../ControllerDataset';
import initFirebase from '../../../utils/firebase';
import JSZip from 'jszip';
import {saveAs} from 'file-saver/FileSaver';

import ItemSelector from '../ItemSelector';
import ImagePreview from './ImagePreview';

export default class Viewer extends Component {
  state = {
    item: 'all',
    images: [],
    view: false,
    status: 'Loading...',
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
        },
        status: 'Ready'
      }));
    });
  }

  getImages = () => {
    this.setState({status: 'Fetching images...'});
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

        this.setState({
          images,
          status: `Got ${images.length} images of ${
            this.state.items[this.state.item].name
          }`
        });

        const reff = await this.controllerDataset.getItemReference(
          this.state.item
        );
        this.controllerDataset.setItemCount(reff, images.length);
      });
  };

  downloadImages = () => {
    const zip = new JSZip();
    for (const img of this.state.images) {
      zip.file(
        img.id + '.jpg',
        img.uri.replace(/^data:image\/(png|jpeg);base64,/, ''),
        {
          base64: true
        }
      );
    }
    zip.generateAsync({type: 'blob'}).then(blob => {
      saveAs(blob, this.state.item + '.zip');
    });
  };

  toggleView = () => this.setState({view: !this.state.view});

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
        <button className="button button-admin" onClick={this.getImages}>
          Fetch Images
        </button>
        <button className="button button-admin" onClick={this.toggleView}>
          Toggle Previews
        </button>
        <button className="button button-admin" onClick={this.downloadImages}>
          Download Images
        </button>
        <br />

        <p>{this.state.status}</p>

        {this.state.view &&
          this.state.images.map(image => (
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
