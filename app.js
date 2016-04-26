var vote_server = require('./lib/vote_server');
var kafka_consumer = require('./lib/kafka_consumer');
var kafka_producer = require('./lib/kafka_producer');
var http = require('http');
var express = require('express');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

if ('development' == app.get('env')) {
    app.use(errorHandler());
}

var server = http.createServer(app);
var port = (argv.port) ? argv.port : 3000;

server.listen(port);
voteServer = vote_server(server);

var groupId = (argv.groupid) ? argv.groupid : 'vote-server-group';
kafkaConsumer = kafka_consumer(voteServer, groupId);
kafkaProducer = kafka_producer(voteServer);

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}

process.on("SIGINT", function () {
    console.log('Shutting down');
    kafkaConsumer.close();
    kafkaProducer.close();
    process.exit();
});