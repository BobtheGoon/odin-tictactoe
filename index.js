const cellCoordToIdMap = {
  '0' : [0, 0],
  '1' : [0, 1],
  '2' : [0, 2],
  '3' : [1, 0],
  '4' : [1, 1],
  '5' : [1, 2],
  '6' : [2, 0],
  '7' : [2, 1],
  '8' : [2, 2],
}

const playerFactory = (name, marker) => {
  return {name, marker}
}


const GameBoard = () => {
  let board = [[[], [], []], [[], [], []], [[], [], []]]

  const getBoard = () => board

  const getBoardCell = (y, x) => board[y][x]
  
  const updateCell = (cellCoord, marker) => {
      //cellCord contains array position as a tuple (y, x) and marker is either x or o
      const [y, x] = cellCoord
      board[y][x] = marker
  }

  const printBoard = () => {
    const boardWithValues = board.map((row => row.map(cell => cell)))
    console.log(boardWithValues)
  }

  const checkForWin = () => {
    const checkRowsForWin = () => {
      //We need a flag, since we cannot return from a forEach loop
      let won = false
      //Loop through each row and check if the markers are the same
      board.forEach(row => {
        if (row[0] === row[1] && row[1] === row[2]) won = true
      })
      return won
    }

    const checkColumnsForWin = () => {
      //Loop through each column and check if the markers are the same
      //Check that the other cells of the column contain the same marker, i === 0 since we only need to loop over one row
      for (i = 0; i < board[0].length; ++i) {
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) return true
      }
      return false
    }

    const checkDiagonalsForWin = () => {
      //Loop through the diagonals and check if the markers are the same
      if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) return true
      if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) return true

      return false
    }

    //Run checks and return result
    //Check rows
    if (checkRowsForWin()) return true

    //Check columns
    if (checkColumnsForWin()) return true

    //Check diagonals
    if (checkDiagonalsForWin()) return true

    return false
  }

  const checkForTie = () => {
    for (i = 0; i < board.length; ++i) {
      //If board contains empty spots, game hasnt tied
      for (j = 0; j < board[i].length; ++j) {
        if (Array.isArray(board[i][j])) return false
        }
      }
    return true
  }

  const resetBoard = () => board = [[[], [], []], [[], [], []], [[], [], []]]

  return {getBoard, updateCell, getBoardCell, printBoard, resetBoard, checkForWin, checkForTie}
};


const GameController = (playerOneName, playerTwoName) => {
  const board = GameBoard()

  //Create players and assign correct marks
  const players = [
      playerFactory(playerOneName, 'x'),
      playerFactory(playerTwoName, 'o')
  ]

  let activePlayer = players[0]
  const getActivePlayer = () => activePlayer

  const switchActivePlayer = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }

  const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };

  const hasPlayerWon = () => {
    return board.checkForWin()
  }

  const hasGameTied = () => {
    return board.checkForTie()
  }

  //This function takes the coordinates from selected cell, currently prompting for user input
  const selectCoords = () => {
    return [y, x] = prompt().split(' ')
  }

  const playRound = () => {
    let marker = getActivePlayer().marker
    let [y, x] = selectCoords()

    //Check if cell already contains a mark, if so ask for new coordinates
    while (!Array.isArray(board.getBoardCell(y, x))) {
      console.log('Already used!')
      //Ask for new coordinates
      const [newY, newX] = selectCoords()
      y = newY
      x = newX
    }

    board.updateCell([y, x], marker)
    if (hasPlayerWon()) {
      console.log(`Congratulations ${getActivePlayer().name}, YOU WON!`)
      board.resetBoard()
    }

    else if (hasGameTied()) {
      console.log('Its a tie!')
      board.resetBoard()
    }

    else { 
      switchActivePlayer()
      printNewRound()
    }
  }

  return {board, getActivePlayer, playRound}
};


const DisplayController = () => {
  /*  1. We need to display the active player
      2. We need to render the gameboards content that match our GameBoard object
      3. We need to add event listeners to board cells for clicking
  */

  //Map to change cell id to x, y coords on grid
  const cellCoordToIdMap = {
    '0' : [0, 0],
    '1' : [0, 1],
    '2' : [0, 2],
    '3' : [1, 0],
    '4' : [1, 1],
    '5' : [1, 2],
    '6' : [2, 0],
    '7' : [2, 1],
    '8' : [2, 2],
  }

  //Add event listeners to cells which trigger a new round to be played and pass in the selected cells coordinates for GameController
  const addCellEventListeners = () => {
    const clickBoardCell = (e) => {
      console.log(e.target)
      //Convert cell id to cell coordinates
      const [y, x] = cellCoordToIdMap[e.target.id]
      //Start the round and pass in the cell coordinates as parameters
      game.playRound(y, x)
    }
    
    const cellDivs = document.getElementsByClassName('cell')
    console.log(cellDivs)
    
    //Loop over each cell and assign it clickBoardCell as the event listener
    for (i = 0; i < cellDivs.length; ++i) {
      cellDivs[i].addEventListener('click', clickBoardCell)
    }
  }

  addCellEventListeners()
  const game = GameController('Bob', 'Alice')
  const playerTurnDiv = document.getElementById('active-player')
  const boardDiv = document.getElementById('board')
  
  const updateScreen = () => {
    const renderBoard = (board) => {
      //Render board values into correct cells
    }

    const board = game.board.getBoard()
    renderBoard(board)

    const activePlayer = game.getActivePlayer()
    playerTurnDiv.textContent = activePlayer.name
  }
  updateScreen()
}

DisplayController()