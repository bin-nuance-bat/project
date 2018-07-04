const usernameToID = async username => {
	let members;
	await fetch(
		`https://slack.com/api/users.list?token=xoxp-3623867403-382730537825-392640739603-67434fb2e7accf0941b6868e18bf333d&pretty=1`
	)
		.then(res => res.json())
		.then(data => (members = data.members));
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

const sendSlackMessage = async (username, message) => {
	let id = await usernameToID(username);
	if (!id) throw new Error('Slack user not found');
	fetch(`http://slack.com/api/chat.postMessage?token=xoxp-3623867403-382730537825-392640739603-67434fb2e7accf0941b6868e18bf333d&
	channel=${id}&
	text=${message}`)
		.then(res => console.log(res))
		.catch(error => console.log(error));
};

export default sendSlackMessage;
