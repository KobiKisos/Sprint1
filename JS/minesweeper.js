
//Functionality and Features
// • Show a timer that starts on first click (right / left) and stops
// when game is over.
// • Left click reveals the cell’s content
// • Right click flags/unflags a suspected cell (you cannot reveal a
// flagged cell)
// • Game ends when:
// o LOSE: when clicking a mine, all mines should be revealed
// o WIN: all the mines are flagged, and all the other cells are
// shown
// • Support 3 levels of the game
// o Beginner (4*4 with 2 MINES)
// o Medium (8 * 8 with 12 MINES)
// o Expert (12 * 12 with 30 MINES)
// • If you have the time, make your Minesweeper look great.
// • Expanding: When left clicking on cells there are 3 possible
// cases we want to address:
// o MINE – reveal the mine clicked
// o Cell with neighbors – reveal the cell alone
// o Cell without neighbors – expand it and its 1
// st degree
// neighbors
 
// Expanding Bonus: (only if time permits) Expand like in the real
// game (“Full expand”):
// Comment regarding Bonus Tasks: implement the NON-Bonus tasks
// first. The Non-Bonus tasks represent the level required at the stage.
// Only if you have time – implement the Bonus tasks


// Step1 – the seed app:
// 1. Create a 4x4 gBoard Matrix containing Objects. Place 2 mines
// manually when each cell’s isShown set to true.
// 2. Present the mines using renderBoard() function.


// Step2 – counting neighbors:
// 1. Create setMinesNegsCount() and store the numbers
// (isShown is still true)
// 2. Present the board with the neighbor count and the mines
// using renderBoard() function.
// 3. Have a console.log presenting the board content – to help
// you with debugging


// Step3 – click to reveal:
// 1. Make sure your renderBoard() function adds the cell ID to
// each cell and onclick on each cell calls cellClicked()
// function.
// 2. Make the default “isShown” to be “false”
// 3. Implement that clicking a cell with “number” reveals the
// number of this cell


// Step4 – randomize mines' location:
// 1. Randomly locate the 2 mines on the board
// 2. Present the mines using renderBoard() function.
// Next Steps: Head back to Functionality and Features and then
// on to Further Tasks, and if time permits check out the Bonus
// Tasks section.

//*****UI Guidelines
// This sprint is not a UI-centered project. However, we recommend to
// try implementing the following UI concepts:
// 1. Board is square and cells are squares
// 2. Cells keep their size when hovered and when revealed
// 3. Board keeps its position (shouldn't move) along all game
// phases (do not add UI elements dynamically above it)
// 4. Mines look like mines.
// 5. Add a footer at the bottom of the page with your full name.

//******************************************* */
// Further Tasks
// First click is never a Mine
// Make sure the first clicked cell is never a mine (like in the real
// game)
// HINT: place the mines and count the neighbors only on first
// click.

// Lives
// Add support for “LIVES” -
// The user has 3 LIVES:
// When a MINE is clicked, there is an indication to the user that
// he clicked a mine. The LIVES counter decrease. The user can
// continue playing.

// The Smiley
// Add smiley (feel free to switch icons \ images):
// • Normal
// • Sad & Dead – LOSE (stepped on a mine)
// • Sunglasses – WIN
// • Clicking the smiley should reset the game

// Bonus Tasks – if time permits
// Add support for HINTS
// The user has 3 hints
// When a hint is clicked, it changes its look, example:
// Now, when a cell (unrevealed) is clicked, the cell and its
// neighbors are revealed for a second, and the clicked hint
// disappears

// Best Score
// Keep the best score in local storage (per level) and show it on
// the page

// Full Expand
// When an empty cell is clicked, open all empty cells that are
// connected and their numbered neighbors (as is done at the
// game) this feature is normally implemented using recursion.

// Safe click
// Add a Safe-Click Button:
// The user has 3 Safe-Clicks
// Clicking the Safe-Click button will mark a random covered cell
// (for a few seconds) that is safe to click (does not contain a
// MINE).
// Present the remaining Safe-Clicks count
// Manually positioned mines
// Create a “manually create” mode in which user first positions
// the mines (by clicking cells) and then plays.
// Undo
// Add an “UNDO” button, each click on that button takes the
// game back by one step (can go all the way back to game start).


//*****************************************************************************************************/

/*
	Minesweeper.js
	Author: Kobi kisos
	
	Desccription:
		Javascript implementation of the classic game, Minesweeper	
*/




