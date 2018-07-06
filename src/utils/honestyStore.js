const getStore = () => {
	return fetch('https://honesty.store/api/v1/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify({storeCode: 'sl-ncl'})
	})
		.then(res => res.json())
		.then(res => res.response.store.items);
};

export default getStore;
