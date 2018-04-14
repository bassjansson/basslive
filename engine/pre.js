'use strict'

// Enable fetching of local files if we are running on Electron
if (typeof process === 'object')
    require('electron').webFrame.registerURLSchemeAsPrivileged('file')
