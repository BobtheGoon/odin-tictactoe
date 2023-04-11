const playerFactory = (name, marker) => {
  return {name, marker}
}


const GameBoard = () => {
  const board = [[[], [], []], [[], [], []], [[], [], []]]

  const getBoard = () => board
  
  const updateCell = (cellCoord, marker) => {
      //cellCord contains array position as a tuple (y, x) and marker is either x or o
      const [y, x] = cellCoord
      board[y][x] = marker
  }

  const printBoard = () => {
    const boardWithValues = board.map((row => row.map(cell => cell)))
    console.log(boardWithValues)
  }

  return {getBoard, updateCell, printBoard}
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

  const checkForWin = () => {}

  const playRound = (cellCoord) => {
    let marker = getActivePlayer().marker
    
    //Check if cell already contains a mark
    if (!Array.isArray(board[y][x])) {
      console.log('Already used!')
      //Ask for new coordinates
    }


    board.updateCell(cellCoord, marker)

    switchActivePlayer()
    printNewRound()
  }

  return {getActivePlayer, playRound}
};


const DisplayController = () => {} //We will finish this when working on the GUI


let game = GameController('Bob', 'Alice')