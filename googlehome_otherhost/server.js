// author：hideyuki.takase
// npm install
// https://www.npmjs.com/package/actions-on-google
// https://www.npmjs.com/package/firebase-functions?activeTab=readme

const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');

const {
  dialogflow,
  actionssdk,
  BasicCard,
  BrowseCarousel,
  BrowseCarouselItem,
  Button,
  Carousel,
  LinkOutSuggestion,
  List,
  MediaObject,
  Suggestions,
  Image,
  SimpleResponse,
} = require('actions-on-google');

const app = dialogflow({ debug: true});

exp = express();

// 単純ver
app.intent('*************', (conv) => {
  // 
  const test = conv.parameters['***********'];
  conv.data.test = test;

  //ask
  conv.ask('hello world');
});


// 複雑ver
app.intent('***********', (conv) => {
  
  // 
  const a11yText = 'Google Assistant Bubbles';

  // Google Home用(音声のみのデバイス用)
  if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
      conv.ask('<speak>'
        + 'hello world'
        + '<break time="1" />'
        + "</speak>");
    return;
  }

  /* スマホ用の処理  */
  conv.ask(new SimpleResponse({
    speech: '<speak>'
      + 'hello world'
      + '<break time="1" />'
      + "</speak>",
    text:'hello world'
  }));
  
  // BroeseCarousel作成部分
  testArr.push(
    new BrowseCarouselItem({
      title: 'testtitle',
      url: 'testurl',
      description: 'testdecription',
      image: new Image({
        url: 'testurl',
        alt: a11yText,
      }),
      footer: 'testfooter',
    }),
  )
  
  // BroeseCarousel の表示
  conv.ask(new BrowseCarousel({
    items: testArr,
  }));
  
  conv.ask(new Suggestions(['OK', 'NO']));

});

// 使用関数
/*
  どこかAPIをリクエストする場合はPromise を使用する必要がある
  ※Promiseに関してはよくわからない。。。
*/

function Test(conv) {
// Promiseを返す
  return (
    Promise.resolve(conv)
      .then(TestData)
      .then((result) => {
        console.log(result)
        conv.ask('Hello World');
        return;
      })
      .catch(err => {
        console.log('handleConversation', err);
        conv.ask('NG');
        return;
      })
  )
};

// APIにREQUESTしている関数
function TestData(conv) {
  return new Promise((resolve, reject) => {

    var options = {
      url: '**********',
      method: 'GET',
      json: true,
      qs: {
      }
    }
    console.log(options)
    request(options, (error, response, body) => {
        if (error) {
          reject('NG');
        } else {
          resolve(body);
        }
    });
  })
};
