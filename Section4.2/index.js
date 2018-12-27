const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const util = require('util');
const Twitter = require('twitter');


// ツイッターのキーとシークレットトークンを初期化（環境変数を使用）
const twitter = new Twitter({
    consumer_key: process.env['CONSUMER_KEY'],
    consumer_secret: process.env['CONSUMER_SECRET'],
    access_token_key: process.env['ACCESS_TOKEN_KEY'],
    access_token_secret: process.env['ACCESS_TOKEN_SECRET']
  })



exports.handler = function (event, context) {

    // DynamoDBのtipsテーブルをScanしItem総数を得て、Math.floor(Math.random() * length)で総数内のランダムな整数を獲得
    let params = {
        TableName: 'tips',
        Select: "COUNT" // アイテム総数を返すパラメーター。コマンドであれば`aws dynamodb scan --table-name tips --select COUNT`
    };

    docClient.scan(params, function(err, data){
        if(err){
              console.log(err);
        }else{
            console.log('docClient.scan中');
            console.log('Scanデータは　' + util.inspect(data,false,null));  //Scanデータは　{ Count: 16, ScannedCount: 16 }
            console.log('data["Count"]は　' + data["Count"]); //data["Count"]は　16
            let length = data["Count"];
            let randomNum = Math.floor(Math.random() * length);
            console.log('randomNumは　' + randomNum); // randamNumは 3
            callTipAndTweet(randomNum);
        }
    });

    // ランダム整数を引数にtipsテーブルからランダムにTip文字列を獲得、それをツイート
    function callTipAndTweet(arg){
        let randomNum = arg;
        let params = {
            TableName: 'tips',
            Key: {                   // SQLのwhere条件文にあたるパラメーター。Keyの'K'は大文字であることに注意！
                'ID': randomNum
            }
        };
        docClient.get(params, function(err,data) {
            if(err){
                console.log(err);
            }else{
                console.log('docClient.get中')
                let result = JSON.stringify(data.Item)
                console.log('data.Itemは　' + result);    //data.Itemは　{"ID":3,"Tip":"欧米人の30パーセントしか肉を食べない日本人には卵3個、肉200g、プロテイン20gを二回が最優先事項です"}
                result = JSON.parse(result);            
                console.log('Tip文字列は　'　+ result.Tip); //Tip文字列は　欧米人の30パーセントしか肉を食べない日本人には卵3個、肉200g、プロテイン20gを二回が最優先事項です

                // ツイート自動投稿
                twitter.post('statuses/update', {status: result.Tip}, (err, tweet, response)=> {
                    if(err) {
                        return console.log(err)
                    }else{
                        return console.log(tweet)
                    }
                })
            }
        })
    }
}