export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
  }
  
  export function buildBoard(BOARD_SIZE, NUMBER_OF_MINES) {
    const board = []
    const minePositions = getMinePositions(BOARD_SIZE, NUMBER_OF_MINES)
  
    for (let x = 0; x < BOARD_SIZE; x++) {
      const row = []
      for (let y = 0; y < BOARD_SIZE; y++) {
        const element = document.createElement("div")
        element.dataset.status = TILE_STATUSES.HIDDEN
  
        const tile = {
          element,
          x,
          y,
          mine: minePositions.some(positionMatch.bind(null, { x, y })),
          get status() {
            return this.element.dataset.status
          },
          set status(value) {
            this.element.dataset.status = value
          },
        }
  
        row.push(tile)
      }
      board.push(row)
    }
  
    return board
  }
  
  export function markTile(tile) {
    if (
      tile.status !== TILE_STATUSES.HIDDEN &&
      tile.status !== TILE_STATUSES.MARKED
    ) {
      return
    }
  
    if (tile.status === TILE_STATUSES.MARKED) {
      tile.status = TILE_STATUSES.HIDDEN
    } else {
      tile.status = TILE_STATUSES.MARKED
    }
  }
  
  export function revealTile(board, tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
      return
    }
  
    if (tile.mine) {
      tile.status = TILE_STATUSES.MINE
      return
    }
  
    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)
    const mines = adjacentTiles.filter(t => t.mine)
    if (mines.length === 0) {
      adjacentTiles.forEach(revealTile.bind(null, board))
    } else {
      tile.element.textContent = mines.length
    }
  }
  ////not sure if arrow function syntax is correct!
  export function checkGameOver(board) {
    return board.every(row => {
      return row.every(tile => {
        return (
          tile.status === TILE_STATUSES.NUMBER ||
          (tile.mine &&
            (tile.status === TILE_STATUSES.HIDDEN ||
              tile.status === TILE_STATUSES.MARKED))
        )
      })
    })
  }
  ////not sure if arrow function syntax is correct!
  export function checkLose(board) {
    return board.some(row => {
      return row.some(tile => {
        return tile.status === TILE_STATUSES.MINE
      })
    })
  }
  

  //getting mine position
  function getMinePositions(boardSize, numberOfMines) {
    const positions = []
  
    while (positions.length < numberOfMines) {
      const position = {
        x: randomNumber(boardSize),
        y: randomNumber(boardSize),
      }
  
      if (!positions.some(positionMatch.bind(null, position))) {
        positions.push(position)
      }
    }
  
    return positions
  }
  
  function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y
  }
  
  function randomNumber(size) {
    return Math.floor(Math.random() * size)
  }
  
  function nearbyTiles(board, { x, y }) {
    const tiles = []
  
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        const tile = board[x + xOffset]?.[y + yOffset]
        if (tile) tiles.push(tile)
      }
    }
  
    return tiles
  }

  export function reload(){
    window.location.reload();
}

  // function handleCellClick(cell, i, j) {
  //   if (!components.alive) {
  //       return;
  //   }

  //   if (cell.flagged) {
  //       return;
  //   }

  //   cell.clicked = true;

  //   if (components.bombs[i][j]) {
  //       cell.style.color = 'red';
  //       cell.textContent = components.bomb;
  //       gameOver();
        
  //   }
  //   else {
  //       cell.style.backgroundColor = 'lightGrey';
  //       num_of_bombs = adjacentBombs(i, j);
  //       if (num_of_bombs) {
  //           cell.style.color = components.colors[num_of_bombs];
  //           cell.textContent = num_of_bombs;
  //       } 
  //       else {
  //           clickAdjacentBombs(i, j);
  //       }
  //   }
// }
// function clickAdjacentBombs(row, col) {
//   var i, j, cell;
  
//   for (i=-1; i<2; i++) {
//       for (j=-1; j<2; j++) {
//           if (i === 0 && j === 0) {
//               continue;
//           }
//           cell = document.getElementById(cellID(row + i, col + j));
//           if (!!cell && !cell.clicked && !cell.flagged) {
//               handleCellClick(cell, row + i, col + j);
//           }
//       }
//   }
// }

// function performMassClick(cell, row, col) {
//   if (adjacentFlags(row, col) === adjacentBombs(row, col)) {
//       clickAdjacentBombs(row, col);
//   }
// }
// function gameOver() {
//   components.alive = false;
//   document.getElementById('lost').style.display="block";
  
// }

// function reload(){
//   window.location.reload();
// }