import sys
import time
import asyncio
from random import random
from pyppeteer import launch


DELAY = int(random() * 3 + 2)


async def run(username, password, DEBUG=False):
    url = 'https://api.m.dlut.edu.cn/login?redirect_uri=https%3a%2f%2flightapp.m.dlut.edu.cn%2fcheck%2fquestionnaire'
    # init
    browser = await launch()
    page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)

    # click func
    async def click(selector):
        await asyncio.gather(
            page.waitForNavigation(),
            page.click(selector),
        )
        time.sleep(DELAY)

    await page.goto(url)

    # enter username
    await page.keyboard.press('Tab')
    await page.keyboard.type(username)
    # enter password
    await page.keyboard.press('Tab')
    await page.keyboard.type(password)
    if DEBUG:
        await page.screenshot({'path': 'step_1.png'})

    # click login
    await click('input.btn_1_new')
    print('login...')
    if DEBUG:
        await page.screenshot({'path': 'step_2.png'})

    # click the first questionnaire
    await click('ul.content li')
    print('enter the questionnaire...')
    if DEBUG:
        await page.screenshot({'path': 'step_3.png'})

    p = await page.Jeval('div.public_modal_tax', 'node => node.innerText')
    if p and '您在周期内已填写过此问卷' in p:
        print('⚠️', p)
    else:
        # click “确定”
        await page.click('a.am-modal-button:nth-child(2)')
        print('fill it with previous answer...')
        if DEBUG:
            await page.screenshot({'path': 'step_4.png'})

        # click '提交'
        await page.click('div.addanswer > div > div.btn_xs')
        print('🎉 done!')
        if DEBUG:
            await page.screenshot({'path': 'step_5.png'})

    await browser.close()


if __name__ == '__main__':
    username = ''
    password = ''

    if len(sys.argv) >= 2:
        username = sys.argv[1]
        password = sys.argv[2]

    if username == '' or password == '':
        print('⚠️ please enter username and password')
    else:
        try:
            asyncio.get_event_loop().run_until_complete(run(username, password))
        except:
            print('⚠️ 失败，请将 DEBUG 设置为 True 通过截图查看错误的地方')
