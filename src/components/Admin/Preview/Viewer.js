import React, {Component} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ItemSelector from '../ItemSelector';
import ImagePreview from './ImagePreview';
import getStore from '../../../utils/honestyStore.js';

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
		firebase.initializeApp({
			apiKey: 'AIzaSyCil4dbMoESn0Q0LccFg_dpG4gIa-Z1xro',
			authDomain: 'honesty-store-kiosk-dev.firebaseapp.com',
			projectId: 'honesty-store-kiosk-dev'
		});
		this.db = firebase.firestore();
		this.db.settings({timestampsInSnapshots: true});

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

	updateItemCount = (item, delta) => {
		this.db
			.collection('item_data')
			.doc(item)
			.get()
			.then(doc => {
				this.db
					.collection('item_data')
					.doc(doc.id)
					.set({
						count: doc.data().count + delta
					});
			});
	};

	remove = event => {
		this.db
			.collection('training_data')
			.doc(event.target.dataset.id)
			.delete()
			.then(() => this.getImages());

		this.updateItemCount(event.target.dataset.item, -1);
	};

	trust = event => {
		this.db
			.collection('training_data')
			.doc(event.target.dataset.id)
			.set({trusted: true})
			.then(() => this.getImages());

		this.updateItemCount(event.target.dataset.item, 1);
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
