const addItemImage = imageMap => item => {
  const apiPath = 'static/media/' + item.image;
  const relativePath =
    imageMap[apiPath] || imageMap['static/media/misc-bar.svg'];
  const image = `https://honesty.store/${relativePath}`;

  return {
    ...item,
    image
  };
};

const getStore = async () => {
  const json = await fetch('https://honesty.store/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({storeCode: 'sl-ncl'})
  }).then(res => res.json());
  let items = json.response.store.items;

  const imageMap = await fetch(
    'https://honesty.store/asset-manifest.json'
  ).then(res => res.json());

  items = items.map(addItemImage(imageMap));
  items = items.reduce((map, obj) => {
    map[obj.id] = obj;
    return map;
  }, {});

  return items;
};

export default getStore;
