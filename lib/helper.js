const util = require('util');
const request = require('request');
const cheerio = require('cheerio');
const URL = "http://download-soundtracks.com/dmca-policy/";

class Helper {
  static async GetLatestAlbums(){

    const requestPromise = util.promisify(request);
    const response = await requestPromise(URL);
    let $ = cheerio.load(response.body);
    const arr = []; 

    $('div#recent-posts-4>ul>li').each(function(index){
      const link = $(this).find('a').attr('href');
      const name = $(this).find('a').text();
      const obj = {link, name };
      arr.push(obj);
    });
    return arr;
  }
}

module.exports = {helper: Helper};
