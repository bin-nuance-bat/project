import React, {Component} from 'react';
// import './GetBoundingBox.css';
import PropTypes from 'prop-types';

class GetBBox extends Component {
  state = {};

  componentDidMount() {
    fetch(this.props.svg)
      .then(response => response.text())
      .then(svg => this.setState({svg}));
  }

  getBBox = svg =>
    [...svg.querySelectorAll('*')]
      .map(element => element.getBBox())
      .map(({x, y, width, height}) => ({
        left: x,
        top: y,
        bottom: y + height,
        right: x + width
      }))
      .reduce((union, element) => ({
        left: Math.min(element.left, union.left),
        top: Math.min(element.top, union.top),
        right: Math.max(element.right, union.right),
        bottom: Math.max(element.right, union.right)
      }));

  componentDidUpdate() {
    if (this.state.svg && !this.haveCalledCallback) {
      const bboxes = [...document.body.querySelectorAll('svg')]
        .map(this.getBBox)
        .map(bbox => {
          const width = bbox.right - bbox.left;
          const height = bbox.bottom - bbox.top;
          const aspectRatio = width / height;
          return {...bbox, width, height, aspectRatio};
        });

      this.props.callback(bboxes);
      this.haveCalledCallback = true;
    }
  }

  render() {
    return (
      <div
        style={{visibility: 'hidden', position: 'absolute'}}
        dangerouslySetInnerHTML={{__html: this.state.svg}}
      />
    );
  }
}

GetBBox.propTypes = {
  svg: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired
};

export default GetBBox;
