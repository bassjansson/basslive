'use strict'

//====================================//
//========== Express Server ==========//
//====================================//

// Require and create the server
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const port = process.env.PORT || 3000

// Serve the public directory
app.use(express.static('source/public'))

// Start listening on the server port
server.listen(port, () =>
    console.log('[Server] Listening on port: ',
        server.address().port))


//===================================//
//========== Export Module ==========//
//===================================//

module.exports = server
