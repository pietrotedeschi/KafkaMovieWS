var socketio = require('socket.io'),
    events = require('events'),
    _ = require('underscore'),
    Q = require('q');

module.exports = function (server) {

    //Allow the voteServer to emit events
    var EventEmitter = require('events').EventEmitter;

    var voteServer = {};

    voteServer.io = socketio.listen(server);

    voteServer.io.sockets.on('connection', function (socket) {

        socket.on('message', function (message) {
            voteServer.sendVote(socket, message);
        });
    });

    voteServer.sendVote = function (socket, message) {

        var newVote = {
            movieid: message.movieid,           
            rating : message.rating
        };

        this.emit('sendVote', newVote);
    };

    voteServer.broadcast = function (message) {
        //this.io.to(message.room.name).emit('message', message);
        this.io.emit('message', message);
    };

    EventEmitter.call(voteServer);
    _.extend(voteServer, EventEmitter.prototype);

    return voteServer;
};