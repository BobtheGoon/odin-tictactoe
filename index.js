const playerFactory = (name, marker) => {
  return {name, marker}
}


const GameBoard = (() => {
  const board = [[[], [], []], [[], [], []], [[], [], []]]

  const getBoard = () => board
  
  const updateCell = (cellCoord, marker) => {
      //cellCord contains array position as a tuple (y, x) and marker is either x or o
      const [y, x] = cellCoord
      board[y][x] = marker
  }

  const printBoard = () => {
    const boardWithValues = board.map((row => row.map(cell => cell)))
    return boardWithValues
  }

  return {getBoard, updateCell, printBoard}
})();


const GameController = (playerOneName, playerTwoName) => {
  const board = GameBoard

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

  const playRound = (cellCoord) => {
    let marker = getActivePlayer().marker
    
    board.updateCell(cellCoord, marker)

    switchActivePlayer()
    printNewRound()
  }

  const checkForWin = () => {}

  return {getActivePlayer, playRound}
};


const DisplayController = () => {} //We will finish this when working on the GUI


let game = GameController('Bob', 'Alice')


