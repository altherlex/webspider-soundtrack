const puppeteer = require('puppeteer');
const select = require ('puppeteer-select');
const SELECTOR_DOWNLOAD_TAG = "blockquote.wp-block-quote";
const URL_PAGE_ALBUM = "http://download-soundtracks.com/game_sountdtracks/eidolon-music-from-final-fantasy-ix/";
const URL_ALBUM = "http://download-soundtracks.com/ds/ekdjQrSXVuB7Mrd3KipVoQD7ahPywJAkLy1BgAJnDkkMN800Y+4fqerY7oKqyhE6Xi54R3cmK8WQWcmUuwyFPw==:0IDI4Fcmp2tWuM8mKSqFkA=="

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(URL_PAGE_ALBUM, { waitUntil: 'networkidle2' });

  await select(page).assertElementPresent(SELECTOR_DOWNLOAD_TAG);
  const element = await select(page).getElement(SELECTOR_DOWNLOAD_TAG);
  // await Promise.series(
  //   [
  //     element.click('a'), 
  //     page.waitForNavigation({ waitUntil: 'load' }), 
  //     console.log('Current page', page.url())
  //   ]
  // );
  // await element.setAttribute("target", '');
  await page.$eval(SELECTOR_DOWNLOAD_TAG+'> p > a', e => e.setAttribute("target", ""));
  await element.click('a');
  await page.waitForNavigation({ waitUntil: 'load' }), 
  console.log('aaaCurrent page', page.url())

  await browser.close();
})();
