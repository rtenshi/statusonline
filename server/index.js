var app = require('express')();
var server = require('http').Server(app);
//var io = require('socket.io')(server)
var io = require('socket.io')(server, {path: '/rpg/socket.io'})
var fs = require('fs')

server.listen(12000)

console.log('Started')
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.get('/mestre', function (req, res) {
    res.sendFile(__dirname + '/mestre.html');
})

function getSavedChars(err, res) {
    if(err) {
        throw err
    }
    //return JSON.stringify(fs.readFileSync('chars.json').toString())
    return fs.readFileSync('chars.json').toString()
}

io
    .of('/socket')
    .on('connection', function(socket) {
    console.log('Client Connected')

    socket.emit('updateChars', getSavedChars().toString())
    console.log('socket',socket.id)
    socket.on('saveChars', function(data) {
        fs.writeFile('chars.json', data, function (err) {
            if (err) throw err;
            var date = new Date();
            console.log(date + ' : Chars updated.');
            console.log('socket',socket.id)
            socket.broadcast.emit('updateChars', data);
        })
    })
})
io.on('disconnect', function(socket) {
    console.log('Client disconnected')
})