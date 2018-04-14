// Includes
#include <emscripten.h>
#include <stdlib.h>

// Type definitions
typedef unsigned int uint32_t;
typedef float float32_t;

// Delay variables
#define DELAY_BUFFER_SIZE 48000
#define CHANNEL_COUNT 2
uint32_t delayPointer;
float32_t *delayBuffer;

// Initialize engine
EMSCRIPTEN_KEEPALIVE
void initializeEngine()
{
    delayPointer = 0;
    delayBuffer = malloc(sizeof(float32_t) * DELAY_BUFFER_SIZE * CHANNEL_COUNT);

    for (uint32_t s = 0; s < DELAY_BUFFER_SIZE * CHANNEL_COUNT; ++s)
        delayBuffer[s] = 0.0f;
}

// Terminate engine
EMSCRIPTEN_KEEPALIVE
void terminateEngine()
{
    free(delayBuffer);
}

// Main audio processing callback
EMSCRIPTEN_KEEPALIVE
void mainAudioCallback(float32_t *inputBuffer,
                       float32_t *outputBuffer,
                       uint32_t inputChannelCount,
                       uint32_t outputChannelCount,
                       uint32_t bufferSize)
{
    for (uint32_t s = 0; s < bufferSize; ++s)
    {
        // Write input buffer to delay buffer
        delayBuffer[delayPointer] = inputBuffer[s];
        delayBuffer[delayPointer + DELAY_BUFFER_SIZE] = inputBuffer[s + bufferSize];
        delayPointer = (delayPointer + 1) % DELAY_BUFFER_SIZE;

        // Write delay buffer to output buffer
        outputBuffer[s] = delayBuffer[delayPointer];
        outputBuffer[s + bufferSize] = delayBuffer[delayPointer + DELAY_BUFFER_SIZE];
    }
}
