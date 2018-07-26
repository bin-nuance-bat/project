import React, {Component} from 'react';
import getStore from './../../utils/honestyStore';
import {ControllerDataset} from '../Admin/Trainer/ControllerDataset';

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
    this.controllerDataset.trustImage(this.state.image.id).then(this.nextImage);
  };

  setAsUnknown = () => {
    this.controllerDataset
      .setLabel(this.state.image.id, 'unknown')
      .then(this.nextImage);
  };

  changeCategory = event => {
    this.controllerDataset
      .setLabel(
        this.state.image.id,
        Object.values(this.storeList).find(
          item => item.name === event.target.value
        ).id
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
      <div>
        <img src={this.state.image.img} alt="" />
        <button onClick={this.trustImage}>Trust</button>
        <button onClick={this.setAsUnknown}>Unknown</button>
        <button>Delete</button>
        <br />
        Category
        <div>
          <select
            value={this.storeList[this.state.image.label].name}
            onChange={this.changeCategory}>
            {Object.values(this.storeList).map((item, index) => (
              <option key={index}>{item.name}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default Tinder;
