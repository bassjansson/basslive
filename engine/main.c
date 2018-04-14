// Includes
#include <emscripten.h>

// Type definitions
typedef unsigned int uint32_t;
typedef float float32_t;

// Main audio callback
EMSCRIPTEN_KEEPALIVE
void mainAudioCallback(float32_t *inputBuffers,
                       float32_t *outputBuffers,
                       uint32_t inputChannels,
                       uint32_t outputChannels,
                       uint32_t bufferSize)
{
    for (uint32_t s = 0; s < bufferSize; ++s)
    {
        outputBuffers[s] = 0.0f;
        outputBuffers[s + bufferSize] = 13.0f;

        for (uint32_t c = 0; c < inputChannels; ++c)
            outputBuffers[s] += inputBuffers[s + c * bufferSize];
    }
}
