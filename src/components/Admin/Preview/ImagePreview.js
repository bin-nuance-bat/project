import React from 'react';
import './ImagePreview.css';

const ImagePreview = props => {
	return (
		<div>
			<img src={props.image.uri} alt={props.image.id} />
			<br />
			<button onClick={props.remove} data-id={props.image.id}>
				Remove
			</button>
		</div>
	);
};

export default ImagePreview;
