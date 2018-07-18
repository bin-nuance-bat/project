import React, {Component} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ItemSelector from '../ItemSelector';
import ImagePreview from './ImagePreview';
import getStore from '../../../utils/honestyStore.js';

export default class Viewer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			item: 'all',
			images: []
		};

		this.items = {
			all: {name: 'All Items', id: 'all'},
			unknown: {name: 'Unknown Item', id: 'unknown'}
		};
	}

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
			this.forceUpdate();
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

	remove = async event => {
		this.db
			.collection('training_data')
			.doc(event.target.dataset.id)
			.delete()
			.then(() => {
				this.getImages();
			});

		const item = await this.db
			.collection('item_data')
			.doc(event.target.dataset.item)
			.get();

		this.db
			.collection('item_data')
			.doc(event.target.dataset.item)
			.set({
				count: item.data().count - 1
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
					<ImagePreview
						key={image.id}
						image={image}
						remove={this.remove}
					/>
				))}
			</div>
		);
	}
}
