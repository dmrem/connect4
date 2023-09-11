mod utils;

use crate::utils::set_panic_hook;
use std::fmt;
use wasm_bindgen::prelude::*;

const BOARD_WIDTH: usize = 7;
const BOARD_HEIGHT: usize = 6;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Token {
    Empty = 0,
    P1 = 1,
    P2 = 2,
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Board {
    // a board is represented in memory as being tilted on its right side
    // each inner array represents a column, not a row
    // first index in each inner array is the bottom
    board: [[Token; BOARD_HEIGHT]; BOARD_WIDTH],
}

// code in this impl block is exposed to javascript
#[wasm_bindgen]
impl Board {
    pub fn new() -> Board {
        set_panic_hook();
        Board {
            board: [[Token::Empty; BOARD_HEIGHT]; BOARD_WIDTH], // initialize with all positions empty
        }
    }

    pub fn drop_token(&mut self, col: usize, t: Token) -> Result<(), String> {
        if t != Token::P1 && t != Token::P2 {
            return Err("Cannot drop an unknown token!".to_string());
        }

        match self.board.get_mut(col) {
            None => Err("Column does not exist!".to_string()),
            Some(column) => match column
                .iter()
                .position(|token: &Token| *token == Token::Empty)
            {
                None => Err("Column is full!".to_string()),
                Some(empty_pos) => {
                    column[empty_pos] = t;
                    Ok(())
                }
            },
        }
    }


    // this function returns a pointer to the beginning of the array for whichever column was requested
    // this is used by the JS code to avoid copying the entire array into a JS object, since that's slow
    // instead, the JS can just get the pointer and read the WASM memory directly
    pub fn get_column(&self, col_idx: usize) -> *const Token {
        self.board[col_idx].as_ptr()
    }

    pub fn get_height() -> usize {
        BOARD_HEIGHT
    }

    pub fn get_width() -> usize {
        BOARD_WIDTH
    }
}

impl fmt::Display for Board {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let s = (0..BOARD_HEIGHT)
            .rev()
            .map(|num| {
                self.board
                    .iter()
                    .map(|col| match col[num] {
                        Token::Empty => "⬜",
                        Token::P1 => "🔴",
                        Token::P2 => "⚫",
                    })
                    .collect::<String>()
            })
            .collect::<Vec<String>>()
            .join("\n");
        write!(f, "{}", s)?;
        Ok(())
    }
}
