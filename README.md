# honesty.store Kiosk  [![Build Status](https://travis-ci.com/bin-nuance-bat/project.svg?branch=master)](https://travis-ci.com/bin-nuance-bat/project)

[Live Demo](https://honesty-store-kiosk.firebaseapp.com/)

The honesty.store Kiosk is a mobile interface designed for use with [honesty.store](https://honesty.store) as a way to receive additional product info and receive friendly reminders to pay for products via Slack. This process is designed to be as seamless as possible by using a machine-learning model to identify what product you are holding in front of the device camera.

## Getting started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) - Used as the development environment
- [Python 3](https://www.python.org/) - Used for training the ML model
- [Training Images](https://drive.google.com/file/d/1McKowbhswZ82eTOEzn_7B0UPZFNwBNZA/view?usp=sharing) - Fed into the ML model
- A device and web browser with WebGL support

### Installation

First clone the repo to your local machine and navigate to the project root.

```
$ git clone https://github.com/bin-nuance-bat/project honesty-store-kiosk
$ cd honesty-store-kiosk
```

Then install dependencies with `npm`

```
$ npm install
```

## Testing

In order to run automated unit tests within node.js you can use the `npm test` command at the project root. You can also start a local development server to view the resulting app in your browser.

```
$ npm start
```

## Deployment

In order to deploy the app for production you will want to create a compiled build.

```
$ npm run build
```

This will generate a production build in the `build/` directory. Simply deploy everything in this directory to a web server (for example, we use [Google Firebase](https://firebase.google.com/) hosting) and access `/index.html` to use the app.

## Built With

- [honesty.store](https://honesty.store) - The original app that our project aims to extend
- [TensorFlow](https://www.tensorflow.org/) - Open source machine learning framework for training ML models
- [TensorFlow.js](https://js.tensorflow.org/) - Used to deploy the ML models in the browser
- [Google Firebase](https://firebase.google.com/) - App hosting provider used for deployment
- [Travis CI](https://travis-ci.org/) - For automated integration, testing and deployment
- [React](https://github.com/facebook/react) - Javascript library for building the UI
- [Enzyme](https://github.com/airbnb/enzyme) - Javascript library for testing the UI
- [Redux](https://github.com/reduxjs/redux) - Javascript library to manage the app's state
- [Prettier](https://github.com/prettier/prettier) - Used to format the javascript all pretty

## Authors

- Will Caine - [@cainy393](https://github.com/cainy393)
- Isaac Lapworth - [@isaac-lapworth](https://github.com/isaac-lapworth)
- Gurveer Arora - [@HelloUniverseNo31415](https://github.com/HelloUniverseNo31415)

Also see the project [contributors] for a full list of participants in this project.

## License

This project is licensed under the MIT License - see [LICENSE.md](https://github.com/bin-nuance-bat/project/blob/master/LICENSE.md) for more details.

## Acknowledgements 

- [Paul Hands](https://github.com/paulhands) - Project Management
- [Chris Price](https://github.com/chrisprice) - Creator of honesty.store
- [Craig Ayre](https://github.com/craigayre) - Tech Support
- [Emma Clennett](https://github.com/eclennett) - Tech Support