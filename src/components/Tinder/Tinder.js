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

  componentDidMount() {
    getStore()
      .then(storeList => (this.storeList = storeList))
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
        Guess: {this.storeList[this.state.image.label].name}
      </div>
    );
  }
}

export default Tinder;
