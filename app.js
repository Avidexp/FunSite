var twilio = require('twilio');
var mongoose = require('mongoose');
var accountSID = 'ACa804314545b940aa060e2903beb1c5f7';
var authToken = '635258184371aad208baa26928c9fc65';
var client = twilio(accountSID, authToken);
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyCoX-4Y_-a3weONO5cLlV1MitciE6PPkYw",
    authDomain: "smstext-dba7f.firebaseapp.com",
    databaseURL: "https://smstext-dba7f.firebaseio.com",
    projectId: "smstext-dba7f",
    storageBucket: "smstext-dba7f.appspot.com",
    messagingSenderId: "43464244159"
};

var admin = require("firebase-admin");


admin.initializeApp({
    credential: admin.credential.cert("firebase-adminsdk-eq0o6@smstext-dba7f.iam.gserviceaccount.com"),
    databaseURL: "https://smstext-dba7f.firebaseio.com"
});

var database = firebase.database();
var ref = database.ref("users");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    exteneded: true
}));
// twilio.twiml.MessagingResponse



var server = app.listen(3000, function() {
    console.log('listening on port %d', server.address().port);
});

var cronJob = require('cron').CronJob;

var twilioNumber = "9793530118";
var numbers = [];

ref.on('value', function(snapshot) {
    numbers.push(snapshot.getValue());
    console.log('Added number ' + snapshot.getValue());
});
var client = twilio(accountSID, authToken);
// var textJob = new cronJob('0 18 * * *', function() {
//     for (var i = 0; i < numbers.length; i++) {
for (var i = 0; i < numbers; i++) {
    client.messages.create({
        to: numbers[i],
        from: twilioNumber,
        body: 'This is a test :)'
    });
};

app.get('/message', function(req, res) {
    var resp = new twilio.twiml.MessagingResponse();
    if (req.body.Body.trim().toLowerCase() === 'subscribe') {
        var fromNum = req.body.From;
        if (numbers.indexOf(fromNum) !== -1) {
            resp.message('You already subscribed!');
        } else {
            resp.message('Thank you, you are now subscribed. Reply "STOP" to stop receiving updates.');
            usersRef.push(fromNum);
        }
    } else {
        resp.message('Welcome to Daily Updates. Text "Subscribe" receive updates.');
    };

    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(resp.toString());
});


/*
client.messages.create({
    to: '+19368707752',
    from: '+19793530118',
    body: 'This is a test, did it work?'
}, function(err, message) {
    if (err) {
        console.log(err);
    } else {
        console.log(message.sid);
    }
});

*/