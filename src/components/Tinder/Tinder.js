import React, {Component} from 'react';
import {ControllerDataset} from '../Admin/Trainer/ControllerDataset';

class Tinder extends Component {
  state = {
    image: null
  };

  nextImage = async () => {
    await this.setState({image: this.controllerDataset.getUntrustedImage()});
  };

  componentDidMount() {
    this.controllerDataset = new ControllerDataset();
    this.nextImage();
  }

  render() {
    console.log(this.state.image);
    return (
      <div>
        <img src={this.state.image} alt="" />
      </div>
    );
  }
}

export default Tinder;
