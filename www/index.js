import {Board} from "wasm-c4";

const pre = document.getElementById("board");

let b = Board.new();
b.drop_token(5, 2);
b.drop_token(5, 2);
b.drop_token(5, 2);
b.drop_token(5, 2);
b.drop_token(5, 1);
b.drop_token(5, 2);
pre.textContent = b.render();
