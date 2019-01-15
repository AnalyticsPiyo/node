'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const req = require('request');

// Intentのアクション名を指定
const NAME_ACTION = 'hello';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const app = new App({request, response});

    function helloHandller(app) {
        // 
        app.ask('Hello World');
    }

    let actionMap = new Map();
    actionMap.set(NAME_ACTION, helloHandller);
    actionMap.set(AREA_SPECIFIC_ACTION, areaSpecificHandller);

    app.handleRequest(actionMap);
});