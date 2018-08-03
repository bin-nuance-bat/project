const functions = require('firebase-functions');
const fetch = require('node-fetch');

exports.sendSlackMessage = functions.https.onCall(data => {
  const token = functions.config().react_app.slack_token;
  const result = fetch(
    `https://slack.com/api/chat.postMessage?token=${token}&channel=${
      data.userid
    }&icon_url=https://honesty.store/assets/android/icon@MDPI.png&username=honesty.store&text=${`Click to purchase your ${
      data.itemName
    }: https://honesty.store/item/${data.actualItemID}`}`
  )
    .then(response => {
      return response.json();
    })
    .catch(() => {
      return {ok: false};
    });

  return result;
});
