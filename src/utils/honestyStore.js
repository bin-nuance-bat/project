const getStore = callback => {
	fetch('https://honesty.store/api/v1/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify({storeCode: 'sl-ncl'})
	})
		.then(res => res.json())
		.then(res => callback(null, res.response.store.items))
		.catch(err => callback(err));
};

export default getStore;
