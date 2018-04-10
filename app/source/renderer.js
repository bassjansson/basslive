// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Require basslive engine
const engine = require('basslive-engine')

// Test the engine
document.write(engine.printHelloWorld())
