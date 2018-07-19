import React from 'react';
import './ImagePreview.css';

const ImagePreview = props => {
	return (
		<div>
			<img src={props.image.uri} alt={props.image.id} />
			<br />
			<button
				onClick={props.handleClick}
				data-id={props.image.id}
				data-item={props.image.item}>
				{props.image.trusted ? 'Remove' : 'Use for training'}
			</button>
		</div>
	);
};

export default ImagePreview;
