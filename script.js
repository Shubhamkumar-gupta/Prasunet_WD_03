const gameBoard = document.getElementById('gameBoard');
const resetButton = document.getElementById('resetButton');
const cells = document.querySelectorAll('.cell');
const playWithFriendButton = document.getElementById('playWithFriend');
const playWithAIButton = document.getElementById('playWithAI');
const gameModeSelection = document.getElementById('gameModeSelection');
const resultDisplay = document.getElementById('result');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playWithAI = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const startGame = (withAI) => {
    playWithAI = withAI;
    gameModeSelection.style.display = 'none';
    gameBoard.style.display = 'grid';
    resultDisplay.style.display = 'none';
};

const handleCellClick = (e) => {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();

    if (gameActive && playWithAI && currentPlayer === 'O') {
        handleAIMove();
    }
};

const updateCell = (cell, index) => {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
};

const checkResult = () => {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        highlightWinningCells(winningCells);
        displayResult(`${currentPlayer} has won!`);
        return;
    }

    if (!board.includes('')) {
        gameActive = false;
        displayResult('It\'s a draw!');
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

const highlightWinningCells = (winningCells) => {
    winningCells.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
};

const displayResult = (message) => {
    resultDisplay.textContent = message;
    resultDisplay.style.display = 'block';
};

const handleAIMove = () => {
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            emptyCells.push(i);
        }
    }

    const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = document.querySelector(`.cell[data-index="${randomCellIndex}"]`);

    updateCell(cell, randomCellIndex);
    checkResult();
};

const resetGame = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
    resultDisplay.style.display = 'none';
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
playWithFriendButton.addEventListener('click', () => startGame(false));
playWithAIButton.addEventListener('click', () => startGame(true));
