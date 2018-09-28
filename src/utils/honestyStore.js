const addItemImage = imageMap => item => {
  const apiPath = `static/media/${item.image}`;
  const relativePath =
    imageMap[apiPath] || imageMap['static/media/misc-bar.svg'];
  const image = `https://honesty.store/${relativePath}`;

  return {
    ...item,
    image
  };
};

const getItems = async () => {
  const res = await fetch('https://honesty.store/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({storeCode: 'sl-ncl'})
  });
  const json = await res.json();
  return json.response.store.items;
};

const getImageMap = async () => {
  const res = await fetch('https://honesty.store/asset-manifest.json');
  return await res.json();
};

const getStore = async () => {
  const [items, imageMap] = await Promise.all([getItems(), getImageMap()]);

  return items.map(addItemImage(imageMap)).reduce((map, obj) => {
    map[obj.id] = obj;
    return map;
  }, {});
};

export default getStore;
