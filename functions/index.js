const functions = require('firebase-functions');
const request = require('request-promise-native');
const toBuffer = require('data-uri-to-buffer');
const fs = require('fs');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const authenticateUser = uid => {
  if (uid === functions.config().honestystore.uid) return Promise.resolve(true);
  return admin
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
    .then(doc => doc.data() && doc.data().admin);
};

exports.sendSlackMessage = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth.uid).then(isAllowedAccsess => {
    if (isAllowedAccsess) {
      const token = functions.config().slack.token;

      const options = {
        auth: {bearer: token},
        json: true,
        body: {
          channel: data.userid,
          as_user: true,
          text: `Click to purchase your ${
            data.itemName
          }: https://honesty.store/item/${data.actualItemID}`
        }
      };

      return request.post('https://slack.com/api/chat.postMessage', options);
    } else {
      throw new functions.https.HttpsError(
        'permission-denied',
        'You must be authenticated to use this function.'
      );
    }
  });
});

exports.sendSnackChat = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth.uid).then(isAllowedAccsess => {
    if (isAllowedAccsess) {
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
    } else {
      throw new functions.https.HttpsError(
        'permission-denied',
        'You must be authenticated to use this function.'
      );
    }
  });
});

exports.loadSlackUsers = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth.uid).then(isAllowedAccsess => {
    if (isAllowedAccsess) {
      const token = functions.config().slack.token;
      const options = {
        auth: {bearer: token},
        json: true
      };

      return request.get('https://slack.com/api/users.list', options);
    } else {
      throw new functions.https.HttpsError(
        'permission-denied',
        'You must be authenticated to use this function.'
      );
    }
  });
});
