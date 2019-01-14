//
// @author: hideyuki.takase
// @date: Api 2018
//

// init project pkgs
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
// setting subscriptionkey を入れる
const subscriptionKey = '*******';
const host = 'https://api.chatwork.com';
const path = '/v2/rooms/';
var headers = {
  'X-ChatWorkToken' : subscriptionKey
}

app.use(bodyParser.json({type: 'application/json'}));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Handle webhook requests
app.post('/', function(req, res, next) {
  // Debug
  console.log("room_id：" + req.body.webhook_event.room_id)
  console.log("account_id：" + req.body.webhook_event.account_id)
  console.log("body：" + req.body.webhook_event.body)
  console.log("message_id：" + req.body.webhook_event.message_id)
  // -----

  roomId = req.body.webhook_event.room_id
  messageId = req.body.webhook_event.message_id
  
  if (1==0) { return; }
  
  // 条件によって返答文を作成
  if (1==1) {
    message = "hello world"
  } else {
  // 返答を受け取る
    message = hentou(req.body.webhook_event.body)
  }
  
  var options = {
    url: host + path + roomId + '/messages',
    json: true,
    headers : headers,
    form: { body: message },
    json: true
  };
    
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }else{
      console.log('error: '+ response.statusCode);
    }
  });

})

// Listen for requests.
let server = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on ' + JSON.stringify(server.address()));
});

// 返答を作成する関数部分
function hentou(me) {
  // 返したい内容を記述
  return message
}