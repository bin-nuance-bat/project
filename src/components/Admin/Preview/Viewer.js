import React, {Component} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ItemSelector from '../ItemSelector';
import ImagePreview from './ImagePreview';
import getStore from '../../../utils/honestyStore.js';
import {ControllerDataset} from './../Trainer/ControllerDataset';

export default class Viewer extends Component {
	state = {
		item: 'all',
		images: [],
		items: {
			all: {name: 'All Items', id: 'all'},
			unknown: {name: 'Unknown Item', id: 'unknown'}
		}
	};

	componentDidMount() {
		this.controllerDataset = new ControllerDataset();

		getStore().then(store => {
			this.setState(prevState => ({
				items: {
					...prevState.items,
					...store
				}
			}));
		});
	}

	getImages = () => {
		let ref = this.db.collection('training_data');
		if (this.state.item !== 'all')
			ref = ref.where('label', '==', this.state.item);
		ref.get().then(rows => {
			let images = [];
			rows.forEach(row => {
				const img = row.data();
				images.push({
					id: row.id,
					uri: img.img,
					item: img.label,
					trusted: img.trusted
				});
			});
			this.setState({images});
		});
	};

	changeItemCount = (label, delta) => {
		const item = this.controllerDataset.getItemReference(label);
		this.controllerDataset.setItemCount(
			item,
			this.controllerDataset.getItemCount(item) + delta
		);
	};

	remove = event => {
		this.controllerDataset
			.deleteImage(event.target.dataset.id)
			.then(() => this.getImages());

		this.changeItemCount(event.target.dataset.item, -1);
	};

	trust = event => {
		this.controllerDataset
			.trustImage(event.target.dataset.id)
			.then(() => this.getImages());

		this.changeItemCount(event.target.dataset.item, 1);
	};

	render() {
		return (
			<div>
				<ItemSelector
					item={this.state.item}
					items={Object.values(this.state.items)}
					setItem={item => this.setState({item})}
				/>
				<button onClick={this.getImages}>Show Images</button>
				<br />

				{this.state.images.map(image => (
					<ImagePreview
						key={image.id}
						image={image}
						handleClick={image.trusted ? this.remove : this.trust}
					/>
				))}
			</div>
		);
	}
}
