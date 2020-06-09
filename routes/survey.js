var express = require('express');
const http = require('http');
var cors = require('cors');

var router = express.Router();

var c = require('../config.json');
var dbinfo = c.mongoDBinfo;


const dbHostname = "104.197.184.233";
const dbPort = 3001;
const dbPath = "/db";
/*const dbHostname = dbinfo.dbHost;
const dbPort = dbinfo.dbPort;
const dbPath = dbinfo.dbPath;*/


QUESTIONS={
    1: "1. Responsiveness: how responsive the game is"
};


router.get('/:playerName/:ping/:point/:totalTime/:code', function(req, res){
    /*console.log(req.params.ping);
    console.log(req.params.point);
    console.log(req.params.totalTime);*/
    //console.log(req);
    res.render('question', { title: 'Survey', playerName: req.params.playerName, ping:req.params.ping, point: req.params.point,  totalTime:req.params.totalTime, code:req.params.code, questions:QUESTIONS});
});

router.post('/:playerName/:ping/:point/:totalTime/:code', function(req, res){

    //var result = {"ping": req.params.ping, "point": req.params.point, "remoteTime": new Date(), "clientIP":req.headers['x-forwarded-for'] || req.connection.remoteAddress, "agent":req.get('user-agent')};
    var result = JSON.parse(JSON.stringify(req.body));
    //console.log(result);

    result.userId = req.params.playerName;
    result.ping = req.params.ping;
    result.point = req.params.point;
    result.totalTime = req.params.totalTime;
    result.remoteTime = new Date();
    result.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    result.agent = req.get('user-agent');
    console.log(global.code);
    result.code = req.params.code;
    //console.log('two');
    // console.log(req);
    // console.log(req.get('user-agent'));

    var post_data = JSON.stringify(result);
    //console.log(post_data);
    var post_options = {
        hostname: dbHostname,
        port: dbPort,
        path: dbPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            // console.log('Response: ' + chunk);
            res.redirect('/');
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

});

router.get('/speedtest', function(req, res){
    // console.log("req:"+req);
    res.sendStatus(200);
});



module.exports = router;
