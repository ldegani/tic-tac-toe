const Player = (player, mark) => {
  const getPlayer = () => player;
  const getMark = () => mark;
  return { player, mark };
};


function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  return { getBoard };
}


function Cell() {
  let value = '';

  const addMarker = (playerMark) => {
    value = playerMark;
  };

  const getValue = () => value;

  return { addMarker, getValue }
}


function GameController() {
  const board = GameBoard();
  const players = [
    Player('Player 1', 'X'),
    Player('Player 2', 'O')
  ];
  let p1Points = 0;
  let p2Points = 0;
  let counter = 0;
  let isOver = false;
  let activePlayer = players[0];

  const resetGame = () => {
    activePlayer = players[0];
    isOver = false;
    counter = 0;
  }

  const switchPlayerTurn = () => {
    activePlayer = (activePlayer === players[0]) ? players[1] : players[0]
  }

  const getActivePlayer = () => activePlayer;

  const checkWinner = () => {
    if (isOver) return true;
    const resultMessage = document.querySelector('.result');
    const modal = document.querySelector('.modal_container');
    if (checkForWin(activePlayer.mark)) {
      resultMessage.textContent = `${activePlayer.player} won!`;
      modal.style.display = 'block';
      scoreboardChanger(activePlayer.mark)
      isOver = true;
      return true;
    }
    if (counter > 8) {
      modal.style.display = 'block';
      resultMessage.textContent = 'Draw! ';
    }
    return false;
  }

  const playRound = () => {
    counter++;
    if (checkWinner()) return true;
    switchPlayerTurn();
  }

  const checkForWin = (playerMark) => {
    const boardGame = board.getBoard();
    const winningCombos = [
      [[0,0], [0,1], [0,2]],
      [[1,0], [1,1], [1,2]],
      [[2,0], [2,1], [2,2]],
      [[0,0], [1,0], [2,0]],
      [[0,1], [1,1], [2,1]],
      [[0,2], [1,2], [2,2]],
      [[0,0], [1,1], [2,2]],
      [[0,2], [1,1], [2,0]],
    ]
    
    return winningCombos.some(combo => {
      const [a, b, c] = combo;
      return (
        boardGame[a[0]][a[1]].getValue() === playerMark &&
        boardGame[b[0]][b[1]].getValue() === playerMark &&
        boardGame[c[0]][c[1]].getValue() === playerMark
      );
    });
  }

  const scoreboardChanger = (player) => {
    if (isOver) return;
    player === 'X' ? p1Points++ : p2Points++;
    const scoreboard = document.querySelector('.scoreboard')
    scoreboard.textContent = `${p1Points} : ${p2Points}`
  }
  
  return { getActivePlayer, playRound, getBoard: board.getBoard, checkWinner, resetGame, isOver }
}


function ScreenController() {
  const game = GameController();
  const boardDiv = document.querySelector('.container-game');
  const btnClear = document.querySelector('#btn_clear');
  const btnRestart = document.querySelector('#btn_restart');
  const modal = document.querySelector('.modal_container');

  const updateScreen = () => {
    boardDiv.textContent = '';

    const board = game.getBoard();

    // Render board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const boardButton = document.createElement('button');
        boardButton.classList.add('game-square');
        boardButton.dataset.row = rowIndex;
        boardButton.dataset.column = columnIndex;
        boardButton.textContent = cell.getValue();
        boardDiv.appendChild(boardButton);
      })
    })
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedColumn || !selectedRow) return;
    if (game.checkWinner()) return;
    
    const activePlayer = game.getActivePlayer();
    const selectedCell = game.getBoard()[selectedRow][selectedColumn];
    
    if (selectedCell.getValue() !== '') return;

    selectedCell.addMarker(activePlayer.mark);
    updateScreen();
    game.playRound();
  }

  function clickClearBoard() {
    const board = game.getBoard();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j].addMarker('');
        updateScreen();
      }
    }
    game.resetGame();
  }

  function clickRestart() {
    window.location.reload();
  }

  function closeModal(event) {
    if(
      event.target.classList.contains('modal_container') ||
      event.target.classList.contains('result') 
      ) { modal.style.display = 'none'; }
  }

  boardDiv.addEventListener('click', clickHandlerBoard);
  btnClear.addEventListener('click', clickClearBoard);
  btnRestart.addEventListener('click', clickRestart);
  modal.addEventListener('click', closeModal);
  
  updateScreen();
}


ScreenController();