import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ItemSelector from '../ItemSelector';

import getStore from '../../../utils/honestyStore';
import {ControllerDataset} from '../ControllerDataset';

import './Approval.css';

class ImageApproval extends Component {
  state = {
    loading: true,
    images: [],
    storeList: [{name: 'unknown', id: 'unknown'}]
  };

  getImages = async () => {
    return this.controllerDataset
      .getUntrustedImages()
      .then(images => this.setState({images}));
  };

  lastImageTimestamp = () => {
    return this.state.images
      .map(image => image.timestamp)
      .sort()
      .pop();
  };

  nextImage = index => {
    const handler = image => {
      if (this.state.images.some(i => i.id === image.id)) {
        this.controllerDataset
          .getUntrustedImage(this.lastImageTimestamp())
          .then(handler);
      } else {
        this.setState(prevState => {
          prevState.images[index] = image;
          return prevState;
        });
      }
    };

    return this.controllerDataset
      .getUntrustedImage(this.lastImageTimestamp())
      .then(handler);
  };

  trustImage = event => {
    const index = event.target.dataset.index;
    this.controllerDataset
      .trustImage({
        id: event.target.dataset.id,
        item: event.target.dataset.label
      })
      .then(() => this.nextImage(index));
  };

  setAsUnknown = event => {
    const index = event.target.dataset.index;
    this.controllerDataset
      .trustImage({
        id: event.target.dataset.id,
        item: 'unknown'
      })
      .then(() => this.nextImage(index));
  };

  deleteImage = event => {
    const index = event.target.dataset.index;
    this.controllerDataset
      .deleteImage({
        id: event.target.dataset.id,
        item: event.target.dataset.label
      })
      .then(() => this.nextImage(index));
  };

  changeCategory = (id, newCategory) => {
    this.controllerDataset.setLabel(id, newCategory);
  };

  back = () => {
    this.props.history.replace('/admin');
  };

  componentDidMount() {
    getStore().then(storeList => {
      this.setState({
        storeList: Object.values({
          ...storeList
        })
      });
      this.getImages().then(() => this.setState({loading: false}));
    });
    this.controllerDataset = new ControllerDataset();
  }

  render() {
    if (this.state.loading) return <div>Loading...</div>;
    if (this.state.images === [])
      return <div>No untrusted images available</div>;

    return (
      <div className="preview">
        <div>
          <button className="button button-admin" onClick={this.back}>
            &laquo; Back
          </button>
        </div>
        {this.state.images.map((image, index) => {
          return (
            <div key={image.id} className="preview-pane">
              <img style={{maxHeight: 224}} src={image.img} alt="" />
              <ItemSelector
                item={image.label}
                items={this.state.storeList}
                setItem={cat => {
                  this.changeCategory(image.id, cat);
                  this.setState(prevState => {
                    prevState.images[index].label = cat;
                    return prevState;
                  });
                }}
              />
              <div>
                <button
                  className="button button-admin"
                  data-id={image.id}
                  data-index={index}
                  data-label={image.label}
                  onClick={this.trustImage}>
                  Trust
                </button>
                <button
                  className="button button-admin"
                  data-id={image.id}
                  data-index={index}
                  onClick={this.setAsUnknown}>
                  Unknown
                </button>
                <button
                  className="button button-admin"
                  data-id={image.id}
                  data-index={index}
                  data-label={image.label}
                  onClick={this.deleteImage}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

ImageApproval.propTypes = {
  history: PropTypes.object.isRequired
};

export default ImageApproval;
