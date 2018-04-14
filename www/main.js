Engine.onRuntimeInitialized = () =>
{
    console.log('Engine loaded!')


    // Audio buffer constants
    const INPUT_CHANNELS = 3
    const OUTPUT_CHANNELS = 2
    const BUFFER_SIZE = 8
    const BYTES_PER_SAMPLE = Float32Array.BYTES_PER_ELEMENT


    // Create dummy audio buffers
    let inputBuffers = [
        new Float32Array(BUFFER_SIZE).fill(3),
        new Float32Array(BUFFER_SIZE).fill(7),
        new Float32Array(BUFFER_SIZE).fill(11)
    ]
    let outputBuffers = [
        new Float32Array(BUFFER_SIZE).fill(0),
        new Float32Array(BUFFER_SIZE).fill(0)
    ]


    // Allocate memory on the emscripten heap
    let inputBuffersPtr = Module._malloc(INPUT_CHANNELS * BUFFER_SIZE * BYTES_PER_SAMPLE)
    let outputBuffersPtr = Module._malloc(OUTPUT_CHANNELS * BUFFER_SIZE * BYTES_PER_SAMPLE)


    // Call our main audio callback
    function onaudioprocess(inputBuffers, outputBuffers)
    {
        // Copy our input audio buffers to the heap
        Module.HEAPF32.set(inputBuffers[0], inputBuffersPtr / BYTES_PER_SAMPLE)
        Module.HEAPF32.set(inputBuffers[1], inputBuffersPtr / BYTES_PER_SAMPLE + BUFFER_SIZE)
        Module.HEAPF32.set(inputBuffers[2], inputBuffersPtr / BYTES_PER_SAMPLE + BUFFER_SIZE * 2)

        // Call our audio callback function
        Module._mainAudioCallback(
            inputBuffersPtr,
            outputBuffersPtr,
            INPUT_CHANNELS,
            OUTPUT_CHANNELS,
            BUFFER_SIZE)

        // Copy our output audio buffers from the heap
        outputBuffers[0].set(Module.HEAPF32.subarray(
            outputBuffersPtr / BYTES_PER_SAMPLE,
            outputBuffersPtr / BYTES_PER_SAMPLE + BUFFER_SIZE), 0)

        outputBuffers[1].set(Module.HEAPF32.subarray(
            outputBuffersPtr / BYTES_PER_SAMPLE + BUFFER_SIZE,
            outputBuffersPtr / BYTES_PER_SAMPLE + BUFFER_SIZE * 2), 0)
    }

    console.log("Output buffers before processing: ", outputBuffers.toString())
    onaudioprocess(inputBuffers, outputBuffers)
    console.log("Output buffers after processing: ", outputBuffers.toString())


    // Free our buffer memory
    Module._free(inputBuffersPtr)
    Module._free(outputBuffersPtr)
}
