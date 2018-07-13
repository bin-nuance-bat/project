import React, {Component} from 'react';
import './ImagePreview.css';

export default class ImagePreview extends Component {
	render() {
		return (
			<div>
				<img src={this.props.image.uri} alt={this.props.image.id} />
				<br />
				<button
					onClick={this.props.remove}
					data-id={this.props.image.id}>
					Remove
				</button>
			</div>
		);
	}
}
