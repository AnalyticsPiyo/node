
var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/v1/messages', connector.listen());

//=========================================================
// IntentDialogオブジェクトの用意
//=========================================================


var url = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/' + process.env.luisId
    + '?subscription-key=' + process.env.luisSubscriptionKey + '&timezoneOffset=540&verbose=true&q=';


// 認識に指定するLUIS APIのURLを指定
var recognizer = new builder.LuisRecognizer(url);

// IntentDialogオブジェクトを作成
var intents = new builder.IntentDialog({
  recognizers: [recognizer]
});


//=========================================================
// 会話の処理
//=========================================================

// 初期ダイアログを、intentDialogとして使用する
bot.dialog('/', intents);

// インテントと処理の結びつけ
intents
    .matches('hello world', function (session, args) {
        // インテントが 'hello world' だったときの処理をここに記述します。
        session.send('hello world');
    })

//i cant understand
intents.onDefault(
function(session, args) {
session.send('Oooups.......')
});
