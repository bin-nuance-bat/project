const getStore = () => {
	return fetch('https://honesty.store/api/v1/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({storeCode: 'sl-ncl'})
	})
		.then(res => res.json())
		.then(res =>
			res.response.store.items.reduce(
				(map, obj) => {map[obj.id] = obj
					       return map},
				{}
			)
		);
};

export default getStore;
