const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const URL = "http://download-soundtracks.com/dmca-policy/";

const URL_PAGE_ALBUM = "http://download-soundtracks.com/game_sountdtracks/eidolon-music-from-final-fantasy-ix/";
const select_download_tag = "blockquote.wp-block-quote>p>a";

const URL_ALBUM = "http://download-soundtracks.com/ds/ekdjQrSXVuB7Mrd3KipVoQD7ahPywJAkLy1BgAJnDkkMN800Y+4fqerY7oKqyhE6Xi54R3cmK8WQWcmUuwyFPw==:0IDI4Fcmp2tWuM8mKSqFkA=="
const http = require('http');


const puppeteer = require('puppeteer');
const async = require('async');
const await = require('await');

const browser = await(puppeteer.launch());
const page = await(browser.newPage());
await(page.goto('https://example.com'));
await(page.screenshot({path: 'example.png'}));
await(browser.close());

function recover_album_local_url(){
  request(URL_PAGE_ALBUM, function (err, res, body) {
    if(err){
      console.log(err, "error occured while hitting URL");
    }//if
    else 
    {
      let $ = cheerio.load(body);

      const link = $(select_download_tag).attr('href');
      console.log(link);

      fs.writeFile('data.txt', link, function (err) { 
        if(err) { 
          console.log(err); 
        }
      }); 
    }//else
  });
}

function recover_latest_list(){
  request(URL, function (err, res, body) {
    if(err){
      console.log(err, "error occured while hitting URL");
    }//if
    else 
    {
      const arr = []; 
      let $ = cheerio.load(body);

      $('div#recent-posts-4>ul>li').each(function(index){
          const link = $(this).find('a').attr('href');
          const name = $(this).find('a').text();
          var obj = { 
              data : link, 
              name : name 
          };
          arr.push(JSON.stringify(obj));                
      });
      console.log(arr.toString()); 

      fs.writeFile('data.txt', arr, function (err) { 
        if(err) { 
          console.log(err); 
        }
      }); 
    }//else
  });
}

// recover_latest_list();
