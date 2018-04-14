# Command line arguments
# -O2   Good optimizations, including malloc
# -O3   Insane optimizations, but excluding malloc
# -Os   Reduced code size

# Compile engine to wasm
#emcc main.c -o build/engine.wasm -Os -s WASM=1 -s SIDE_MODULE=1
#emcc main.c -o build/engine.js -Os -s WASM=1
emcc main.c -o build/engine.js -O2 -s WASM=1 --pre-js pre.js

# Copy build files to www
cp build/engine.* ../www/
