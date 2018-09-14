# Configuring Firebase

## Setup

You will need to set up a new firebase project and enable the following features:

- Authentication (With Google and Email signin)
- Database (Firestore)
- Storage
- Hosting
- Functions

Note that you will not need to run `firebase init` as suggested during setup, because the project is already initialised with a .firebaserc file

## Configuration

## Environment variables

You should create a `.env` file in the project root according to the `.env.tmpl` file. This needs populating with your firebase project ID and API key. Instructions for doing so can be found in the [template file](../.env.tmpl). When building the application, these values will be compiled into the javascript.

(If successful, `npm start` will now get you to an error page within the app)

## Billing

The Firebase functions we use make API calls to slack. As this is an external network request, you will be required to enable billing on your firebase account and change your plan to the Blaze pay-as-you-go pricing plan (or better).

To do this for ScottLogic, you will need to gain access to ScottLogic's Billing account. See Chris Price or Colin Eberhardt for details.

### Storage

Storage rules will be automatically configured when you deploy the application to firebase (see below).

However, you will also need to configure the lifecycle and CORS settings.

To do so you must first install `gsutil` from [here](https://cloud.google.com/storage/docs/gsutil_install). Then, navigate to this directory in your terminal before running the following 2 commands:

Now you need to set up gsutil to use your account

Run 
```
$ gsutil config
$ gsutil config
```

And follow the instructions for logging in with your Google account and setting up a Cloud Platform.

Now add a new bucket for your hosting. This will be a s

```shell
{HONESTY_DIR}\firebase $ gsutil lifecycle set lifecycle.json gs://<YOUR_SNACKCHAT_LOCATION>
{HONESTY_DIR}\firebase $ gsutil cors set cors.json gs://<PROJECT_ID>.appspot.com
```

Note: The last command configures CORS to allow requests from any URL. This is useful for debugging purposes and running the front end locally but may not be desirable in production. You can modify [`cors.json`](cors.json) to allow specific domains if needed.

You will also need to update storage.rules to reference your buckets

```
  ...
  match /b/{SNACKCHAT_DIR}/o {
  ...
  match /b/{YOUR_PROJECT_ID}.appspot.com/o {
  ...
```

Storage is currently used to save the training data, evaluation data and snackchats (deleted after 24 hours)

### Authentication

For the purpose of authenticating the kiosk to make calls to our firebase functions, you should create an Email/Password user account.

Note down the UID of this user for configuring functions in the next step.

### Functions

In order to set the environment variables for your firebase functions you will need to install the `firebase-tools` package from npm by using the following command:

```shell
$ npm install -g firebase-tools
```

Then, using you kiosk account UID from the previous step, along with a Slack legacy token which can be generated [here](https://api.slack.com/custom-integrations/legacy-tokens#legacy-info) run the following 2 commands:

You will also need to run:
```
{HONESTY_DIR}\functions $ npm install
{HONESTY_DIR}\functions $ firebase use {PROJECT_NAME}
```

to initialise the firebase-functions module and set up your target

Now run the following

```shell
{HONESTY_DIR}\functions $ firebase functions:config:set honestystore.uid=KIOSK_ACCOUNT_UID
{HONESTY_DIR}\functions $ firebase functions:config:set slack.token=SLACK_TOKEN
{HONESTY_DIR}\functions $ firebase functions:config:set slack.storageurl=SLACK_STORAGE_URL
```

### Database

The database will require a short_and_black_list collection, which can simply be left empty.

It is used to track training data. There is no way of listing files in storage so each entry keeps track of one image. To add or remove users from the slack short/black lists, use the slack_users collection. To give people admin/kiosk privileges add the relevant Boolean flags to the document titled with their UID in users collection. When users is updated a cloud function is triggered to update the [custom claims](https://firebase.google.com/docs/auth/admin/create-custom-tokens) of that user, so don't store too much information here. Custom claims is what handles the firebase and storage rules.

### Deployment

To upload the correct 

```
{HONESTY_DIR} $ firebase deploy
```