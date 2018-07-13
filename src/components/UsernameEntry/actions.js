import {
	SET_USERS,
	SET_CURRENT_USER,
	SET_SEND_REMINDER_ERROR
} from './actionTypes';
import labels from './../../utils/labels.json';

const token = process.env.REACT_APP_SLACK_TOKEN;

export function setCurrentUser(currentUser) {
	return {
		type: SET_CURRENT_USER,
		currentUser
	};
}

function setUsers(users) {
	return {
		type: SET_USERS,
		users
	};
}

export const loadUsers = () => dispatch => {
	fetch(`https://slack.com/api/users.list?token=${token}`)
		.then(res => res.json())
		.then(data => {
			if (!data.ok) throw Error('failed to fetch users');
			else return data.members;
		})
		.then(users => dispatch(setUsers(users)))
		.catch(() => dispatch(setUsers([])));
};

function setSendReminderError(sendReminderError) {
	return {
		type: SET_SEND_REMINDER_ERROR,
		sendReminderError
	};
}

const getIDByUsername = (username, users) => {
	const user = users.find(
		user => user.name === username || user.profile.real_name === username
	);
	return user ? user.id : null;
};

export const sendSlackMessage = username => async (dispatch, getState) => {
	let state = getState();
	let id = getIDByUsername(username, state.users);

	let storeCode = state.prediction ? state.prediction.id : '';
	let itemName = state.storeList[storeCode]
		? state.storeList[storeCode].name
		: '';

	// check that the saved store code exists
	let i = 0;
	for (; i < labels.length; i++) {
		if (labels[i] === storeCode) break;
	}
	if (i === labels.length) return false;

	try {
		await fetch(`https://slack.com/api/chat.postMessage?token=${token}&
		channel=${id}&
		text=${`Click to purchase your ${itemName}: https://honesty.store/item/${storeCode}`}`);
		return true;
	} catch (error) {
		return false;
	}
};
