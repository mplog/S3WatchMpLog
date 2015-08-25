var aws = require('aws-sdk');
var s3 = new aws.S3({apiVersion: '2006-03-01'});

var async = require('async');
var request = require('request');

const TIMEOUT = 30;
const SLACK_CHANNEL = '#sample-channel';
const SLACK_TEXT_PREFIX = ":thumbsdown: What's this heavy query? :thumbsdown:\n";
const SLACK_URL = 'https://hooks.slack.com/services/xxxxxxx/xxxxxxx/xxxxxxx';

exports.handler = function (event, context) {
    // Get the object from the event and show its content type
    var bucket = event.Records[0].s3.bucket.name;
    var key    = event.Records[0].s3.object.key;
    var size   = event.Records[0].s3.object.size;
    console.log('Getting object s3://' + bucket + '/' + key);
    if ( size === 0 ) {
        console.log('S3WatchMpLog skipping object of size zero');
        context.done(null,'');
    }

    s3.getObject({Bucket:bucket, Key:key}, function (err, data) {
        if (err) {
            console.log('Can not getting object: ' + err);
            context.done(null,'');
        }

        var message = "";
        var str = data.Body.toString("utf8", 0, data.Body.length);
        var items = str.split("\n");
        async.each(items, function (item, callback) {
            if (item !== "") {
                var obj = JSON.parse(item);
                if (obj.command !== "Sleep" && obj.duration >= TIMEOUT) {
                    message += '```'
                        + 'id: '    + obj.id    + '\n' + 'date: '     + obj.date      + '\n'
                        + 'user: '  + obj.user  + '\n' + 'db: '       + obj.db        + '\n'
                        + 'host: '  + obj.host  + '\n' + 'duration: ' + obj.duration  + '\n'
                        + 'state: ' + obj.state + '\n' + 'info: '     + obj.info      + '\n'
                        + '```' + '\n';
                }
            }

            if ( (items.indexOf(item) + 1) === items.length && message !== "") {
                callback(message);
            } else if ( (items.indexOf(item) + 1) === items.length) {
                console.log('No warnings query');
                context.done(null,'');
            }
        }, function (message) {
            var slackOption = {
                "channel": SLACK_CHANNEL,
                "username": "mplogbot", 
                "text": SLACK_TEXT_PREFIX + message,
                "icon_emoji": ":ghost:"
            };
            request.post(SLACK_URL, {form: {payload: JSON.stringify(slackOption)}})
            .on('response', function(response) {
                console.log('push to slack response: ' + JSON.stringify(response));
                context.done(null,'');
            });
        });
    });
};