# Configuring Firebase

## Setup

You will need to set up a new firebase project and enable the following features:

- Hosting
- Functions
- Storage
- Database (Firestore)

## Configuration

Storage rules, firestore rules and firestore indexes will be automatically configured when you deploy the application to firebase. However, you will also need to configure the lifecycle and CORS on the storage instance. To do so you must first install `gsutil` from [here](https://cloud.google.com/storage/docs/gsutil_install). Then, navigate to this directory in your terminal before running the following 2 commands:

```shell
$ gsutil lifecycle set lifecycle.json gs://<PROJECT_ID>.appspot.com
$ gsutil cors set cors.json gs://<PROJECT_ID>.appspot.com
```

Note: The last command configures CORS to allow requests from any URL. This is useful for debugging purposes and running the front end locally but may not be desirable in production. You can modify `[cors.json](cors.json)` to allow specific domains if needed.

## Billing

The Firebase functions we use make API calls to slack. As this is an external network request, you will be required to enable billing on your firebase account and change your plan to the Blaze pay-as-you-go pricing plan (or better).

## Environment variables

You should create a `.env` file in the project root according to the `.env.tmpl` file. This needs populating with your firebase project ID and API key. Instructions for doing so can be found in the [template file](../.env.tmpl).
