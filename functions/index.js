const functions = require('firebase-functions');
const fetch = require('node-fetch');
const queryString = require('query-string');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const HONESTY_STORE_LOGO = 'https://honesty.store/assets/android/icon@MDPI.png';
const BOT_USERNAME = 'honesty.store';
const authenticateUser = uid => {
  if (uid === functions.config().honestystore.uid) return Promise.resolve(true);
  return admin
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
    .then(doc => doc.data())
    .then(result => result.admin);
};

exports.sendSlackMessage = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth.uid).then(isAllowedAccsess => {
    if (isAllowedAccsess) {
      const token = functions.config().slack.token;
      const options = queryString.stringify({
        token,
        channel: data.userid,
        icon_url: HONESTY_STORE_LOGO,
        username: BOT_USERNAME,
        text: `Click to purchase your ${
          data.itemName
        }: https://honesty.store/item/${data.actualItemID}`
      });

      return fetch(`https://slack.com/api/chat.postMessage?${options}`)
        .then(response => response.json())
        .catch(() => ({ok: false}));
    } else {
      return {ok: false, error: 'No accsess to function'};
    }
  });
});

exports.loadSlackUsers = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth.uid).then(isAllowedAccsess => {
    if (isAllowedAccsess) {
      const token = functions.config().slack.token;
      return fetch(`https://slack.com/api/users.list?token=${token}`)
        .then(response => response.json())
        .catch(() => ({ok: false}));
    } else {
      return {ok: false, error: 'No accsess to function'};
    }
  });
});
