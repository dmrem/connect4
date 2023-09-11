# Connect 4

This is a Connect 4 implementation using Rust and WebAssembly.

To compile:
1. Install [Rust](https://www.rust-lang.org/tools/install).
2. Install Node.js. I recommend installing [nvm](https://github.com/nvm-sh/nvm) and running `nvm install 16`.
3. `cd` to the root of this repo. Run `cargo update` to download all Rust dependencies.
4. Run `cargo install wasm-pack` to install the WASM transpiler.
5. Run `wasm-pack build` to compile the Rust code to WASM.
6. Run `cd www; npm install` to download all Node dependencies.
7. Run `npm start` to compile the JS code and start a webserver.
8. Go to [localhost:8080](http://localhost:8080) in your local browser to access the game.