exports.handler = async(event, context, callback) => {
    // パラメータのcrc_token取得
    var response_token = null;
    if (event.queryStringParameters){
        var crc_token = event.queryStringParameters.crc_token;

        // ハッシュ化
        var crypto = require('crypto');
        var hmac = crypto.createHmac('sha256', process.env['CONSUMER_SECRET']).update(crc_token).digest('base64');
        console.log(`receiving crc check. token=${crc_token} res=${hmac}`)
        var calculatedSignature = 'sha256=' + hmac;
        response_token = calculatedSignature;
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify({'response_token': response_token}),
    };
    return response;
};