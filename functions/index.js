const functions = require('firebase-functions');
const fetch = require('node-fetch');
const toFile = require('data-uri-to-file');
const request = require('request-promise-native');

const HONESTY_STORE_LOGO = 'https://honesty.store/assets/android/icon@MDPI.png';
const BOT_USERNAME = 'honesty.store';

exports.sendSlackMessage = functions.https.onCall(data => {
  const token = functions.config().slack.token;
  const attachments = data.snackChat
    ? [
        {
          fallback: 'Your SnackChat',
          image_url: data.snackChat
        }
      ]
    : [];

  const options = {
    auth: {bearer: token},
    channel: data.userid,
    icon_url: HONESTY_STORE_LOGO,
    username: BOT_USERNAME,
    text: `Click to purchase your ${
      data.itemName
    }: https://honesty.store/item/${data.actualItemID}`,
    attachments
  };

  return request.post('https://slack.com/api/chat.postMessage', options);
});

exports.uploadImageToSlack = functions.https.onCall(data => {
  const token = functions.config().slack.token;
  const options = {
    auth: {bearer: token},
    form: {
      channels: data.userid,
      content: toFile(data.snackChat)
    }
  };
  return request.post('https://slack.com/api/files.upload', options);
});

exports.loadSlackUsers = functions.https.onCall(() => {
  const token = functions.config().slack.token;

  return fetch(`https://slack.com/api/users.list?token=${token}`)
    .then(response => response.json())
    .catch(() => ({ok: false}));
});
