export const getUsers = state =>
  state.users.data.map(user => ({
    name: user.name,
    id: user.id,
    image: user.profile['image_48']
  }));
