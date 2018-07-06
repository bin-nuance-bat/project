const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	// extend
	await browser.close();
})();
