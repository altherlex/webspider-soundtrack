const util = require('util');
const request = require('request');
const cheerio = require('cheerio');
const URL = "http://download-soundtracks.com/dmca-policy/";
const requestPromise = util.promisify(request);
const puppeteer = require('puppeteer');
const select = require ('puppeteer-select');
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const Promise = require("bluebird");

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

      await select(page).assertElementPresent(SELECTOR_DOWNLOAD_TAG);
      const element = await select(page).getElement(SELECTOR_DOWNLOAD_TAG);
      await page.$eval(SELECTOR_DOWNLOAD_TAG+'> p > a', e => e.setAttribute("target", ""));
      await element.click('a');
      await page.waitForNavigation({ waitUntil: 'load' }); 

      const hotlink_url = page.url();
      console.log('xxxx', hotlink_url);
      await browser.close();
      return hotlink_url;
    } catch(e){
      console.log('Error while opening browser', e);
      await browser.close();
    }
  }

  static async updateHotlink(){
    const state = 
      `UPDATE albums
        SET hotlink_url=$2, download_url=$3
        WHERE id=$1 returning *`    
    const {rows, rowCount} = await pool.query('SELECT * FROM albums WHERE hotlink_url IS NULL ORDER BY created_date DESC');
    rows.forEach(async (album) => {
      var hotlink_url = '';
      try {
        hotlink_url = await Helper.getHotlink(album.post_url);
        await pool.query(state, [album.id, hotlink_url, '']);
        console.log('hotlink_url', hotlink_url);
      } catch(e){
        console.log('erro ocorrido:', e);
      }
    }); // forEach end

    pool
      .query('SELECT * FROM albums WHERE hotlink_url IS NULL ORDER BY created_date DESC')
      .then(function(res){
          console.log('do nothing yet');

        // res.rows = [res.rows[0]];
        // Promise.mapSeries(res.rows, async function(album, index, arrayLength) {
        //   const link = await Helper.getHotlink(album.post_url);
        //   console.log(link);
        //   return link;
        // }).then(function(result) {
        //   console.log("Done!")
        //   console.log(result);
        // });

        // var current = Promise.resolve();
        // const p = res.rows.map(function(album) { 
        //   current = current
        //   .then(function(result) {
        //     const info = Helper.getHotlink(album.post_url) // returns promise
        //     console.log('------------------');
        //     console.log(info);
        //     console.log('------------------');
        //     return info
        //   });
        //   return current
        // });
        // return p
      })
      // .then(function(p){
      //   console.log('Aquiiiii');
      //   console.log(p);
      //   Promise.all(p).then(function(result) {
      //     // results is an array of names
      //     console.log(result);
      //   })
      // })
      .catch(err => console.error('Error executing query', err.stack));

    // start with current being an "empty" already-fulfilled promise

    // const syncRunPromise = new Promise((resolve, reject) => {
    //   try {
    //     resolve();
    //   } catch(e) {
    //     reject();
    //   }
    // });
    // syncRunPromise
    //   .then(function() {
    //     const albums = pool.query('SELECT * FROM albums ORDER BY created_date DESC');
    //     albums.forEach( (album) => {
    //       const info = helper.getAlbumInfo(album.post_url);
    //     }); // forEach end
    //   })
    //   .catch(function(error){
    //     console.log(error.message);
    //   });

// //** TESTING PREMISE
// //*** Promise
//   var willIGetNewPhone = new Promise(
//     function (resolve, reject) {
//       try {
//         resolve(phone); // fulfilled
//       }catch(e) {
//         reject(e); // reject
//       }
//     }
//   );
// // **** COnsuming it
// willIGetNewPhone
//   .then(function (fulfilled) {
//     // yay, you got a new phone
//     console.log(fulfilled);
//   // output: { brand: 'Samsung', color: 'black' }
//   })
//   .catch(function (error) {
//     // oops, mom don't buy it
//     console.log(error.message);
//   // output: 'mom is not happy'
//   });
// //** FIMMMMMM

  }
}

module.exports = {helper: Helper};
