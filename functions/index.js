const functions = require('firebase-functions');
const request = require('request-promise-native');
const crypto = require('crypto');
const fs = require('fs');
const toBuffer = require('data-uri-to-buffer');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const BOT_AVATAR = 'https://honesty.store/assets/android/icon@MDPI.png';
const BOT_USERNAME = 'honesty.store';
const BOT_COLOR = '#0a3d5f';

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

const sendReminder = (user, itemName, itemId, imageUrl = null) => {
  const req = {
    url: 'https://slack.com/api/chat.postMessage',
    auth: {bearer: functions.config().slack.token},
    json: true,
    body: {
      channel: user,
      username: BOT_USERNAME,
      icon_url: BOT_AVATAR,
      text: `Hey there, here is a SnackChat reminder for your ${itemName}!`,
      attachments: [
        {
          fallback: `You can pay for your snack here: https://honesty.store/item/${itemId}`,
          color: BOT_COLOR,
          actions: [
            {
              type: 'button',
              text: 'Pay for snack (60p)',
              url: `https://honesty.store/item/${itemId}`
            }
          ]
        },
        imageUrl === null
          ? undefined
          : {
              fallback: 'Your SnackChat Reminder',
              title: 'Your SnackChat Reminder',
              color: BOT_COLOR,
              image_url: imageUrl
            }
      ]
    }
  };
  return request.post(req);
};

exports.sendSlackMessage = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth, () =>
    sendReminder(data.userid, data.itemName, data.actualItemID)
  );
});

exports.sendSnackChat = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth, () => {
    const tempFileName = '/tmp/snackchat.jpg';
    const fileName = `snackchat/${crypto.randomBytes(20).toString('hex')}.jpg`;
    const bucket = admin.storage().bucket();

    fs.writeFileSync(tempFileName, toBuffer(data.snackChat));
    return bucket
      .upload(tempFileName, {
        destination: fileName
      })
      .then(() => {
        fs.unlinkSync(tempFileName);
        return sendReminder(
          data.userid,
          data.itemName,
          data.actualItemID,
          'https://firebasestorage.googleapis.com/v0/b/' +
            `${bucket.name}/o/${encodeURIComponent(fileName)}` +
            '?alt=media'
        );
      });
  });
});

exports.loadSlackUsers = functions.https.onCall((data, context) => {
  return authenticateUser(context.auth, () => {
    const req = {
      url: 'https://slack.com/api/users.list',
      auth: {bearer: functions.config().slack.token},
      json: true
    };

    return request.get(req);
  });
});
