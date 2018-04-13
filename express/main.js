'use strict'

// Require and create the server
const express = require('express')
const app = express()
const server = require('http').createServer(app)

// Serve the entire www directory
app.use(express.static('www'))

// Start listening on port 3000
server.listen(3000, () =>
    console.log('[Express] Listening on port: ', server.address().port))
