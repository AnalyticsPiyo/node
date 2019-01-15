
require('dotenv').load();

const Cloudant = require('@cloudant/cloudant');
const line = require('@line/bot-sdk');
const express = require('express');
const fs = require('fs');
const path = require('path');
const request = require('request');
const util = require('util');
const watson = require('watson-developer-cloud');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

const cloudant = Cloudant({account:'****', password:"****"});
var db = cloudant.db.use('****');


// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

const app = express();


app.use(express.static('public'));

app.get("/callback", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});


/****************メイン処理****************/
function handleEvent(event) {
  console.log("----")
  console.log(event.message.text)
  console.log("----")
  console.log(event.source.userId)
  
  // あんまりきれいな書き方ではないが、画像だった時
  if (event.message.type == 'image') {
    console.log('send image!')
    return handleImage(event.message, event.replyToken, event.source.userId, event.timestamp);
  }
    
  // テキストではなかったとき
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  
  /****************Conversation API****************/
  var conversation = watson.conversation({
    username: process.env.ASSISTANT_USERNAME,
    password: process.env.ASSISTANT_PASSWORD,
    version: 'v1',
    version_date: '2017-05-26'
  });
  
  // データの格納、ID、text、timestanp
  db.insert({ uid: event.source.userId , text: event.message.text, timestamp: event.timestamp}, function (er, result) {
    if (er) {
        console.log("DB Access Error!!!");
    } else {
        console.log("Write Success Result: %s", JSON.stringify(result));
    }
  });     
  
  conversation.message({
    workspace_id: process.env.WORKSPACE_ID,
    input: {
      "text": event.message.text
    }
  },
    function (err, response) {
      if (err) {
        console.log('error:', err);
      } else {
        responseMessage = response.output.text[0];
        console.log("-----")
        console.log(response)

        /****************LINEbotサーバー****************/ 

        // 返信用のメッセージ作成
        const echo = { type: 'text', text: responseMessage};

        // use reply API
        if (event.replyToken == "00000000000000000000000000000000") {
          // テスト接続時
        } else {
          return client.replyMessage(event.replyToken, echo);
        }
      }
    }
  );
}

// listen on port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});


/****************イメージだった時****************/
function handleImage(message, replyToken, uid, timestamp) {
  const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.jpg`);
  const previewPath = path.join(__dirname, 'downloaded', `${message.id}-preview.jpg`);
  
  const options = {
      url: `https://api.line.me/v2/bot/message/${message.id}/content`,
      method: 'get',
      headers: {
          'Authorization': 'Bearer ' + process.env.CHANNEL_ACCESS_TOKEN,
      },
      encoding: null
  };
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      //保存

      console.log("-- OK --");
      db.multipart.insert({uid: uid, timestamp: timestamp}, [{name : message.id + '.jpeg', data : new Buffer(body), content_type:'image/jpeg'}], message.id, function (er, result) {
        
        if (er) {
            console.log("DB Access Error!!!");
            console.log(er);
        } else {
          console.log("Write Success Result: %s", JSON.stringify(result));

          var visualRecognition = new VisualRecognitionV3({
            version: '2018-03-19',
            iam_apikey: '****'
          });
          
          var params = {
            url: `****${message.id}/${message.id}.jpeg`
          };
          visualRecognition.detectFaces(params, function(err, response) {
            if (err) {
              console.log(err);
              return client.replyMessage(replyToken, { type: 'text', text: "画像認識に失敗している"});
            } else {
              console.log(JSON.stringify(response, null, 2))
              
              if (response.images[0].faces.length == 0) {
                rep_text = `これは人の顔ではないピヨね！！`              
              } else {
                min_age = response.images[0].faces[0].age.min
                max_age = response.images[0].faces[0].age.max
                gender = response.images[0].faces[0].gender.gender.replace("FEMALE", "女性").replace( "MALE", "男性" );
                rep_text = `piyoの予想では・・・\n${min_age}～${max_age}歳くらいの${gender}ピヨね！`
              }
              return client.replyMessage(replyToken, { type: 'text', text: rep_text});
            }
          });
        }
      }); 
    } else {
      return client.replyMessage(replyToken, { type: 'text', text: "LINEの画像取得に失敗しているぞ"});
    }
  });
}

