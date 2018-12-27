// webhook URLのリストコード
const request = require('request');
const config = require(`./config.json`);

const twitter_oauth = {
  consumer_key: config.TWITTER_CONSUMER_KEY.trim(),
  consumer_secret: config.TWITTER_CONSUMER_SECRET.trim(),
  token: config.TWITTER_ACCESS_TOKEN.trim(),
  token_secret: config.TWITTER_ACCESS_TOKEN_SECRET.trim()
}

const request_options = {
  url: `https://api.twitter.com/1.1/account_activity/all/${config.devLabel}/webhooks.json`,
  oauth: twitter_oauth,
  headers: { 'Content-type': 'application/x-www-form-urlencoded' }
};
request.get(request_options, (error, response, body) => { console.log(body) });
