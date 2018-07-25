import React from 'react';
import './ImagePreview.css';

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

export default ImagePreview;
