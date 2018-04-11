'use strict'

//================================//
//========== Page Setup ==========//
//================================//

// Initialize socket to server
const socket = io()

// To listen to a socket event
socket.on('host-hello', message => document.body.innerHTML += message)

// To send a socket event
socket.emit('client-hello', "<br/>Client says hello!")
