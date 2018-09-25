import React, {Component} from 'react';
import PropTypes from 'prop-types';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';

import DataController from '../utils/DataController';

import ItemSelector from '../ItemSelector';
import ImagePreview from './ImagePreview';

import './Viewer.css';

class Viewer extends Component {
  state = {
    item: 'all',
    images: [],
    limit: 100,
    since: '2018-08-01',
    view: true,
    status: 'Loading...',
    items: {
      all: {name: 'All Items', id: 'all'},
      unknown: {name: 'Unknown Item', id: 'unknown'}
    }
  };

  componentDidMount() {
    document.body.style.position = 'static';

    this.dataController = new DataController();
    window.datac = this.dataController;
    this.dataController.getStoreList().then(store => {
      this.setState(prevState => ({
        items: {
          ...prevState.items,
          ...store
        },
        status: 'Ready',
        busy: false
      }));
    });
  }

  componentWillUnmount() {
    document.body.style.position = 'fixed';
  }

  getImages = () => {
    this.setState({status: 'Fetching images...', busy: true});
    this.dataController
      .getImages(
        null,
        parseInt(this.state.limit, 10),
        Date.parse(this.state.since),
        this.state.item
      )
      .then(images =>
        this.setState({
          images,
          busy: false,
          status: `Got ${images.length} images.`
        })
      );
  };

  toggleView = () => this.setState({view: !this.state.view});

  download = () => {
    this.setState({
      status: `Downloading images... (0/${this.state.images.length})`,
      busy: true
    });

    const zip = new JSZip();

    const updateDownloadCount = () => {
      this.setState({
        status:
          'Downloading images... ' +
          `(${zip.files.length}/${this.state.images.length})`
      });
    };

    Promise.all(
      this.state.images.map(image =>
        urlToBase64(image.url)
          .then(data =>
            zip.file(`${image.label}/${image.id}.jpg`, data, {base64: true})
          )
          .then(updateDownloadCount)
      )
    ).then(() => {
      zip.generateAsync({type: 'blob'}).then(file => {
        saveAs(file, 'data.zip');
        this.setState({status: 'Done', busy: false});
      });
    });
  };

  remove = event => {
    const imageId = event.target.parentElement.parentElement.dataset.id;
    this.dataController.deleteImage(imageId).then(() => this.getImages());
  };

  trust = event => {
    const imageId = event.target.parentElement.parentElement.dataset.id;
    this.dataController.trustImage(imageId).then(() => this.getImages());
  };

  trustUnknown = event => {
    const imageId = event.target.parentElement.parentElement.dataset.id;
    this.dataController.changeImageLabel(imageId, 'unknown');
    this.dataController.trustImage(imageId).then(() => this.getImages());
  };

  back = () => {
    this.props.history.replace('/admin');
  };

  render() {
    return (
      <div className="page">
        <div>
          <button className="button button-admin" onClick={this.back}>
            &laquo; Back
          </button>
        </div>
        <ItemSelector
          item={this.state.item}
          items={Object.values(this.state.items)}
          setItem={item => this.setState({item})}
        />
        <div>
          Max Images:
          <input
            type="text"
            value={this.state.limit}
            onChange={e => this.setState({limit: e.target.value})}
          />
        </div>
        <div>
          Images Since:
          <input
            type="date"
            value={this.state.since}
            onChange={e => this.setState({since: e.target.value})}
          />
        </div>
        <button
          className="button button-admin"
          disabled={this.state.busy}
          onClick={this.getImages}>
          Fetch Images
        </button>
        <button
          className="button button-admin"
          disabled={this.state.busy}
          onClick={this.toggleView}>
          {this.state.view ? 'Hide' : 'Show'} Previews
        </button>
        <button
          className="button button-admin"
          disabled={this.state.busy}
          onClick={this.download}>
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

Viewer.propTypes = {
  history: PropTypes.object.isRequired
};

function urlToBase64(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(
        canvas
          .toDataURL('image/jpeg')
          .replace(/^data:image\/(png|jpeg);base64,/, '')
      );
    };
    img.crossOrigin = 'Anonymous';
    img.src = url;
  });
}

export default Viewer;
