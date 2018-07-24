import labels from './labels.json';

const token = process.env.REACT_APP_SLACK_TOKEN;

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
  // check that the saved store code exists
  let i = 0;
  for (; i < labels.length; i++) {
    if (labels[i] === storeCode) break;
  }
  if (i === labels.length) return false;
  if (!token) return false;
  try {
    await fetch(`https://slack.com/api/chat.postMessage?token=${token}&
		channel=${id}&
		text=${`Click to purchase your ${itemName}: https://honesty.store/item/${storeCode}`}`);
    return true;
  } catch (error) {
    return false;
  }
};
