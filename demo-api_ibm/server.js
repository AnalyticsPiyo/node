//
// @author: hideyuki.takase
// @date: June 2018
//

// init project pkgs
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 3000;
var router = express.Router();

app.post('/', function(req, res) {


// ここにif文の処置を記述して疑似APIを作成
  var param = {
    "value":status
  }
  res.header('Content-Type', 'application/json; charset=utf-8')
  res.send(param);
});

app.listen(port);