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

  return {getActivePlayer, playRound}
};


const DisplayController = () => {} //We will finish this when working on the GUI


let game = GameController('Bob', 'Alice')