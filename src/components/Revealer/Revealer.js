import React from 'react';
import PropTypes from 'prop-types';
import './Revealer.css';

const REVEAL_ANIMATION_SECONDS = 1.5;

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

  handleAnimationStart = () => {
    setTimeout(() => {
      this.props.onPageObscured();
    }, (REVEAL_ANIMATION_SECONDS / 2) * 1000);
  };

  render() {
    const containerStyle = {
      width: this.state.diagonalWidth,
      height: this.state.diagonalWidth,
      transform: `translate(-50%, -50%) rotate(45deg) translate(0, ${
        this.state.diagonalWidth
      }px)`
    };
    const animateClass =
      this.props.reveal && this.props.reveal.length > 0
        ? `revealer-animate-${this.props.reveal}`
        : '';
    return (
      <div className="revealer-container" style={containerStyle}>
        <div
          className={`revealer ${animateClass}`}
          onAnimationStart={this.handleAnimationStart}
          onAnimationEnd={this.props.onPageRevealed}>
          <div className="revealer-layer" />
          <div className="revealer-layer" />
        </div>
      </div>
    );
  }
}

Revealer.propTypes = {
  reveal: PropTypes.string.isRequired,
  onPageObscured: PropTypes.func,
  onPageRevealed: PropTypes.func
};

export default Revealer;
