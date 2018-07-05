// const puppeteer = require('puppeteer');

// (async () => {
// 	const browser = await puppeteer.launch();
// 	const page = await browser.newPage();
// 	await page.goto("../public/index.html")

// 	await browser.close();
// })().catch(err => console.log(err));

const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('http://localhost:3000/');
	await page.screenshot({path: 'exaple.png'});

	await browser.close();
})();
