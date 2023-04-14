const playerFactory = (name, marker) => {
  return {name, marker}
}


const GameBoard = () => {
  const board = [[[], [], []], [[], [], []], [[], [], []]]

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

  return {getBoard, updateCell, getBoardCell, printBoard}
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

  const hasPlayerWon = (board) => {
    let won = false
    //Loop through each row and check if the markers are the same
    board.forEach(row => {
      if (row[0] === row[1] && row[1] === row[2]) {
        won = true
      }
    })

    //Loop through each column and check if the markers are the same
    for (i = 0; i < board.length; ++i) {
      //Check that the other cells of the column contain the same marker, i === 0 since we only need to loop over one row
      if (i === 0) {
        for (j = 0; j < board[i].length; ++j) {
          if (board[i][j] === board[i+1][j] && board[i+1][j] === board[i+2][j]) won = true
        }
      }
    }
    //Loop through the diagonals and check if the markers are the same
    


    if (won) return true
    else return false
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
    console.log(hasPlayerWon(board.getBoard()))

    switchActivePlayer()
    printNewRound()
  }

  return {getActivePlayer, playRound}
};


const DisplayController = () => {} //We will finish this when working on the GUI


let game = GameController('Bob', 'Alice')