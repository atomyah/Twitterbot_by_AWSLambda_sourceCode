const Twitter = require('twitter');

// ツイッターのキーとシークレットトークンを初期化（環境変数を使用）
const twitter = new Twitter({
    consumer_key: process.env['CONSUMER_KEY'],
    consumer_secret: process.env['CONSUMER_SECRET'],
    access_token_key: process.env['ACCESS_TOKEN_KEY'],
    access_token_secret: process.env['ACCESS_TOKEN_SECRET']
   })


exports.handler = (event, context, callback) => {
    console.log('eventは　' + JSON.stringify(event))
    var body = event;
    if(body.follow_events){
        let follower = body.follow_events[0].source.id;
        let screenName = body.follow_events[0].source.screen_name;
        console.log('フォロワーのIDは、' + follower)
        console.log('フォロワーのscreenNameは、' + screenName)
        //フォロワーが自分自身でない場合のみフォローバック
        if (follower != process.env['MYSELF']) {
            let param = { user_id: follower }
            twitter.post('friendships/create', param, function(err, tweet, response) {
                if(err){
                    return err;
                }else{
                    console.log('------------フォロワー情報-------------')
                    console.log(tweet)
       
                    tweetRep('@' + screenName + ' さん、フォローありがとうございます！')
                }
            })
        }
    }
};


// フォローありがとうございます返信リプ用の関数
function tweetRep(arg) {
    twitter.post('statuses/update', {status: arg}, function(err, tweet, response) {
      if(err) {
        return console.log(err)
      }else{
        return console.log('------------返信リプ内容-------------' + JSON.stringify(tweet, undefined,"\t"))
      }
    })
}