const functions = require('firebase-functions');
const request = require('request-promise-native');
const toBuffer = require('data-uri-to-buffer');
const fs = require('fs');

const HONESTY_STORE_LOGO = 'https://honesty.store/assets/android/icon@MDPI.png';
const BOT_USERNAME = 'honesty.store';

exports.sendSlackMessage = functions.https.onCall(data => {
  const token = functions.config().slack.token;

  const options = {
    auth: {bearer: token},
    json: true,
    body: {
      channel: data.userid,
      icon_url: HONESTY_STORE_LOGO,
      username: BOT_USERNAME,
      text: `Click to purchase your ${
        data.itemName
      }: https://honesty.store/item/${data.actualItemID}`
    }
  };

  return request.post('https://slack.com/api/chat.postMessage', options);
});

exports.sendSnackChat = functions.https.onCall(data => {
  fs.writeFileSync('/tmp/snackchat.jpg', toBuffer(data.snackChat));
  const token = functions.config().slack.token;
  const options = {
    json: true,
    formData: {
      token,
      channels: data.userid,
      title: 'Your SnackChat',
      initial_comment: `Click to purchase your ${
        data.itemName
      }: https://honesty.store/item/${data.actualItemID}`,
      file: fs.createReadStream('/tmp/snackchat.jpg')
    }
  };
  return request.post('https://slack.com/api/files.upload', options);
});

exports.loadSlackUsers = functions.https.onCall(() => {
  const token = functions.config().slack.token;

  const options = {
    auth: {bearer: token},
    json: true
  };

  return request.get('https://slack.com/api/users.list', options);
});
