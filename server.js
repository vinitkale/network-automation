// server.js
// load the things we need
var express = require('express');
var SSH = require('simple-ssh');
var Client = require('ssh2').Client;
var bodyParser = require("body-parser");
var formidable = require("formidable");
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// use res.render to load up an ejs view file

// index page 
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/ssh', function (req, res) {

    var arrmixFormData = req.body;

    var conn = new Client();
    conn.on('ready', function () {
        console.log('Client :: ready');
        conn.exec(arrmixFormData.commond, function (err, stream) {
            if (err) throw err;
            stream.on('close', function (code, signal) {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
            }).on('data', function (data) {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', function (data) {
                console.log('STDERR: ' + data);
            });
        });
    }).connect({
        host: arrmixFormData.host,
        port: 22,
        username: arrmixFormData.username,
        password: arrmixFormData.password,
        algorithms: {
            cipher: [
                'aes128-ctr',
                'aes192-ctr',
                'aes256-ctr',
                'aes128-gcm',
                'aes128-gcm@openssh.com',
                'aes256-gcm',
                'aes256-gcm@openssh.com',
                'aes256-cbc'
            ]
        }
    });
});

// about page 
app.get('/about', function (req, res) {
    res.render('pages/about');
});

app.listen(8080);
console.log('8080 is the magic port');