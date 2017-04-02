var app = require('express')();
var server = require('http').Server(app);
//var io = require('socket.io')(server)
var io = require('socket.io')(server, {path: '/rpg/socket.io'})
var fs = require('fs')
var path = require('path')

server.listen(12000)

console.log('Started')
/*
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})
app.get('/mestre', function (req, res) {
    res.sendFile(__dirname + '/mestre.html')
})
*/

function getSavedChars(err, res) {
    if(err) {
        throw err
    }
    return fs.readFileSync(__dirname+'/chars.json').toString()
}
var clients = 0;
io
    .of('/socket')
    .on('connection', function(socket) {
        clients++;
        var date = new Date();
        console.log(date + ' : Client Connected ('+clients+')')
        socket
            .emit('updateChars', getSavedChars().toString())
            .broadcast.emit('clients', clients)
            .on('saveChars', function(data) {
                fs.writeFile(__dirname+'/chars.json', data, function (err) {
                    if (err) throw err;
                    var date = new Date();
                    console.log(date + ' : Chars updated.')
                    socket.broadcast.emit('updateChars', data)
                })
            })
            .on('disconnect', function() {
                clients--
                var date = new Date();
                socket.broadcast.emit('clients', clients)
                console.log(date + ' : Client Disconnected ('+clients+')')

            })
    })