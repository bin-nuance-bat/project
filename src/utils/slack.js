const token = '';

const usernameToID = async username => {
	let members;
	await fetch(`https://slack.com/api/users.list?token=${token}`)
		.then(res => res.json())
		.then(data => {
			members = data.members;
		})
		.catch(err => err);

	if (!members) return null;

	let i = members.length;
	while (i--) {
		if (
			members[i].name === username ||
			members[i].profile.real_name === username
		) {
			return members[i].id;
		}
	}
	return null;
};

const sendSlackMessage = async (username, itemName, storeCode) => {
	let id = await usernameToID(username);
	if (!id) {
		alert('Error: Slack user not found');
		return null;
	}

	await fetch(`http://slack.com/api/chat.postMessage?token=${token}&
	channel=${id}&
	text=${`Click to purchase your ${itemName}: ${storeCode}`}`)
		.then(res => alert('Payment reminder sent to Slack'))
		.catch(error => alert('Error: failed to send reminder'));
	return true;
};

export default sendSlackMessage;
