// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Require the server
const server = require('./server')

// Require basslive engine
const engine = require('basslive-engine')

// Test the engine
document.write(engine.printHelloWorld())
