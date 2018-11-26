import React from 'react';
import './Revealer.css';

class Revealer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {diagonalWidth: 0};
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const diagonal = Math.sqrt(
      Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2)
    );
    this.setState({diagonalWidth: diagonal});
  };

  render() {
    const revealerStyle = {
      width: this.state.diagonalWidth,
      height: this.state.diagonalWidth,
      transform: `translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, 45deg) translate3d(0, ${
        this.state.diagonalWidth
      }px, 0)`
    };
    return (
      <div className="revealer" style={revealerStyle}>
        <div className="revealer-layer revealer-layer-1" />
        <div className="revealer-layer revealer-layer-2" />
      </div>
    );
  }
}

export default Revealer;
