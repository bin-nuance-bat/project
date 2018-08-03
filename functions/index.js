const functions = require('firebase-functions');
const fetch = require('node-fetch');
const queryString = require('query-string');

const HONESTY_STORE_LOGO = 'https://honesty.store/assets/android/icon@MDPI.png';
const BOT_USERNAME = 'honesty.store';

exports.sendSlackMessage = functions.https.onCall(data => {
  const token = functions.config().slack.token;
  const options = queryString.stringify({
    token,
    channel: data.userid,
    icon_url: HONESTY_STORE_LOGO,
    username: BOT_USERNAME,
    text: `Click to purchase your ${
      data.itemName
    }: https://honesty.store/item/${data.acutalItemID}`
  });

  return fetch(`https://slack.com/api/chat.postMessage?${options}`)
    .then(response => {
      return response.json();
    })
    .catch(() => {
      return {ok: false};
    });
});
