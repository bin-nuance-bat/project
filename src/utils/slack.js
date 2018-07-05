const token = process.env.SLACK_TOKEN;

const getUserSlackID = (username, users) => {
	const user = users.find(
		user => user.name === username || user.profile.real_name === username
	);
	return user ? user.id : null;
};

const loadUsers = async callback => {
	fetch(`https://slack.com/api/users.list?token=${token}`)
		.then(res => res.json())
		.then(data => {
			if (!data.ok) callback(null);
			else callback(data.members);
		})
		.catch(err => callback(null));
};

const sendSlackMessage = async (id, itemName, storeCode) => {
	await fetch(`http://slack.com/api/chat.postMessage?token=${
		this.props.token
	}&
	channel=${id}&
	text=${`Click to purchase your ${itemName}: https://honesty.store/item/${storeCode}`}`);
};

export {loadUsers, sendSlackMessage, getUserSlackID};
