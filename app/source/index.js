// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// Require basslive engine
const engine = require('basslive-engine')

// Test the engine
document.write(engine.printHelloWorld())


// Require the server and socket.io
const server = require('./server')
const io = require('socket.io')(server)

// Listen to clients connecting via socket
io.on('connection', socket =>
{
    console.log('[Socket] A client connected with socket ID: ', socket.id)

    // To listen to a socket event
    socket.on('client-hello', message => document.body.innerHTML += message)

    // To send a socket event
    socket.emit('host-hello', "<br/>Host says hello!")
})
