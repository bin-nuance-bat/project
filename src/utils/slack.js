const token =
	'xoxp-3623867403-382730537825-392851186291-c8b53445e943772888721a9219405a42';

export const getUserSlackID = (username, users) => {
	const user = users.find(
		user => user.name === username || user.profile.real_name === username
	);
	return user ? user.id : null;
};

export const loadUsers = () => {
	return fetch(`https://slack.com/api/users.list?token=${token}`)
		.then(res => res.json())
		.then(data => {
			if (!data.ok) throw Error('failed to fetch users');
			else return data.members;
		});
};

export const sendSlackMessage = async (id, itemName, storeCode) => {
	try {
		await fetch(`http://slack.com/api/chat.postMessage?token=${token}&
		channel=${id}&
		text=${`Click to purchase your ${itemName}: https://honesty.store/item/${storeCode}`}`);
	} catch (error) {
		console.error('Failed to obtain env variable: SLACK_TOKEN');
	}
};
