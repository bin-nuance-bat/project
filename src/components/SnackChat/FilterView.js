import React, {Component} from 'react';
import {Container, Sprite} from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

class FilterView extends Component {
  state = {
    rotation: 0
  };

  componentDidMount() {
    this.props.app.ticker.add(this.tick);
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.tick);
  }

  tick = delta => {
    this.setState(({rotation}) => ({rotation: rotation + 0.1 * delta}));
  };

  render() {
    return (
      <Container>
        <Sprite
          image={this.props.image}
          x={200}
          y={200}
          rotation={this.state.rotation}
        />
      </Container>
    );
  }
}

export default FilterView;
