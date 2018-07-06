const getStore = callback => {
	fetch('https://honesty.store/api/v1/session', {
		method: 'POST',
		headers: {
			Authorization: 'Bearer: ' + process.env.HONESTY_STORE_TOKEN
		}
	})
		.then(res => res.json())
		.then(res => callback(null, res.response.store.items))
		.catch(err => callback(err));
};

export default getStore;
