import {SET_USERS, SET_CURRENT_USER} from './actionTypes';
import labels from './../../utils/labels.json';
import store from './../../utils/reduxStore';

const token = process.env.REACT_APP_SLACK_TOKEN;

export function setUsers(users) {
	return {
		type: SET_USERS,
		users
	};
}

export function setCurrentUser(currentUser) {
	return {
		type: SET_CURRENT_USER,
		currentUser
	};
}

const getIDByUsername = username => {
	let users = store.getState().users;
	const user = users.find(
		user => user.name === username || user.profile.real_name === username
	);
	return user ? user.id : null;
};

export const sendSlackMessage = username => dispatch => {
	let id = getIDByUsername(username);
	let storeCode = store.getState().prediction.id;
	let name = store.getState().storeList[storeCode].name;
	// check that the saved store code exists
	let i = 0;
	for (; i < labels.length; i++) {
		if (labels[i] === storeCode) break;
	}
	if (i === labels.length) return false;

	// if (!token) return false;
	// try {
	// 	await fetch(`https://slack.com/api/chat.postMessage?token=${token}&
	// 	channel=${id}&
	// 	text=${`Click to purchase your ${itemName}: https://honesty.store/item/${storeCode}`}`);
	// 	return true;
	// } catch (error) {
	// 	return false;
	// }
};

export const loadUsers = () => dispatch => {
	fetch(`https://slack.com/api/users.list?token=${token}`)
		.then(res => res.json())
		.then(data => {
			if (!data.ok) throw Error('failed to fetch users');
			else return data.members;
		})
		.then(users => dispatch(setUsers(users)))
		.catch(() =>
			dispatch(
				setUsers([
					{
						id: '1',
						name: 'ilapworth',
						profile: {real_name: 'Isaac Lapworth'}
					}
				])
			)
		);
};
