/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as tf from '@tensorflow/tfjs';
import firebase from 'firebase/app';
import 'firebase/firestore';

export class ControllerDataset {
	constructor(status) {
		this.setStatus = status;

		firebase.initializeApp({
			apiKey: 'AIzaSyBVuVNKx-rx2ON0RxbfGfbGPpiymbMrxj8',
			authDomain: 'honesty-store-kiosk.firebaseapp.com',
			projectId: 'honesty-store-kiosk'
		});
		this.db = firebase.firestore();
		this.db.settings({timestampsInSnapshots: true});
	}

	async setItemTrainingCounts(itemObj) {
		const items = await this.db.collection('item_data').get();
		items.forEach(item => {
			itemObj[item.id].mlCount = item.data().count;
		});
		return itemObj;
	}

	async addExample(img, activation, label) {
		const item = await this.db
			.collection('item_data')
			.doc(label)
			.get();
		this.db
			.collection('item_data')
			.doc(label)
			.set({
				count: item.exists ? item.data().count + 1 : 1
			});

		this.db
			.collection('training_data')
			.add({
				img,
				activation: activation.dataSync().join(','),
				label,
				random: Math.random(),
				trusted: true
			})
			.then(ref => {
				activation.dispose();
			})
			.catch(err => {
				activation.dispose();
			});
	}

	async addExamples(examples) {
		if (examples.length < 1) return;

		const item = await this.db
			.collection('item_data')
			.doc(examples[0].label)
			.get();

		this.db
			.collection('item_data')
			.doc(examples[0].label)
			.set({
				count: item.exists
					? item.data().count + examples.length
					: examples.length
			});

		for (let i in examples) {
			this.db
				.collection('training_data')
				.add({
					img: examples[i].img,
					activation: examples[i].activation.dataSync().join(','),
					label: examples[i].label,
					random: Math.random(),
					trusted: true
				})
				.then(() => {
					examples[i].activation.dispose();
					this.setStatus(
						`Uploading images (${parseInt(i, 10) + 1}/${
							examples.length
						})`
					);
					if (parseInt(i, 10) + 1 >= examples.length) {
						this.setStatus('Done');
					}
				})
				.catch(err => {
					console.error(err);
					examples[i].activation.dispose();
				});
		}
	}

	async getClassCount() {
		let items = await this.db.collection('item_data').get();
		return items.size;
	}

	async getBatch(batchSize = 10, randomness = 1) {
		return new Promise(async resolve => {
			let batch = {};

			while (Object.keys(batch).length < batchSize) {
				const snapshot = await this.db
					.collection('training_data')
					.orderBy('random')
					.startAt(Math.random())
					.limit(batchSize * randomness)
					.get();

				await snapshot.forEach(doc => {
					batch[doc.id] = doc.data();
				});
			}

			resolve(Object.values(batch).splice(0, batchSize));
		});
	}

	async getTensors() {
		const batch = await this.getBatch();
		let classCount = await this.getClassCount();
		let xs, ys;

		xs = tf.keep(
			tf.tensor4d(batch[0].activation.split(','), [1, 7, 7, 1024])
		);
		ys = tf.keep(
			tf.tidy(() =>
				tf.oneHot(tf.tensor1d([batch[0].label]).toInt(), classCount)
			)
		);

		for (let i = 1; i < batch.length; i++) {
			const y = tf.tidy(() =>
				tf.oneHot(tf.tensor1d([batch[i].label]).toInt(), classCount)
			);

			const oldX = xs;
			xs = tf.keep(
				oldX.concat(
					tf.tensor4d(batch[i].activation.split(','), [
						1,
						7,
						7,
						1024
					]),
					0
				)
			);

			const oldY = ys;
			ys = tf.keep(oldY.concat(y, 0));
		}

		return {xs, ys};
	}
}
