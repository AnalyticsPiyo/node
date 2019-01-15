# node app の簡易template一覧
## chatbot_microsoft_luis
- descroption<br>
microsfot製のchatbot
- environment<br>
Azure、LUIS
- memo<br>
verが古くて現状は動かないかも<br>
node_modules がないのでinstallする必要がある。<br>
## chatwork-bot_ibm
- descroption<br>
chatwork のbot
- environment<br>
IBM bluemix
- memo<br>
発信内容、発信者によって返答に内容を変えれる。<br>
実際には内容によって自動転送まで行っていた。<br>
node_modules がないのでinstallする必要がある。<br>
## googlehome_ibm
- descroption<br>
googlehome app
- environment<br>
IBM bluemix、express
- memo<br>
versionが古くて動かない可能性がある。<br>
実際にはmicrosoftのapiを経由してニュースを取得したりした。<br>
node_modules がないのでinstallする必要がある。<br>
## line-bot_images_ibm
- descroption<br>
lineをインターフェースに顔の画像を投稿すると性年代を返答
- environment<br>
IBM bluemix、express、line、IBM watson、cloudera
- memo<br>
DBに画像データの格納など結構色々やっている<br>
セッションのつなげ方がわからず、会話フローになっていない<br>
node_modules がないのでinstallする必要がある。<br>
## demo-api_ibm
- descroption<br>
test用にapiサーバーを構築
- environment<br>
IBM bluemix、express
- memo<br>
requestを投げると何かを返してくれる<br>
node_modules がないのでinstallする必要がある。<br>


