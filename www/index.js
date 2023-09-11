import {Board, Token} from "wasm-c4";
import {memory} from "wasm-c4/c4_bg"

const CELL_SIZE = 100;
const GRID_COLOUR = "#000000"
const EMPTY_COLOUR = "#FFFFFF"
const P1_COLOUR = "#FF0000"
const P2_COLOUR = "#FFFF00"

const canvas = document.getElementById("board");
canvas.height = (Board.get_height()) * (CELL_SIZE + 1) + 1;
canvas.width = (Board.get_width()) * (CELL_SIZE + 1) + 1;

let board;
let currentPlayer;

function startGame(canvas) {
    board = Board.new();
    currentPlayer = Token.P1;

    const ctx = canvas.getContext('2d');
    canvas.addEventListener("mousedown", handleClick);

    drawGrid(ctx);
    for (let i = 0; i < Board.get_width(); i++) {
        drawColumn(ctx, board, i);
    }

    document.getElementById("error").innerText = "";
    document.getElementById("current_player").innerText = `It's ${Token[currentPlayer.toString()]}'s turn!`;
}

function drawGrid(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOUR;

    // vertical lines
    for (let i = 0; i <= Board.get_width(); i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * Board.get_height() + 1);
    }

    // horizontal lines
    for (let i = 0; i <= Board.get_height(); i++) {
        ctx.moveTo(0, i * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * Board.get_width() + 1, i * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
}

function drawColumn(ctx, board, colIdx) {
    const columnPtr = board.get_column(colIdx);
    const tokens = new Uint8Array(memory.buffer, columnPtr, Board.get_height());

    ctx.beginPath();

    for (let row = Board.get_height() - 1; row >= 0; row--) {
        switch (tokens[row]) {
            case Token.Empty:
                ctx.fillStyle = EMPTY_COLOUR;
                break;
            case Token.P1:
                ctx.fillStyle = P1_COLOUR;
                break;
            case Token.P2:
                ctx.fillStyle = P2_COLOUR;
                break;
        }
        ctx.fillRect(
            colIdx * (CELL_SIZE + 1) + 1,
            ((Board.get_height() - 1) - row) * (CELL_SIZE + 1) + 1,
            CELL_SIZE,
            CELL_SIZE
        );
    }

    ctx.stroke();
}

function getIndexOfColumnFromMouseLocation(event) {
    return Math.trunc(event.offsetX / (CELL_SIZE + 1));
}

function handleClick(event) {
    let ctx = canvas.getContext("2d");
    let col = getIndexOfColumnFromMouseLocation(event);

    document.getElementById("error").innerText = "";

    try {
        board.drop_token(col, currentPlayer);
        drawColumn(ctx, board, col);

        currentPlayer = currentPlayer === Token.P1 ? Token.P2 : Token.P1;
        document.getElementById("current_player").innerText = `It's ${Token[currentPlayer.toString()]}'s turn!`;
    } catch (e) {
        document.getElementById("error").innerText = e;
    }
}

/////////////////////////////////
// ENTRYPOINT ///////////////////
/////////////////////////////////

startGame(canvas);
document.getElementById("restart_button").addEventListener("click", () => startGame(canvas))