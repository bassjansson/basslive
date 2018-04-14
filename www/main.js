// Audio buffer constants
const BUFFER_SIZE = 256
const INPUT_CHANNEL_COUNT = 2
const OUTPUT_CHANNEL_COUNT = 2

// Audio buffers
let inputAudioBuffer
let outputAudioBuffer

// Create an AudioContext
let audioContext = new AudioContext()

// Create a ScriptProcessorNode
let scriptProcessorNode = audioContext.createScriptProcessor(
    BUFFER_SIZE, INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT)

// Create a MediaStreamSource
let microphoneNode

function initMicrophoneNode()
{
    navigator.mediaDevices.enumerateDevices()
        .then(devices => console.log("Media devices: ", devices))
        .catch(error => console.log("Media devices error: ", error))

    navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia

    navigator.getUserMedia(
        {
            audio: true,
            video: false
        },
        (stream) =>
        {
            microphoneNode = audioContext.createMediaStreamSource(stream)
            microphoneNode.connect(scriptProcessorNode)
        },
        (error) =>
        {
            console.log("navigator.getUserMedia() failed!")
            console.log(error)
        })
}
initMicrophoneNode()

// Initialize audio processing
Module.onRuntimeInitialized = function()
{
    console.log('Engine loaded!')

    // Initialize engine
    Module._initializeEngine()

    // Function to allocate audio buffers on the emscripten heap
    function allocateAudioBufferOnHeap(channelCount, bufferSize)
    {
        let heapBufferPointer = Module._malloc(channelCount * bufferSize * Module.HEAPF32.BYTES_PER_ELEMENT)
        let audioBufferOnHeap = Array(channelCount).fill(null)

        audioBufferOnHeap.reduce((pointer, item, index) =>
            {
                audioBufferOnHeap[index] = Module.HEAPF32.subarray(pointer, pointer + bufferSize)
                return pointer + bufferSize
            },
            heapBufferPointer / Module.HEAPF32.BYTES_PER_ELEMENT)

        return {
            pointer: heapBufferPointer,
            buffer: audioBufferOnHeap
        }
    }

    // Allocate audio buffers on the emscripten heap
    inputAudioBuffer = allocateAudioBufferOnHeap(INPUT_CHANNEL_COUNT, BUFFER_SIZE)
    outputAudioBuffer = allocateAudioBufferOnHeap(OUTPUT_CHANNEL_COUNT, BUFFER_SIZE)

    // Register on audio process callback
    scriptProcessorNode.onaudioprocess = function(audioProcessingEvent)
    {
        // Copy event input buffer to input buffer on heap
        for (channel = 0; channel < INPUT_CHANNEL_COUNT; ++channel)
            audioProcessingEvent.inputBuffer.copyFromChannel(inputAudioBuffer.buffer[channel], channel)

        // Call main audio processing callback
        Module._mainAudioCallback(
            inputAudioBuffer.pointer,
            outputAudioBuffer.pointer,
            INPUT_CHANNEL_COUNT,
            OUTPUT_CHANNEL_COUNT,
            BUFFER_SIZE)

        // Copy output buffer on heap to event output buffer
        for (channel = 0; channel < OUTPUT_CHANNEL_COUNT; ++channel)
            audioProcessingEvent.outputBuffer.copyToChannel(outputAudioBuffer.buffer[channel], channel)
    }

    // Connect audio nodes
    scriptProcessorNode.connect(audioContext.destination)
}

// Terminate audio processing
window.onbeforeunload = function()
{
    // Disconnect audio nodes
    microphoneNode.disconnect(scriptProcessorNode)
    scriptProcessorNode.disconnect(audioContext.destination)

    // Free our audio buffer memory
    Module._free(inputAudioBuffer.pointer)
    Module._free(outputAudioBuffer.pointer)

    // Terminate engine
    Module._terminateEngine()
}
