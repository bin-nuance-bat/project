const importImages = require.context('../assets/itemicons', true, /\.svg$/);
const imgFilesObject = importImages.keys().reduce((images, key) => {
  images[key] = importImages(key);
  return images;
}, {});

const getImagePath = item => {
  const givenPath = './' + item.image;
  let actualImagePath;

  if (imgFilesObject[givenPath]) {
    actualImagePath =
      './' + item.image + (item.image.endsWith('.svg') ? '' : '.svg');
  } else {
    actualImagePath = './misc-bar.svg';
  }

  return actualImagePath;
};

const addItemImage = item => {
  const imagePath = getImagePath(item);
  const image = importImages(imagePath);
  return {
    ...item,
    image
  };
};

const getStore = () => {
  return fetch('https://honesty.store/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({storeCode: 'sl-ncl'})
  })
    .then(res => res.json())
    .then(res => {
      let items = res.response.store.items;
      items = items.map(addItemImage);
      items = items.reduce((map, obj) => {
        map[obj.id] = obj;
        return map;
      }, {});
      return items;
    });
};

export default getStore;
