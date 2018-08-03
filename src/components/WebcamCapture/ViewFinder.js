import React, {Component} from 'react';
import ViewFinderSVG from './ViewFinderSVG';

class ViewFinder extends Component {
  state = {animation: 0};

  success = callback => {
    this.callback = callback;
    this.update();
  };

  update = () => {
    if (this.state.animation >= 1) return this.callback();
    this.setState(prevState => {
      return {animation: prevState.animation + 0.05};
    });
    requestAnimationFrame(this.update);
  };

  render() {
    return <ViewFinderSVG animation={this.state.animation} />;
  }
}

export default ViewFinder;
