export const getUsers = state =>
  state.users.map(user => ({
    name: user.name,
    id: user.id,
    image: user.profile['image_48']
  }));
