import React, {Component} from 'react';
import getStore from './../../utils/honestyStore';
import {ControllerDataset} from '../Admin/Trainer/ControllerDataset';
import './Tinder.css';

class Tinder extends Component {
  state = {
    loading: true,
    image: null
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

  changeCategory = event => {
    this.controllerDataset
      .setLabel(
        this.state.image.id,
        Object.keys(this.storeList).find(
          key => this.storeList[key].name === event.target.value
        )
      )
      .then(() =>
        this.setState(
          {
            showDropdown: false
          },
          this.nextImage
        )
      );
  };

  componentDidMount() {
    getStore()
      .then(storeList => {
        storeList['unknown'] = {name: 'unknown'};
        this.storeList = storeList;
      })
      .then(() => {
        this.nextImage().then(() => this.setState({loading: false}));
      });
    this.controllerDataset = new ControllerDataset();
  }

  render() {
    if (this.state.loading) return <div>Loading...</div>;
    if (!this.state.image) return <div>No untrusted images available</div>;

    return (
      <div className="preview">
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
        <div>
          <select
            value={this.storeList[this.state.image.label].name}
            onChange={this.changeCategory}>
            {Object.values(this.storeList)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((item, index) => <option key={index}>{item.name}</option>)}
          </select>
        </div>
      </div>
    );
  }
}

export default Tinder;
