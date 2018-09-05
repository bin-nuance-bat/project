import React from 'react';
import PropTypes from 'prop-types';

import './ImagePreview.css';

const ImagePreview = props => {
  return (
    <div className="preview-image" data-id={props.image.id}>
      <div>
        <img src={props.image.url} alt={props.image.id} />
      </div>
      <div>
        {!props.image.trusted && (
          <button onClick={props.approve}>Approve</button>
        )}
        <button onClick={props.remove}>Delete</button>
        <button onClick={props.trustUnknown}>Unknown</button>
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
