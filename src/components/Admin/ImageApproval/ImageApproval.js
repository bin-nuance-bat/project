import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ItemSelector from '../ItemSelector';

import getStore from '../../../utils/honestyStore';
import {ControllerDataset} from '../ControllerDataset';

import './ImageApproval.css';

class ImageApproval extends Component {
  state = {
    loading: true,
    image: null,
    storeList: [{name: 'unknown', id: 'unknown'}]
  };

  nextImage = async () => {
    return this.controllerDataset
      .getUntrustedImage()
      .then(image => this.setState({image}));
  };

  trustImage = () => {
    this.controllerDataset
      .trustImage({id: this.state.image.id, item: this.state.image.label})
      .then(this.nextImage);
  };

  setAsUnknown = () => {
    this.controllerDataset
      .setLabel(this.state.image.id, 'unknown')
      .then(this.nextImage);
  };

  deleteImage = () => {
    this.controllerDataset
      .deleteImage({id: this.state.image.id, item: this.state.image.label})
      .then(this.nextImage);
  };

  changeCategory = newCategory => {
    this.controllerDataset.setLabel(this.state.image.id, newCategory).then(() =>
      this.setState(
        {
          showDropdown: false
        },
        this.nextImage
      )
    );
  };

  back = () => {
    this.props.history.replace('/admin');
  };

  componentDidMount() {
    getStore().then(storeList => {
      this.setState({
        storeList: Object.values({
          ...storeList,
          unknown: {name: 'unknown', id: 'unknown'}
        })
      });
      this.nextImage().then(() => this.setState({loading: false}));
    });
    this.controllerDataset = new ControllerDataset();
  }

  render() {
    if (this.state.loading) return <div>Loading...</div>;
    if (!this.state.image) return <div>No untrusted images available</div>;

    return (
      <div className="preview">
        <div>
          <button className="button button-admin" onClick={this.back}>
            &laquo; Back
          </button>
        </div>
        <img src={this.state.image.img} alt="" />
        <div>
          <button className="button button-admin" onClick={this.trustImage}>
            Trust
          </button>
          <button className="button button-admin" onClick={this.setAsUnknown}>
            Unknown
          </button>
          <button className="button button-admin" onClick={this.deleteImage}>
            Delete
          </button>
        </div>
        <div>Category</div>

        <ItemSelector
          item={this.state.image.label}
          items={this.state.storeList}
          setItem={cat => this.changeCategory(cat)}
        />
      </div>
    );
  }
}

ImageApproval.propTypes = {
  history: PropTypes.object.isRequired
};

export default ImageApproval;
