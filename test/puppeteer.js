const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('localhost:3000');
	await browser.close();
})().catch(err => console.log(err));
