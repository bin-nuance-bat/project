import React, {Component} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ItemSelector from './ItemSelector';
import ImagePreview from './ImagePreview';
import getStore from '../../utils/honestyStore.js';

export default class Viewer extends Component {
	items = {
		all: {name: 'All Items', id: 'all'},
		unknown: {name: 'Unknown Item', id: 'unknown'}
	};
	state = {
		item: 'all',
		images: []
	};

	componentDidMount() {
		firebase.initializeApp({
			apiKey: 'AIzaSyBVuVNKx-rx2ON0RxbfGfbGPpiymbMrxj8',
			authDomain: 'honesty-store-kiosk.firebaseapp.com',
			projectId: 'honesty-store-kiosk'
		});
		this.db = firebase.firestore();
		this.db.settings({timestampsInSnapshots: true});

		getStore().then(store => {
			Object.assign(this.items, store);
		});
	}

	getImages = () => {
		let ref = this.db.collection('training_data');
		if (this.state.item !== 'all')
			ref = ref.where('label', '==', this.state.item);
		ref.get().then(rows => {
			let images = [];
			rows.forEach(image => {
				const img = image.data();
				images.push({
					id: image.id,
					uri: img.img,
					trusted: img.trusted
				});
			});
			this.setState({images});
		});
	};

	remove = e => {
		this.db
			.collection('training_data')
			.doc(e.target.dataset.id)
			.delete()
			.then(() => {
				this.getImages();
			});
	};

	render() {
		return (
			<div>
				<ItemSelector
					item={this.state.item}
					items={Object.values(this.items)}
					setItem={item => this.setState({item})}
				/>
				<button onClick={this.getImages}>Show Images</button>
				<br />

				{this.state.images.map(image => (
					<ImagePreview image={image} remove={this.remove} />
				))}
			</div>
		);
	}
}
