'use strict'

/*
 *  Loads specific host and/or client scripts.
 */

if (typeof require === 'function')
{
    require('../host')
}
else
{
    function loadScript(src, onload = null)
    {
        let script = document.createElement('script')
        script.src = src
        script.onload = onload
        document.head.appendChild(script)
    }

    loadScript('/socket.io/socket.io.js', () => loadScript('client.js'))
}
