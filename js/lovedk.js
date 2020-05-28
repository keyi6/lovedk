const puppeteer = require('puppeteer');
const url = 'https://api.m.dlut.edu.cn/login?redirect_uri=https%3a%2f%2flightapp.m.dlut.edu.cn%2fcheck%2fquestionnaire';

const DELAY = Math.ceil(Math.random() * 3) + 2; 


async function run(username, password, DEBUG = false) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0);
	await page.goto(url, { waitUntil: 'load' });

	// enter username
	await page.keyboard.press('Tab')
	await page.keyboard.type(username)
	// enter password
	await page.keyboard.press('Tab')
	await page.keyboard.type(password)
	if (DEBUG) await page.screenshot({'path': 'step_1.png'})

	// click '登录'
	await page.click('input.btn_1_new')
	await page.waitForNavigation();
	console.log('login...')
	if (DEBUG) await page.screenshot({'path': 'step_2.png'})

	// click the first questionnaire
    await page.click('ul.content li')
	console.log('enter the questionnaire...')
    if (DEBUG) await page.screenshot({'path': 'step_3.png'})

	// check if it's already submitted today
	let proceed = await page.evaluate(() => {
		let e = document.querySelector('div.public_modal_tax');
		return !e || e.innerText.indexOf('您在周期内已填写过此问卷') == -1;
	});

	if (!proceed) {
		console.log('⚠️ 今天已经打过卡');
	} else {
		// click “确定”
        await page.click('a.am-modal-button:nth-child(2)')
        console.log('fill it with previous answer...')
        if (DEBUG) await page.screenshot({'path': 'step_4.png'})

		// type “您当前体温情况？”
		let temperature = ["36.1", "36.2", "36.3", "36.4", "36.5", "36.6", "36.7", "36.8", "36.9", "37.0", "37.1"]
		let temp = await page.evaluate(() => {
			return document.querySelector('div.pdt15 > input').value
		})
		await page.click('div.pdt15 > input')
		for (let i = 0; i < temp.length; i ++) {
			await page.keyboard.press("Backspace");
		}
		await page.type('div.pdt15 > input', temperature[Math.round(Math.random()*(temperature.length-1))])
		console.log('fill it with a random temperature...')
		if (DEBUG) await page.screenshot({'path': 'step_5.png', 'fullPage': true})

        // click '提交'
		await page.click('div.addanswer > div > div.btn_xs')  // 在i大工中实际测试，点击输入框之后，第一次点击提交button无效。
        await page.click('div.addanswer > div > div.btn_xs')
        console.log('🎉 done!')
        if (DEBUG) await page.screenshot({'path': 'step_5.png'})
	}

	await browser.close();
}


(async () => {
	let username = '';
	let password = '';

	if (process.argv.length >= 4) {
		username = process.argv[2];
		password = process.argv[3];
	}

	if (username == '' || password == '') {
		console.log('⚠️ please input your username and password');
	} else {
		await run(username, password);
	}
})();
