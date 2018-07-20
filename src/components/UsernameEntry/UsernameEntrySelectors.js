export const getUsers = state =>
	state.users.map(user => ({
		name: user.name,
		id: user.name,
		image: user.profile['image_48']
	}));
