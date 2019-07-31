const util = require('util');
const request = require('request');
const cheerio = require('cheerio');
const URL = "http://download-soundtracks.com/dmca-policy/";
const requestPromise = util.promisify(request);

class Helper {
  static async GetLatestAlbums(){
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

  static async GetAlbumDownloadInfo(post_url){
    const response = await requestPromise(post_url);
    let $ = cheerio.load(response.body);
    const download_url = $("blockquote.wp-block-quote>p>a").attr('href');
    const capa = $("div.article>div.wp-block-image>figure>img").attr('src');
    return {download_url, capa}
  }


}

module.exports = {helper: Helper};
