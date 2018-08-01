import React from 'react';
import PropTypes from 'prop-types';

import './ImagePreview.css';

const ImagePreview = props => {
  return (
    <div className="preview-image">
      <div>
        <img src={props.image.uri} alt={props.image.id} />
      </div>
      <div>
        {!props.image.trusted && (
          <button
            onClick={props.approve}
            data-id={props.image.id}
            data-item={props.image.item}>
            Approve
          </button>
        )}
        <button
          onClick={props.remove}
          data-id={props.image.id}
          data-item={props.image.item}>
          Delete
        </button>
        <button
          onClick={props.trustUnknown}
          data-id={props.image.id}
          data-item={props.image.item}>
          Unknown
        </button>
      </div>
    </div>
  );
};

ImagePreview.propTypes = {
  approve: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  trustUnknown: PropTypes.func.isRequired,
  image: PropTypes.object.isRequired
};

export default ImagePreview;
