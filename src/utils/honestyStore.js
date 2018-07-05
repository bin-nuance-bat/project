const getStore = callback => {
	fetch('https://honesty.store/api/v1/session', {
		method: 'POST',
		headers: {
			Authorization:
				'Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NWJjNjY5Yi01OTA4LTQxM2EtOWEyMC0yMGY1MGI2ZjE0NDQiLCJyZWZyZXNoVG9rZW4iOiJmOTYxMzFlNC0wZDBiLTQxOTUtYTViZC1jMWNiODkyYmUyYmMiLCJpYXQiOjE1MzA4MDgwMjksImV4cCI6MTU2MjM2NTYyOX0.cfEF4mNjsCl1af5u31deGz_VSXsmFDxttwb4aw58mmM'
		}
	})
		.then(res => res.json())
		.then(res => callback(null, res.response.store.items))
		.catch(err => callback(err));
};

export default getStore;
