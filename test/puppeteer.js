// const puppeteer = require('puppeteer');

// (async () => {
// 	const browser = await puppeteer.launch();
// 	const page = await browser.newPage();
// 	await page.goto()
// 	await page.screenshot({path: 'exaple.png'});

// 	await browser.close();
// })().catch(err => console.log(err));

const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({
		args: ['--use-file-for-fake-video-capture=download.jpg']
	});
	const page = await browser.newPage();

	await browser.close();
})();
