//
// @author: hideyuki.takase
// @date: Api 2018
//


// init project pkgs
const express = require('express');
const ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
const bodyParser = require('body-parser');
const request = require('request');
const FeedParser = require('feedparser');
const app = express();
const Map = require('es6-map');

// Declare constants for your action and parameter names
const NAME_ACTION = 'hello';

// Pretty JSON output for logs
const prettyjson = require('prettyjson');
const toSentence = require('underscore.string/toSentence');

app.use(bodyParser.json({type: 'application/json'}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Handle webhook requests
app.post('/', function(req, res, next) {
    
  // Instantiate a new API.AI assistant object.
  const assistant = new ApiAiAssistant({request: req, response: res});
  
  // 
  function helloHandller(assistant) {
        assistant.ask('Hello World');
  }


  // Add handler functions to the action router.
  let actionRouter = new Map();
  actionRouter.set(NAME_ACTION, helloHandller);
  
  // Route requests to the proper handler functions via the action router.
  assistant.handleRequest(actionRouter);
});

// Handle errors.
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Oppss... could not check the price');
})

// Listen for requests.
let server = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on ' + JSON.stringify(server.address()));
});