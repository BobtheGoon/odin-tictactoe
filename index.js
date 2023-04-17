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


const DisplayController = () => {
  //Map to change cell id to x, y coords on grid
  const cellIdToCoordMap = {
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
  
  const renderBoard = (boardArray) => {
    //Render board values into correct cells
    const cellDivs = document.getElementsByClassName('cell')

    let cellCounter = 0
    for (i = 0; i < boardArray.length; ++i) {
      for (j = 0; j < boardArray[i].length; ++j) {
        //Get the marker for the position
        const marker = boardArray[i][j]

        //Check that cell contains a marker and update the cells textcontent
        if (!Array.isArray(marker)) {
          cellDivs[cellCounter].textContent = marker
        }
        cellCounter++
      }
    }
  }

  //Screen rendering loop
  const updateScreen = (board, getActivePlayer) => {
    //Update boards content
    renderBoard(board.getBoard())
    
    //Update active players name on display
    const activePlayer = getActivePlayer()
    const playerTurnDiv = document.getElementById('active-player')
    playerTurnDiv.textContent = activePlayer.name
  }

  const resetScreen = () => {
    const cellDivs = document.getElementsByClassName('cell')
    let cellCounter = 0
    for (i = 0; i < cellDivs.length; ++i) {
      cellDivs[cellCounter].textContent = ''
      cellCounter++
    }
  }

  //Add event listeners to cells which trigger a new round to be played and pass in the selected cells coordinates for GameController
  const addCellEventListeners = (playRound) => {
    //Event listener
    const clickBoardCell = (e) => {
      //Convert cell id to cell coordinates
      const [y, x] = cellIdToCoordMap[e.target.id]
      //Add parameter function as event listener
      playRound(y, x)
    }
    
    //Assign event listeners to cell divs
    const cellDivs = document.getElementsByClassName('cell')    
    //Loop over each cell and assign it clickBoardCell as the event listener
    for (i = 0; i < cellDivs.length; ++i) {
      cellDivs[i].addEventListener('click', clickBoardCell)
    }
  }

  return {updateScreen, resetScreen, addCellEventListeners}
}

const GameController = () => {
  const board = GameBoard()
  const display = DisplayController()

  //Create players and assign correct marks
  const players = [
      playerFactory('', 'X'),
      playerFactory('', 'O')
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

  const updatePlayerNames = (playerOneName, playerTwoName) => {
    players[0].name = playerOneName
    players[1].name = playerTwoName
    display.updateScreen(board, getActivePlayer)
  }

  const playRound = (y, x) => {
    let marker = getActivePlayer().marker

    //Check if cell already contains a mark, if so ask for new coordinates
    while (!Array.isArray(board.getBoardCell(y, x))) {
      console.log('Already used!')
      return
    }

    board.updateCell([y, x], marker)
    if (hasPlayerWon()) {
      console.log(`Congratulations ${getActivePlayer().name}, YOU WON!`)
      display.resetScreen()
      board.resetBoard()
    }

    else if (hasGameTied()) {
      console.log('Its a tie!')
      display.resetScreen()
      board.resetBoard()
    }

    else { 
      switchActivePlayer()
      printNewRound()
      display.updateScreen(board, getActivePlayer)
    }
  }

  //Initial render and display
  display.addCellEventListeners(playRound)
  
  return {updatePlayerNames}
};


const createPlayerNameInput = (game) => {
  const updateNames = (game) => {
    const playerOneName = document.forms['start-game'].elements['player-one'].value 
    const playerTwoName = document.forms['start-game'].elements['player-two'].value
    
    game.updatePlayerNames(playerOneName, playerTwoName)
  }

  //Create form for playername selection
  const form = document.createElement('form')
  form.id ='start-game'

  //Player one
  const playerOneLabel = document.createElement('label')
  playerOneLabel.for = 'player-one'
  playerOneLabel.textContent = 'Player 1 name'
  const playerOneInput = document.createElement('input')
  playerOneInput.type = 'text'
  playerOneInput.id = 'player-one'

  //Player two
  const playerTwoLabel = document.createElement('label')
  playerTwoLabel.for = 'player-two'
  playerTwoLabel.textContent = 'Player 2 name'
  const playerTwoInput = document.createElement('input')
  playerTwoInput.type = 'text'
  playerTwoInput.id = 'player-two'

  //Set name Button
  const setNameButton = document.createElement('button')
  setNameButton.for = 'start-game'
  setNameButton.textContent = 'Start Game'
  setNameButton.onclick = function(e) {e.preventDefault(); updateNames(game)}

  document.body.appendChild(form)
  form.appendChild(playerOneLabel)
  form.appendChild(playerOneInput)
  form.appendChild(playerTwoLabel)
  form.appendChild(playerTwoInput)
  form.appendChild(setNameButton)
}


//Main game loop
const game = GameController()
createPlayerNameInput(game)