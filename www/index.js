if (typeof process === 'object')
{
    require('electron').webFrame.registerURLSchemeAsPrivileged('file')
}

WebAssembly.instantiateStreaming(fetch('doubler.wasm'))
    .then(result => console.log("Doubling 10: ", result.instance.exports._doubler(10)))
