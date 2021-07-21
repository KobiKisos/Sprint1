// Display/UI
//creating levels:

// // //level1(4x4)
// document.getElementById("level1");
// if (el.addEventListener){
//     el.addEventListener("click",  buildBoard(4,2), false);}
// else if (el.attachEvent){
//     el.attachEvent('onclick',  Board = buildBoard(4,2))
//   }
// //level2(8x8)

// document.getElementById("level2");
// if (el.addEventListener){
//     el.addEventListener("click", buildBoard(8,12), false);}
// else if (el.attachEvent){
//     el.attachEvent('onclick', Board = buildBoard(8,12));
// }

// //level2(12x12)
// document.getElementById("level3");
// if (el.addEventListener){
//     el.addEventListener("click", buildBoard(12,30), false);}
// else if (el.attachEvent){
//     el.attachEvent('onclick', Board = buildBoard(12,30));
// }

import {
  TILE_STATUSES,
  buildBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js"

 //starter values
 var BOARD_SIZE = 4;
 var NUMBER_OF_MINES = 2;

 const board = buildBoard(4, 2);

document.getElementById("Begginer").onclick = buildBoard(4,2);
document.getElementById("Medium").onclick = buildBoard(8,12);
document.getElementById("expert").onclick = buildBoard(12,30);

// const board = buildBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".Board")
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".subtext")

//not sure if arrow function syntax is correct!
board.forEach(row => {
  row.forEach(tile => {
    //event listeners inside the Board:
    boardElement.append(tile.element)
    tile.element.addEventListener("click", () => {
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener("contextmenu", e => {
      e.preventDefault()
      markTile(tile)
      listMinesLeft()
    })
  })
})
//presetn board after user clicks and triggers event.
boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

// listMinesLeft

function setMinesNegsCount(board) {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    )
  }, 0)

  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameOver() {
  const win = checkWin(board)
  const lose = checkLose(board)

  //need to find more clear syntax("contextmenu", stopProp, { capture: true }) - found it online
  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true })
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })
  }

  if (win) {
    messageText.textContent = "You Win"
  }
  if (lose) {
    messageText.textContent = "You Lose"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}
//need to find more clear syntax("contextmenu", stopProp, { capture: true }) - found it online
function stopProp(e) {
  e.stopImmediatePropagation()
}