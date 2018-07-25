import React from 'react';
import './ImagePreview.css';
import PropTypes from 'prop-types';

const ImagePreview = props => {
  return (
    <div className="preview-image">
      <div>
        <img src={props.image.uri} alt={props.image.id} />
      </div>
      <div>
        <button
          onClick={props.handleClick}
          data-id={props.image.id}
          data-item={props.image.item}>
          {props.image.trusted ? 'Remove' : 'Use for training'}
        </button>
      </div>
    </div>
  );
};

ImagePreview.propTypes = {
  handleClick: PropTypes.func.isRequired,
  image: PropTypes.object.isRequired
};

export default ImagePreview;
