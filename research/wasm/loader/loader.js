// Loads the specified .wasm file
// Optional module imports as second argument
// Returns a promise that resolves to a WebAssembly.Instance
function loadWebAssembly(filename, imports = {})
{
    // Alert and return if we don't have WebAssembly support
    if (typeof WebAssembly !== 'object')
    {
        alert('You need a browser with WebAssembly support... :(')
        return
    }

    // Enable fetching of local files if we are running on Electron
    if (typeof process === 'object')
    {
        require('electron').webFrame.registerURLSchemeAsPrivileged('file')
    }

    // Fetch, compile and instanciate the WebAssembly module
    return fetch(filename)
        .then(response => response.arrayBuffer())
        .then(buffer => WebAssembly.compile(buffer))
        .then(module =>
        {
            imports.env = imports.env ||
            {}

            Object.assign(imports.env,
            {
                memoryBase: 0,
                tableBase: 0,
                memory: new WebAssembly.Memory(
                {
                    initial: 256,
                    maximum: 256
                }),
                table: new WebAssembly.Table(
                {
                    initial: 0,
                    maximum: 0,
                    element: 'anyfunc'
                })
            })

            return new WebAssembly.Instance(module, imports)
        })
}
