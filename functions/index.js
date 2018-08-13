const functions = require('firebase-functions');
const request = require('request-promise-native');
const toBuffer = require('data-uri-to-buffer');
const fs = require('fs');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const authenticateUser = (auth, success) => {
  if (!auth)
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be authenticated to use this function'
    );

  if (auth.uid === functions.config().honestystore.uid) return success();
  return admin
    .firestore()
    .collection('users')
    .doc(auth.uid)
    .get()
    .then(doc => {
      if (!doc.data() || !doc.data().admin) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'You must be authenticated to use this function.'
        );
      } else {
        return success();
      }
    });
};

exports.sendSlackMessage = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth, () => {
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
  });
});

exports.sendSnackChat = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth, () => {
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
});

exports.loadSlackUsers = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth, () => {
    const token = functions.config().slack.token;
    const options = {
      auth: {bearer: token},
      json: true
    };

    return request.get('https://slack.com/api/users.list', options);
  });
});
