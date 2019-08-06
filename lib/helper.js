const cheerio = require('cheerio');
const URL = "http://download-soundtracks.com/dmca-policy/";
const Promise = require("bluebird");
var requestPromise = Promise.promisify(require("request"));
Promise.promisifyAll(requestPromise);
const puppeteer = require('puppeteer');
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const moment = require('moment');

class Helper {
  static async getLatestAlbums(){
    const response = await requestPromise(URL);
    let $ = cheerio.load(response.body);
    const arr = []; 

    try {
      $('div#recent-posts-4>ul>li').each(function(index){
        const post_url = $(this).find('a').attr('href');
        const name = $(this).find('a').text();
        const obj = {post_url, name };
        arr.push(obj);
      });
      return arr;
    } catch(e) {
      console.log('deu errro', e);
    }
  }

  static async getAlbumInfo(post_url){
    const response = await requestPromise(post_url);
    let $ = cheerio.load(response.body);
    const download_url = $("blockquote.wp-block-quote>p>a").attr('href');
    const capa = $("div.article>div.wp-block-image>figure>img").attr('src');
    return {download_url, capa}
  }

  static async getHotlink(post_url, browser=1){
    const SELECTOR_DOWNLOAD_TAG = "blockquote.wp-block-quote";
    if (browser===1)
      browser = await puppeteer.launch({ headless: false });

    try {
      const page = await browser.newPage();
      await page.goto(post_url, { waitUntil: 'networkidle2' });
      await page.waitFor(SELECTOR_DOWNLOAD_TAG + '> p > a');
      await page.$eval(SELECTOR_DOWNLOAD_TAG+'> p > a', e => e.setAttribute("target", ""));
      page.$eval(SELECTOR_DOWNLOAD_TAG + '> p > a', e => e.click());
      await page.waitForNavigation({ waitUntil: 'load' }); 
      const hotlink_url = page.url();
      if (browser === 1)
        await browser.close();
      return hotlink_url;
    } catch(e){
      console.log('Error while opening browser', e);
      await browser.close();
    }
  }

  static async updateInfo(){
    const state = `UPDATE albums SET hotlink_url=$2, modified_date=$3 WHERE id=$1 returning *`
    var {rows, rowCount} = await pool.query('SELECT * FROM albums WHERE hotlink_url IS NULL ORDER BY created_date DESC');
    const browser = await puppeteer.launch({ headless: false });
    const result = [];

    // in Series: 
    //   https://medium.com/@paulsomers/interesting-solutions-did-you-also-consider-using-reduce-168748dd3f4e
    await rows.reduce((p, album, i) => p.then(async () => {
      var hotlink_url = '';
      try {
        hotlink_url = await Helper.getHotlink(album.post_url, browser);
        const r = await pool.query(state, [album.id, null, moment(new Date()) ]);
        result.push(r.rows[0]);
      } catch(e){
        console.log('erro ocorrido:', e);
      }
    }), Promise.resolve()); // reduce end
    // const result = await rows.map(async album => {
    //   var hotlink_url = '';
    //   try {
    //     hotlink_url = await Helper.getHotlink(album.post_url, browser);
    //     const r = await pool.query(state, [album.id, null, moment(new Date())]);
    //     return r.rows[0];
    //   } catch (e) {
    //     console.log('erro ocorrido:', e);
    //   }
    // }); // map end

    await browser.close();
    return result;
  }
}

module.exports = { helper: Helper };
