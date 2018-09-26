import React, {Component} from 'react';
import PropTypes from 'prop-types';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';

import DataController from '../utils/DataController';
import Scrollable from '../Scrollable';

import ItemSelector from '../ItemSelector';
import ImagePreview from './ImagePreview';
import productName from '../../../utils/productName';

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
    },
    trustFilter: () => true
  };

  componentDidMount() {
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

  getId = event => event.target.parentElement.parentElement.dataset.id;

  remove = event => {
    const imageId = this.getId(event);
    this.dataController.deleteImage(imageId).then(() => this.getImages());
  };

  trust = event => {
    const imageId = this.getId(event);
    this.dataController.trustImage(imageId).then(() => this.getImages());
  };

  untrust = event => {
    const imageId = this.getId(event);
    this.dataController.trustImage(imageId, false).then(() => this.getImages());
  };

  trustUnknown = event => {
    const imageId = this.getId(event);
    this.dataController.changeImageLabel(imageId, 'unknown');
    this.dataController.trustImage(imageId).then(() => this.getImages());
  };

  back = () => {
    this.props.history.replace('/admin');
  };

  render() {
    const {item, items, limit, since, busy, view, status, images} = this.state;

    return (
      <Scrollable>
        <div className="page">
          <div>
            <button className="button button-admin" onClick={this.back}>
              &laquo; Back
            </button>
          </div>
          <ItemSelector
            item={item}
            items={Object.values(items)}
            setItem={i => this.setState({item: i})}
          />
          <div>
            Max Images:
            <input
              type="text"
              value={limit}
              onChange={e => this.setState({limit: e.target.value})}
            />
          </div>
          <div>
            Images Since:
            <input
              type="date"
              value={since}
              onChange={e => this.setState({since: e.target.value})}
            />
          </div>
          <button
            className="button button-admin"
            disabled={busy}
            onClick={this.getImages}>
            Fetch Images
          </button>
          <button
            className="button button-admin"
            disabled={busy}
            onClick={this.toggleView}>
            {view ? 'Hide' : 'Show'} Previews
          </button>
          <button
            className="button button-admin"
            disabled={busy}
            onClick={this.download}>
            Download Images
          </button>
          <br />

          <p>{status}</p>
          <div>
            <select
              onChange={e => {
                const {value} = e.target;
                const func =
                  value === 'TRUSTED'
                    ? image => image.trusted
                    : value === 'UNTRUSTED'
                      ? image => !image.trusted
                      : image => image;
                this.setState({trustFilter: func});
              }}>
              <option key={'all'} value={'ALL'}>
                All
              </option>
              <option key={'trusted'} value={'TRUSTED'}>
                Trusted
              </option>
              <option key={'untrusted'} value={'UNTRUSTED'}>
                Untrusted
              </option>
            </select>
          </div>
          {view &&
            images.filter(this.state.trustFilter).map(image => {
              const product = items[image.label];

              return (
                <ImagePreview
                  key={image.id}
                  image={image}
                  approve={this.trust}
                  disapprove={this.untrust}
                  remove={this.remove}
                  trustUnknown={this.trustUnknown}
                  product={productName(product)}
                />
              );
            })}
        </div>
      </Scrollable>
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
